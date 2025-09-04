import { buttonVariants } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import Link from 'next/link';
import CourseForm from './_components/CourseForm';

export default function CreateCoursePage() {
  return (
    <>
      <div className='flex items-center gap-4 '>
        {' '}
        <Link
          href='/admin/courses'
          className={buttonVariants({ variant: 'outline', size: 'icon' })}
        >
          <ArrowLeftIcon className='h-6 w-6' />
        </Link>
        <h1 className='text-3xl font-bold'>Create Course</h1>
      </div>
      <Card className='mt-10'>
        <CardHeader>
          <CardTitle>Course Information</CardTitle>
          <CardDescription>
            Add all the information related to your course
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CourseForm />
        </CardContent>
      </Card>
    </>
  );
}
