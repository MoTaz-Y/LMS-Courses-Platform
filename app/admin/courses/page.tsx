import { adminGetCourses } from '@/app/data/admin/admin-get-courses';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import AdminCourseCard from './_components/AdminCourseCard';
import EmptyState from '@/components/general/EmptyState';

const CoursesPage = async () => {
  const data = await adminGetCourses();
  const emptyState = {
    title: 'No Courses Found',
    description: 'You have not created any courses yet',
    buttonText: 'Create Course',
    buttonLink: '/admin/courses/create',
  };

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
};

export default CoursesPage;
