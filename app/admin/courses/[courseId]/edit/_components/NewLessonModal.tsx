import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { lessonSchema, LessonSchemaType } from '@/lib/zodSchemas';
import { Loader2, Plus } from 'lucide-react';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createLesson } from '../action';
import { toast } from 'sonner';
import { tryCatch } from '@/hooks/try-catch';

const NewLessonModal = ({
  chapterId,
  courseId,
}: {
  chapterId: string;
  courseId: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPendig, startTransition] = useTransition();
  // 1. Define your form.
  const form = useForm<LessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: '',
      courseId: courseId,
      chapterId: chapterId,
    },
  });
  const onSubmit = (values: LessonSchemaType) => {
    startTransition(async () => {
      const { data, error } = await tryCatch(createLesson(values));
      if (error) {
        toast.error('Something went wrong while creating the lesson');
        return;
      }
      if (!data) {
        toast.error('Something went wrong while creating the lesson');
        return;
      }
      if (data.status === 'success') {
        toast.success('Lesson created successfully');
        form.reset();
        setIsOpen(false);
      } else if (data.status === 'error') {
        toast.error(data.message);
        return;
      }
    });
  };
  const handleOpen = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset();
    }
    setIsOpen(isOpen);
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button variant={'outline'} className='w-full'>
          <Plus /> Add New Lesson
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create New Lesson</DialogTitle>
          <DialogDescription>
            What Would You Like To Name This Lesson?
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className='space-y-8' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Lesson Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Lesson Name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className='w-full'>
              <Button type='submit' disabled={isPendig}>
                {isPendig ? (
                  <>
                    Creating... <Loader2 className='animate-spin' />
                  </>
                ) : (
                  <>Create Lesson</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewLessonModal;
