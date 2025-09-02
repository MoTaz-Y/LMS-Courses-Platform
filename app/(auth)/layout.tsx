import { buttonVariants } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/public/logo.svg';
import React from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='relative flex min-h-svh flex-col items-center justify-center'>
      <Link
        href='/'
        className={buttonVariants({
          variant: 'outline',
          className: 'absolute left-4 top-4',
        })}
      >
        <ArrowLeft className='size-4' />
      </Link>
      <div className='flex w-full max-w-sm flex-col gap-6 '>
        <Link
          href='/'
          className='flex items-center gap-2 self-center font-medium '
        >
          <Image src={logo} alt='logo' width={32} height={32} />
          ALmotazLMS.
        </Link>
        {children}
        <div className='text-balance text-center text-xs text-muted-foreground'>
          By clicking continue, you agree to our{' '}
          <Link href='/terms' className='hover:underline hover:text-primary'>
            Terms of Service
          </Link>{' '}
          Read our{' '}
          <Link href='/privacy' className='hover:underline hover:text-primary'>
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
