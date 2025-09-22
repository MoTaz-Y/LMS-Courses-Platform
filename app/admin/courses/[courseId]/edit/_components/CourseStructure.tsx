'use client';
import React, { useState } from 'react';
import {
  DndContext,
  DraggableSyntheticListeners,
  KeyboardSensor,
  PointerSensor,
  rectIntersection,
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
      <li
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={cn('touch-none', className, isDragging ? 'z-10' : '')}
      >
        {children(listeners)}
      </li>
    );
  }
  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
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
        <CardContent>
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
