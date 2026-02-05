import { adminGetCourses } from '@/app/data/admin/admin-get-courses';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import AdminCourseCard, {
  AdminCourseCardSkeleton,
} from './_components/AdminCourseCard';
import EmptyState from '@/components/general/EmptyState';
import { Suspense } from 'react';

const emptyState = {
  title: 'No Courses Found',
  description: 'You have not created any courses yet',
  buttonText: 'Create Course',
  buttonLink: '/admin/courses/create',
};

export default function CoursesPage() {
  // false promise about  3 seconds

  return (
    <>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold tracking-tight'>Courses</h1>
        <Link
          href='/admin/courses/create'
          className={buttonVariants({
            variant: 'default',
          })}
        >
          Create Course
        </Link>
      </div>
      <Suspense fallback={<AdminCourseCardSkeletonLoader />}>
        <RenderCourse />
      </Suspense>
    </>
  );
}

async function RenderCourse() {
  const data = await adminGetCourses();
  // const promise = new Promise((resolve) => setTimeout(resolve, 3000));
  // await promise;
  return (
    <>
      {data.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4'>
          {data.map((course) => (
            <AdminCourseCard key={course.id} data={course} />
          ))}
        </div>
      ) : (
        <EmptyState {...emptyState} />
      )}
    </>
  );
}

function AdminCourseCardSkeletonLoader() {
  return (
    <>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4'>
        {Array.from({ length: 4 }).map((_, i) => (
          <AdminCourseCardSkeleton key={i} />
        ))}
      </div>
    </>
  );
}
