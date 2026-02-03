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
import { chapterSchema, ChapterSchemaType } from '@/lib/zodSchemas';
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
import { createChapter } from '../action';
import { toast } from 'sonner';
import { tryCatch } from '@/hooks/try-catch';

const NewChapterModal = ({ courseId }: { courseId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPendig, startTransition] = useTransition();
  // 1. Define your form.
  const form = useForm<ChapterSchemaType>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      name: '',
      courseId: courseId,
    },
  });
  const onSubmit = (values: ChapterSchemaType) => {
    console.log('values', values);
    startTransition(async () => {
      const { data, error } = await tryCatch(createChapter(values));
      if (error) {
        toast.error('Something went wrong while creating the chapter');
        return;
      }
      if (!data) {
        toast.error('Something went wrong while creating the chapter');
        return;
      }
      if (data.status === 'success') {
        toast.success('Chapter created successfully');
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
        <Button variant={'outline'} size={'sm'} className='gap-2'>
          <Plus /> Add New Chapter
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create New Chapter</DialogTitle>
          <DialogDescription>
            What Would You Like To Name This Chapter?
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className='space-y-8' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Chapter Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Chapter Name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type='submit' disabled={isPendig}>
                {isPendig ? (
                  <>
                    Creating... <Loader2 className='animate-spin' />
                  </>
                ) : (
                  <>Create Chapter</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewChapterModal;
