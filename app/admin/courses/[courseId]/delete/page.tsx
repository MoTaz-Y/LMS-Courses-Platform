'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { tryCatch } from '@/hooks/try-catch';
import Link from 'next/link';
import { useTransition } from 'react';
import { deleteCourse } from './actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Loader2, Trash } from 'lucide-react';
import { useParams } from 'next/navigation';

const DeleteCourse = () => {
  const [isPendig, startTransition] = useTransition();
  const router = useRouter();
  const { courseId } = useParams<{ courseId: string }>();
  function onSubmit(courseId: string) {
    startTransition(async () => {
      const { data, error } = await tryCatch(deleteCourse(courseId));
      console.log('data from inside', data);
      // checked on the server side
      if (error) {
        toast.error('Something went wrong while deleting the course');
        return;
      }
      // checked on the client side
      if (!data) {
        toast.error('Something went wrong while deleting the course');
        return;
      }
      if (data.status === 'success') {
        toast.success('Course deleted successfully');
        // redirect to the course page
        router.push(`/admin/courses`);
      } else if (data.status === 'error') {
        toast.error(data.message);
        return;
      }
    });
  }
  return (
    <div className='max-w-xl mx-auto w-full'>
      <Card>
        <CardHeader>
          <CardTitle>Are you sure you want to delete this course?</CardTitle>
          <CardDescription>
            This action cannot be undone. This will permanently delete the
            course.
          </CardDescription>
        </CardHeader>
        <CardContent className='flex justify-end gap-4'>
          <Button
            variant={'destructive'}
            type='submit'
            onClick={() => onSubmit(courseId as string)}
            disabled={isPendig}
          >
            {isPendig ? (
              <>
                Deleting... <Loader2 className='animate-spin size-4' />
              </>
            ) : (
              <>
                Delete <Trash className='size-4' />
              </>
            )}
          </Button>
          <Link
            href={`/admin/courses/${courseId}/edit`}
            className={buttonVariants({ variant: 'outline' })}
          >
            Cancel
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeleteCourse;
