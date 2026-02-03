import { cn } from '@/lib/utils';
import { CloudUploadIcon, ImageIcon, Loader2, XIcon } from 'lucide-react';
import React from 'react';
import { Button } from '../ui/button';
import Image from 'next/image';

const RenderState = ({ isDragActive }: { isDragActive: boolean }) => {
  return (
    <div className='text-center'>
      <div className='flex justify-center mx-auto items-center size-12 rounded-full bg-muted mb-4'>
        <CloudUploadIcon
          className={cn(
            'size-6 text-muted-foreground',
            isDragActive && 'text-primary'
          )}
        />
      </div>
      <p className='text-base font-semibold text-muted-foreground'>
        Drag and drop your files here or{' '}
        <span className='underline cursor-pointer font-bold text-primary'>
          click to upload
        </span>
      </p>
      <Button type='button' className='mt-4'>
        Select File
      </Button>
    </div>
  );
};

export function RenderErrorState({ isDragActive }: { isDragActive: boolean }) {
  return (
    <div className='text-center'>
      <div className='flex justify-center mx-auto items-center size-12 rounded-full bg-destructive/30 mb-4'>
        {isDragActive ? (
          <CloudUploadIcon className={cn('size-6 text-primary')} />
        ) : (
          <ImageIcon className={cn('size-6 text-destructive')} />
        )}
      </div>
      <p className='text-base font-semibold'>Upload Failed</p>
      <p className='text-xs mt-1 text-muted-foreground'>
        Something went wrong, <br /> Click or drag and drop to try again.
      </p>
      <Button type='button' className='mt-4'>
        Select File
      </Button>
    </div>
  );
}

export function RenderSuccessState({
  previewUrl,
  isDeleting,
  handleRemoveFile,
  fileType,
}: {
  previewUrl: string;
  isDeleting: boolean;
  handleRemoveFile: () => void;
  fileType: 'image' | 'video';
}) {
  return (
    <div className='relative group w-full h-full flex items-center justify-center'>
      {/* <div className='flex justify-center mx-auto items-center size-12 rounded-full bg-green-300 mb-4'>
        <ImageIcon className={cn('size-6 text-green-600')} />
      </div> */}
      {/* <p className='text-base font-semibold'>Upload Success</p>
      <p className='text-xs mt-1 text-muted-foreground'>
        Your file has been uploaded successfully.
      </p> */}
      {fileType === 'image' ? (
        <Image src={previewUrl} alt='preview' width={100} height={100} />
      ) : (
        <video
          src={previewUrl}
          autoPlay
          muted
          loop
          controls
          className='rounded-md w-full max-h-100'
        />
      )}
      <Button
        type='button'
        variant='destructive'
        size='icon'
        className={`${cn('absolute top-4 right-4')}`}
        onClick={handleRemoveFile}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Loader2 className='size-4 animate-spin' />
        ) : (
          <XIcon className='size-4' />
        )}
      </Button>
    </div>
  );
}

export function RenderLoadingState({
  progress,
  file,
}: {
  progress: number;
  file: File;
}) {
  return (
    <div className='text-center flex flex-col justify-center items-center'>
      <p>{progress}%</p>
      <p className='text-sm mt-2 font-medium text-foreground'>Uploading ...</p>
      <p className='text-xs text-muted-foreground truncate max-w-xs'>
        {file.name}
      </p>
    </div>
  );
}
export default RenderState;
