import { getLesson } from '@/app/data/admin/adming-get-lesson';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import LessonForm from './_components/LessonForm';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';

type Params = Promise<{
  courseId: string;
  chapterId: string;
  lessonId: string;
}>;

export default async function LessonPage({ params }: { params: Params }) {
  const { courseId, chapterId, lessonId } = await params;
  const data = await getLesson(lessonId);
  console.log('data', data);

  return (
    <div>
      <Link
        className={buttonVariants({ variant: 'outline', className: 'mb-6' })}
        href={`/admin/courses/${courseId}/edit`}
      >
        <ArrowLeftIcon className='size-4 inline-block' /> Go Back
      </Link>
      <h1 className='text-3xl font-bold mb-8'>
        Edit Lesson:{' '}
        <span className='text-primary underline'>{data.title}</span>
      </h1>
      <Card>
        <CardTitle className='text-2xl ml-5'>Lesson Configurations</CardTitle>
        <CardDescription className='ml-5'>
          Configure the Video and Resources of the lesson.
        </CardDescription>
        <CardContent>
          <LessonForm data={data} chapterId={chapterId} courseId={courseId} />
        </CardContent>
      </Card>
    </div>
  );
}
