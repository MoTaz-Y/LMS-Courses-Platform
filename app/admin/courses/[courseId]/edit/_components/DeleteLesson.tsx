import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { tryCatch } from '@/hooks/try-catch';
import { Loader2, Trash2 } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { deleteLesson } from '../action';

const DeleteLesson = ({
  lessonId,
  chapterId,
  courseId,
}: {
  lessonId: string;
  chapterId: string;
  courseId: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPendig, startTransition] = useTransition();
  const handleOpen = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };
  const handleDelete = () => {
    startTransition(async () => {
      const { data, error } = await tryCatch(
        deleteLesson(lessonId, chapterId, courseId)
      );
      if (error) {
        toast.error('Something went wrong while deleting the lesson');
        return;
      }
      if (!data) {
        toast.error('Something went wrong while deleting the lesson');
        return;
      }
      if (data.status === 'success') {
        toast.success('Lesson deleted successfully');
        setIsOpen(false);
        return;
      } else if (data.status === 'error') {
        toast.error(data.message);
        return;
      }
      setIsOpen(false);
    });
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={'ghost'} size={'sm'}>
          <Trash2 size={20} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            lesson.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant={'destructive'} onClick={handleDelete}>
            {isPendig ? (
              <>
                Deleting... <Loader2 className='animate-spin' />
              </>
            ) : (
              <>Delete</>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteLesson;
