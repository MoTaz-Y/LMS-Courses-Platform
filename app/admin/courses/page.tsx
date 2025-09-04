import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';

const CoursesPage = () => {
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
    </>
  );
};

export default CoursesPage;
