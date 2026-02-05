import { AdminCourseType } from '@/app/data/admin/admin-get-courses';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import React from 'react';
import { useConstructUrl } from '@/hooks/use-construct-url';
import Link from 'next/link';
import {
  TimerIcon,
  SchoolIcon,
  ArrowRight,
  MoreVerticalIcon,
  PencilIcon,
  EyeIcon,
  Trash2,
} from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface iAppProps {
  data: AdminCourseType;
}

const AdminCourseCard = ({ data }: iAppProps) => {
  const thiumbnailUrl = useConstructUrl(data.fileKey);
  return (
    <Card className='relative py-0 gap-0'>
      {/* absolute drop down */}
      <div className='absolute top-2 right-2 z-10  '>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='secondary' size='icon'>
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-48'>
            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${data.id}/edit`}>
                <PencilIcon /> Edit Course
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/courses/${data.slug}`}>
                <EyeIcon /> View Course
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href={`/admin/courses/${data.id}/delete`}
                className='text-destructive'
              >
                <Trash2 className='size-4 text-destructive' /> Delete Course
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Image
        src={thiumbnailUrl}
        alt={data.title}
        width={600}
        height={400}
        className='w-full rounded-t-lg aspect-video h-full object-cover'
      />
      <CardContent className='flex flex-col gap-2 p-4'>
        <Link
          href={`/admin/courses/${data.id}/edit`}
          className='font-medium text-xl line-clamp-2 hover:underline hover:text-primary transition-colors'
        >
          {data.title}
        </Link>
        <p className='text-sm text-muted-foreground line0-clamp-2 leading-tight mt-2'>
          {data.smallDescription}
        </p>
        <div className='mt-4 flex items-center gap-x-5'>
          <div className='flex items-center gap-x-2'>
            <TimerIcon className='size-6 rounded-md text-primary bg-primary/10' />
            <span className='text-sm text-muted-foreground'>
              {data.duration}h
            </span>
          </div>
          <div className='flex items-center gap-x-2'>
            <SchoolIcon className='size-6 rounded-md text-primary bg-primary/10' />
            <span className='text-sm text-muted-foreground'>{data.level}</span>
          </div>
        </div>
        <Link
          href={`/admin/courses/${data.id}/edit`}
          className={buttonVariants({ className: 'mt-4' })}
        >
          Edit Course <ArrowRight className='size-4 inline-block' />
        </Link>
      </CardContent>
    </Card>
  );
};

export default AdminCourseCard;

export function AdminCourseCardSkeleton() {
  return (
    <Card className='group relative py-0 gap-0'>
      <div className='absolute top-2 right-2 z-10 flex items-center gap-2 '>
        <Skeleton className='w-16 h-4 rounded-full' />
        <Skeleton className='size-6 rounded-md' />
      </div>
      <div className='w-full h-fit relative'>
        <Skeleton className='w-full  rounded-t-lg aspect-video h-[200px]' />
      </div>
      <CardContent className='flex flex-col gap-2 p-4'>
        <Skeleton className='w-3/4 h-6 rounded-full mb-2' />
        <Skeleton className='w-full h-4 rounded-full mb-4' />
        <div className='flex items-center gap-x-5'>
          <div className='flex itmes-center gap-x-2'>
            <Skeleton className='size-6 rounded-md' />
            <Skeleton className='w-1/2 h-4 rounded-full' />
          </div>
          <div className='flex itmes-center gap-x-2'>
            <Skeleton className='size-6 rounded-md' />
            <Skeleton className='w-1/2 h-4 rounded-full' />
          </div>
        </div>
        <Skeleton className='w-full h-10 rounded-full mt-4' />
      </CardContent>
    </Card>
  );
}
