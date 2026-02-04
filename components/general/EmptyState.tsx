'use client';

import { Ban, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '../ui/button';

interface iAppProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink: string;
}
const EmptyState = ({
  title,
  description,
  buttonText,
  buttonLink,
}: iAppProps) => {
  return (
    <div className='flex flex-col flex-1 gap-4 items-center justify-center h-full rounded-md border-dashed border p-8 text-center '>
      <div className='bg-primary/10 p-4 rounded-full flex  size-20 items-center justify-center'>
        <Ban className='size-12 text-primary' />
      </div>
      <h2 className='text-4xl font-semibold mt-4'>{title}</h2>
      <p className='text-muted-foreground text-2xl mt-2'>{description}</p>
      <Link href={buttonLink} className={buttonVariants()}>
        <PlusCircle className='size-4' />
        {buttonText}
      </Link>
    </div>
  );
};

export default EmptyState;
