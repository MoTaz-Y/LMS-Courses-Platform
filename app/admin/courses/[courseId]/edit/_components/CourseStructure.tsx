'use client';
import React, { useEffect, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DraggableSyntheticListeners,
  KeyboardSensor,
  PointerSensor,
  rectIntersection,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AdminCourseSingualrType } from '@/app/data/admin/admin-get-course';
import { cn } from '@/lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  ChevronDown,
  ChevronRight,
  FileText,
  GripVertical,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';
import { reorderChapters, reorderLessons } from '../action';
interface iAppProps {
  data: AdminCourseSingualrType;
}
interface SortableItemProps {
  id: string;
  children: (listeners: DraggableSyntheticListeners) => React.ReactNode;
  className?: string;
  data?: {
    type: 'chapter' | 'lesson';
    chapterId?: string; // if type is lesson, then chapterId is required
  };
}
const CourseStructure = ({ data }: iAppProps) => {
  const initialItems =
    data?.chapter.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      order: chapter.position,
      isOpen: true,
      lessons: chapter.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        order: lesson.position,
      })),
    })) || [];
  const [items, setItems] = useState(initialItems);

  useEffect(() => {
    setItems((prevItems) => {
      const updatedItems =
        data?.chapter.map((chapter) => ({
          id: chapter.id,
          title: chapter.title,
          order: chapter.position,
          isOpen:
            prevItems.find((item) => item.id === chapter.id)?.isOpen || true,
          lessons: chapter.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            order: lesson.position,
          })),
        })) || [];
      return updatedItems;
    });
  }, [data]);
  function SortableItem({ id, children, className, data }: SortableItemProps) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id, data });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={cn('touch-none', className, isDragging ? 'z-10' : '')}
      >
        {children(listeners)}
      </div>
    );
  }
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      // setItems((items) => {
      //   const oldIndex = items.indexOf(active.id);
      //   const newIndex = items.indexOf(over.id);

      //   return arrayMove(items, oldIndex, newIndex);
      return;
    }
    const activeId = active.id;
    const overId = over.id;
    const activeType = active.data.current?.type as 'chapter' | 'lesson';
    const overType = over.data.current?.type as 'chapter' | 'lesson';
    const courseId = data.id;
    let targetChapterId: UniqueIdentifier | null = null;
    if (activeType === 'chapter') {
      targetChapterId = overId;
      console.log('targetChapterId', targetChapterId);
      if (overType === 'chapter') {
        targetChapterId = overId;
      } else if (overType === 'lesson') {
        targetChapterId = over.data.current?.chapterId ?? null;
      }
      if (!targetChapterId) {
        toast.error('Could  not determine chapter for reordering.');
        return;
      }
      const oldIndex = items.findIndex((item) => item.id === activeId);
      const newIndex = items.findIndex((item) => item.id === targetChapterId);
      console.log('oldIndex', oldIndex);
      console.log('newIndex', newIndex);
      if (oldIndex === -1 || newIndex === -1) {
        toast.error('Could not determine old or new chapter for reordering.');
        return;
      }
      const reordedLocalChapters = arrayMove(items, oldIndex, newIndex); //arraymove move the active item to the new index and return the new array
      // update the order of the chapters as it is basically starts from 0 to the new order starts from 1
      const updatedChapters = reordedLocalChapters.map((item, index) => ({
        ...item,
        order: index + 1,
      }));
      const previousItems = [...items]; // we will make an api call to update the order of the chapters and lessons and if it fails for any reason we will revert the changes
      setItems(updatedChapters);
      if (courseId) {
        const chaptersToUpdate = updatedChapters.map((chapter) => ({
          id: chapter.id,
          position: chapter.order,
        }));
        const reorderChaptersPromise = () =>
          reorderChapters(chaptersToUpdate, courseId);
        toast.promise(reorderChaptersPromise(), {
          loading: 'Reordering chapters...',
          success: (result) => {
            if (result.status === 'success') {
              return 'Chapters reordered successfully';
            } else {
              setItems(previousItems);
              throw new Error(result.message || 'Failed to reorder chapters');
            }
          },
          error: (err) => {
            setItems(previousItems);
            throw new Error(err.message || 'Failed to reorder chapters');
          },
        });
      }
    }
    if (activeType === 'lesson') {
      const activeChapterId = active.data.current?.chapterId;
      const overChapterId = over.data.current?.chapterId;
      if (activeChapterId !== overChapterId) {
        toast.error('Cannot move lesson between chapters.');
        return;
      }
      const oldIndex = items
        .find((item) => item.id === activeChapterId)
        ?.lessons.findIndex((lesson) => lesson.id === activeId);
      const newIndex = items
        .find((item) => item.id === activeChapterId)
        ?.lessons.findIndex((lesson) => lesson.id === overId);
      if (
        oldIndex === undefined ||
        oldIndex === -1 ||
        newIndex === undefined ||
        newIndex === -1
      ) {
        toast.error('Could not determine old or new lesson for reordering.');
        return;
      }
      const reordedLocalLessons = arrayMove(
        items.find((item) => item.id === activeChapterId)?.lessons || [],
        oldIndex,
        newIndex
      );
      const updatedLessons = reordedLocalLessons.map((lesson, index) => ({
        ...lesson,
        order: index + 1,
      }));
      const updatedChapters = items.map((item) => {
        if (item.id === activeChapterId) {
          return {
            ...item,
            lessons: updatedLessons,
          };
        }
        return item;
      });
      const previousItems = [...items]; // we will make an api call to update the order of the chapters and lessons and if it fails for any reason we will revert the changes
      setItems(updatedChapters);
      if (courseId) {
        // const chaptersToUpdate = updatedChapters.map((chapter) => ({
        //   id: chapter.id,
        //   lessons: chapter.lessons.map((lesson) => ({
        //     id: lesson.id,
        //     position: lesson.order,
        //   })),
        // }));
        const lessonsToUpdate = updatedLessons.map((lesson) => ({
          id: lesson.id,
          position: lesson.order,
        }));
        const reorderLessonsPromise = () =>
          reorderLessons(activeChapterId, lessonsToUpdate, courseId);
        toast.promise(reorderLessonsPromise(), {
          loading: 'Reordering lessons...',
          success: (result) => {
            if (result.status === 'success') {
              return 'Lessons reordered successfully';
            } else {
              setItems(previousItems);
              throw new Error(result.message || 'Failed to reorder lessons');
            }
          },
          error: (err) => {
            setItems(previousItems);
            throw new Error(err.message || 'Failed to reorder lessons');
          },
        });
      }
      return;
    }
  }

  function toggleChapters(chapterId: string) {
    setItems((items) => {
      return items.map((item) => {
        if (item.id === chapterId) {
          return {
            ...item,
            isOpen: !item.isOpen,
          };
        }
        return item;
      });
    });
  }
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <Card>
        <CardHeader className='flex flex-row items-center justify-between border-b border-border'>
          <CardTitle>Course Structure</CardTitle>
        </CardHeader>
        <CardContent className='overflow-y-auto h-[1000px] space-y-4'>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <div className='flex flex-col gap-4'>
              {items.map((item) => (
                <SortableItem
                  key={item.id}
                  id={item.id}
                  data={{ type: 'chapter' }}
                >
                  {(listeners) => (
                    <Card>
                      <Collapsible
                        open={item.isOpen}
                        onOpenChange={() => toggleChapters(item.id)}
                      >
                        <div className='flex items-center justify-between p-3 border-b border-border'>
                          <div className='flex items-center gap-2'>
                            <Button
                              variant={'ghost'}
                              size={'icon'}
                              className='cursor-grab opacity-60 hover:opacity-100'
                              {...listeners}
                            >
                              <GripVertical size={20} />
                            </Button>
                            <CollapsibleTrigger asChild>
                              <Button
                                variant={'ghost'}
                                size={'icon'}
                                className='ml-5 p-0 gap-2 cursor-pointer'
                              >
                                <div className='flex items-center gap-2'>
                                  {item.isOpen ? (
                                    <ChevronDown size={20} />
                                  ) : (
                                    <ChevronRight size={20} />
                                  )}
                                  <p className='cursor-pointer hover:text-primary'>
                                    {item.title}
                                  </p>
                                </div>
                              </Button>
                            </CollapsibleTrigger>
                          </div>
                          <Button
                            variant={'outline'}
                            size={'icon'}
                            className='cursor-pointer text-destructive'
                          >
                            <Trash2 size={20} />
                          </Button>
                        </div>
                        <CollapsibleContent>
                          <div className='p-3'>
                            <SortableContext
                              items={item.lessons.map((lesson) => lesson.id)}
                              strategy={verticalListSortingStrategy}
                            >
                              {item.lessons.map((lesson) => (
                                <SortableItem
                                  key={lesson.id}
                                  id={lesson.id}
                                  data={{ type: 'lesson', chapterId: item.id }}
                                >
                                  {(lessonListeners) => (
                                    <div className='flex items-center justify-between p-3 border-b border-border hover:bg-accent rounded-sm ml-6'>
                                      <div className='flex items-center gap-2 '>
                                        <Button
                                          variant={'ghost'}
                                          size={'icon'}
                                          className='cursor-grab opacity-60 hover:opacity-100'
                                          {...lessonListeners}
                                        >
                                          <GripVertical size={20} />
                                        </Button>
                                        <FileText size={20} />
                                        <Link
                                          href={`/admin/courses/${data.id}/${item.id}/${lesson.id}`}
                                        >
                                          {lesson.title}
                                        </Link>
                                      </div>
                                      <Button
                                        variant={'outline'}
                                        size={'icon'}
                                        className='cursor-pointer '
                                      >
                                        <Trash2 size={20} />
                                      </Button>
                                    </div>
                                  )}
                                </SortableItem>
                              ))}
                            </SortableContext>
                            <div className='p-3 ml-3'>
                              <Button variant={'outline'} className='w-full'>
                                <FileText size={20} />
                                Add New Lesson
                              </Button>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </Card>
                  )}
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </CardContent>
      </Card>
    </DndContext>
  );
};

export default CourseStructure;
