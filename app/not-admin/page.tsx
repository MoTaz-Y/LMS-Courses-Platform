import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { HomeIcon, ShieldX } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

// not admin page
export default function NotAdminRoute() {
  return (
    <>
      <div className='min-h-screen flex flex-col justify-center items-center'>
        <Card className='max-w-md w-full'>
          <CardHeader className='text-center'>
            <div className='bg-destructive/10 p-4 rounded-full w-fit mx-auto'>
              <ShieldX className='size-16 text-destructive mx-auto' />
            </div>
            <CardTitle className='mt-4 text-2xl'>Access Restricted</CardTitle>
            <CardDescription className='mt-2 max-w-md mx-auto'>
              You do not have permission to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className='flex justify-center'>
            <Link
              href='/'
              className={buttonVariants({
                variant: 'destructive',
                className: 'w-4/6',
              })}
            >
              <HomeIcon className='mr-2 size-4' />
              Back to Home
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
