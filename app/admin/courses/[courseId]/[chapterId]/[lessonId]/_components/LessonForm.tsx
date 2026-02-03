'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Control, useForm } from 'react-hook-form';
import { LessonSchemaType, lessonSchema } from '@/lib/zodSchemas';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, PlusSquareIcon } from 'lucide-react';
import Tiptap from '@/components/richTextEditor/Tiptap';
import Uploader from '@/components/fileUploader/Uploader';
import { useTransition } from 'react';
import { tryCatch } from '@/hooks/try-catch';
import { editLesson } from '../action';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { AdminLessonSingualrType } from '@/app/data/admin/adming-get-lesson';

interface iAppProps {
  data: AdminLessonSingualrType;
  chapterId: string;
  courseId: string;
}

const EditCourseForm = ({ data, chapterId, courseId }: iAppProps) => {
  const [isPendig, startTransition] = useTransition();
  const router = useRouter();
  // 1. Define your form.
  const form = useForm<LessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      chapterId: chapterId,
      courseId: courseId,
      name: data.title,
      description: data.description ?? undefined,
      thumbnailkey: data.thumbnailkey ?? undefined,
      videoKey: data.videoKey ?? undefined,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: LessonSchemaType) {
    startTransition(async () => {
      console.log('these are the values', values);
      const { data: result, error } = await tryCatch(
        editLesson(values, data.id)
      );
      console.log('data from inside', data);
      // checked on the server side
      if (error) {
        toast.error('Something went wrong while creating the lesson');
        return;
      }
      // checked on the client side
      if (!data) {
        toast.error('Something went wrong while creating the lesson');
        return;
      }
      if (result.status === 'success') {
        toast.success('Lesson created successfully');
        form.reset();
        // redirect to the course page
        // router.push(`/courses/${data.course.slug}`);
        router.push(`/admin/courses/${chapterId}/edit`);
      } else if (result.status === 'error') {
        toast.error(result.message);
        return;
      }
    });
  }
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <FormField
            control={form.control as Control<LessonSchemaType>}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lesson Title</FormLabel>
                <FormControl>
                  <Input placeholder='Title' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control as Control<LessonSchemaType>}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Tiptap field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control as Control<LessonSchemaType>}
            name='thumbnailkey'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thumbnail Image</FormLabel>
                <FormControl>
                  <Uploader
                    onChange={field.onChange}
                    value={field.value}
                    fileTypeAccepted='image'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control as Control<LessonSchemaType>}
            name='videoKey'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Video File </FormLabel>
                <FormControl>
                  <Uploader
                    onChange={field.onChange}
                    value={field.value}
                    fileTypeAccepted='video'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type='submit'
            disabled={isPendig}
            onClick={() => {
              console.log(form.getValues());
              onSubmit(form.getValues());
            }}
          >
            {isPendig ? (
              <>
                Updating ... <Loader2 className='animate-spin' />
              </>
            ) : (
              <>
                Update Course <PlusSquareIcon className='ml-1' size={16} />
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EditCourseForm;
