/* eslint-disable react/no-unescaped-entities */
'use client';

import { useCallback } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import { Card, CardContent } from '../ui/card';
import { cn } from '@/lib/utils';
import RenderState, {
  RenderErrorState,
  RenderLoadingState,
  RenderSuccessState,
} from './RenderState';
import { toast } from 'sonner';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
interface UploaderProps {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  key?: string;
  isDeleting: boolean;
  error: boolean;
  fileType: 'image' | 'video';
  objectUrl?: string;
}
function Uploader({ field: { name } }: { field: { name: string } }) {
  const [fileState, setFileState] = useState<UploaderProps>({
    id: null,
    file: null,
    uploading: false,
    progress: 0,
    isDeleting: false,
    error: false,
    fileType: 'image',
    objectUrl: '',
  });
  const uploadFile = async (file: File) => {
    setFileState((prev) => ({
      ...prev,
      uploading: true,
      progress: 0,
    }));
    try {
      const preSignedResponse = await fetch('/api/s3/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          size: file.size,
          isImage: file.type.startsWith('image/'), // Change this to true if the file is an image dynamicly
        }),
      });
      if (!preSignedResponse.ok) {
        toast.error('Error uploading file. Please try again later.');
        setFileState((prev) => ({
          ...prev,
          uploading: false,
          progress: 0,
          error: true,
        }));
        return;
      }
      const { presignedUrl, key } = await preSignedResponse.json();
      console.log('presignedUrl', presignedUrl);
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        console.log('xhr0-0-0-0-0-0-0-0-0-0-0-0', xhr);
        xhr.upload.onprogress = (event) => {
          console.log('event lengthComputable', event);
          if (event.lengthComputable) {
            const percentageComplete = Math.round(
              (event.loaded / event.total) * 100
            );
            setFileState((prev) => ({
              ...prev,
              progress: percentageComplete,
            }));
            console.log('percentageComplete', fileState);
          }
        };
        xhr.onload = () => {
          console.log('xhr.onload', xhr);
          if (xhr.status === 200 || xhr.status === 204) {
            setFileState((prev) => ({
              ...prev,
              uploading: false,
              progress: 100,
              key: key,
            }));
            toast.success('File uploaded successfully');
            resolve();
          } else {
            reject(new Error('Error uploading file. Please try again later.'));
          }
        };
        xhr.onerror = () => {
          console.log('xhr.onerror', xhr);
          reject(new Error('Error uploading file. Please try again later.'));
        };
        xhr.open('PUT', presignedUrl, true);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
        console.log('xhr1-1-1-1-1-1-1-1-1-1-1-1', xhr);
      });
    } catch {
      toast.error('Error uploading file. Please try again later.');
      setFileState((prev) => ({
        ...prev,
        uploading: false,
        progress: 0,
        error: true,
      }));
    }
  };
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Do something with the files
      const file = acceptedFiles[0];
      if (acceptedFiles.length > 0) {
        setFileState({
          id: uuidv4(),
          file,
          uploading: false,
          progress: 0,
          isDeleting: false,
          error: false,
          fileType: 'image',
          objectUrl: URL.createObjectURL(file),
        });
      }
      // if (fileState.id) {
      //   setFileState((prev) => ({
      //     ...prev,
      //     id: null,
      //     file: null,
      //     uploading: false,
      //     progress: 0,
      //     isDeleting: false,
      //     error: false,
      //     fileType: 'image',
      //     objectUrl: '',
      //   }));
      // }
      // revoke the object url if it exists
      if (fileState.objectUrl && !fileState.objectUrl.startsWith('http')) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
      uploadFile(file);
    },
    [fileState.objectUrl]
  );
  function rejectedFile(fileRejection: FileRejection[]) {
    if (fileRejection.length > 0) {
      const tooManyFiles = fileRejection.find(
        (rejection) => rejection.errors[0].code === 'too-many-files'
      );
      const fileTooLarge = fileRejection.find(
        (rejection) => rejection.errors[0].code === 'file-too-large'
      );
      const fileInvalidType = fileRejection.find(
        (rejection) => rejection.errors[0].code === 'file-invalid-type'
      );

      if (tooManyFiles) {
        toast.error('Too many files selected. Please select only one file.');
      }
      if (fileTooLarge) {
        toast.error('File too large. Please select a file less than 5mb.');
      }
      if (fileInvalidType) {
        toast.error('File type not supported. Please select a valid file.');
      }
    }
  }
  function renderContent() {
    if (fileState.error) {
      return <RenderErrorState />;
    } else if (fileState.uploading) {
      return (
        <RenderLoadingState
          progress={fileState.progress}
          file={fileState.file as File}
        />
      );
    } else if (fileState.objectUrl) {
      return <RenderSuccessState previewUrl={fileState.objectUrl} />;
    }
    return <RenderState isDragActive={isDragActive} />;
  }
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
      'video/*': ['.mp4', '.mov', '.avi', '.mkv'],
    },
    maxFiles: 1,
    multiple: false,
    maxSize: 1024 * 1024 * 5, // 5mb
    onDropRejected: rejectedFile,
  });

  return (
    <Card
      className={cn(
        'relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64',
        isDragActive
          ? 'border-primary bg-primary/10 border-solid'
          : 'border-border hover:border-primary hover:bg-muted/20 hover:border-solid'
      )}
      {...getRootProps()}
    >
      <CardContent className='flex  items-center justify-center h-full p-4 w-full'>
        <input {...getInputProps()} />
        {renderContent()}
      </CardContent>
    </Card>
  );
}

export default Uploader;
