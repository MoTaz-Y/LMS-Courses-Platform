'use client';

import { useCallback, useEffect } from 'react';
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
import { useConstructUrl } from '@/hooks/use-construct-url';
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
interface iAppProps {
  value?: string;
  onChange?: (value: string) => void;
  fileTypeAccepted: 'image' | 'video';
}
function Uploader({ value, onChange, fileTypeAccepted }: iAppProps) {
  const fileUrl = useConstructUrl(value || '');
  const [fileState, setFileState] = useState<UploaderProps>({
    id: null,
    file: null,
    uploading: false,
    progress: 0,
    isDeleting: false,
    error: false,
    fileType: fileTypeAccepted,
    objectUrl: value ? fileUrl : undefined, //
    key: value, //
  });
  const uploadFile = useCallback(
    async (file: File) => {
      setFileState((prev) => ({
        ...prev,
        uploading: true,
        progress: 0,
      }));
      try {
        const preSignedResponse = await fetch('/api/s3/upload', {
          method: 'POST',
          // credentials: 'include',//
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
            size: file.size,
            isImage: fileTypeAccepted === 'image' ? true : false,
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
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percentageComplete = Math.round(
                (event.loaded / event.total) * 100,
              );
              setFileState((prev) => ({
                ...prev,
                progress: percentageComplete,
              }));
            }
          };
          xhr.onload = () => {
            if (xhr.status === 200 || xhr.status === 204) {
              setFileState((prev) => ({
                ...prev,
                uploading: false,
                progress: 100,
                key: key,
              }));
              onChange?.(key); //
              toast.success('File uploaded successfully');
              resolve();
            } else {
              toast.error(
                'Error uploading file. Please try again later. ********************************',
              );
              reject(
                new Error('Error uploading file. Please try again later.'),
              );
            }
          };
          xhr.onerror = () => {
            reject(new Error('Error uploading file. Please try again later.'));
          };
          xhr.open('PUT', presignedUrl);
          // xhr.withCredentials = false;
          xhr.setRequestHeader('Content-Type', file.type);
          // xhr.setRequestHeader('Origin', 'http://localhost:3000');
          xhr.send(file);
        });
      } catch {
        // toast.error(
        //   'Error uploading file. Please try again later. ********************************'
        // );
        setFileState((prev) => ({
          ...prev,
          uploading: false,
          progress: 0,
          error: true,
        }));
      }
    },
    [fileTypeAccepted, onChange],
  );
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Do something with the files
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setFileState({
          id: uuidv4(),
          file: file,
          uploading: false,
          progress: 0,
          isDeleting: false,
          error: false,
          fileType: fileTypeAccepted,
          objectUrl: URL.createObjectURL(file),
          key: value, //
        });
        console.log('files', acceptedFiles);
        console.log('file0', file);
        uploadFile(file);
      }
      if (fileState.objectUrl && !fileState.objectUrl.startsWith('http')) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
    },
    [fileState.objectUrl, fileTypeAccepted, value, uploadFile],
  );
  async function handleRemoveFile() {
    if (fileState.isDeleting || !fileState.objectUrl) return;
    try {
      setFileState((prev) => ({
        ...prev,
        isDeleting: true,
      }));
      const response = await fetch('/api/s3/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: fileState.key,
        }),
      });
      if (!response.ok) {
        toast.error('Error deleting file. Please try again later.');
        setFileState((prev) => ({
          ...prev,
          isDeleting: true,
          error: true,
        }));
        return;
      }

      setFileState((prev) => ({
        ...prev,
        id: null,
        file: null,
        uploading: false,
        progress: 0,
        isDeleting: false,
        error: false,
        fileType: fileTypeAccepted,
        objectUrl: '',
      }));
      if (fileState.objectUrl && !fileState.objectUrl.startsWith('http')) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
      onChange?.('');
      toast.success('File deleted successfully');
    } catch {
      toast.error('Error deleting file. Please try again later.');
      setFileState((prev) => ({
        ...prev,
        isDeleting: false,
        error: true,
      }));
    }
  }
  function rejectedFile(fileRejection: FileRejection[]) {
    if (fileRejection.length > 0) {
      const tooManyFiles = fileRejection.find(
        (rejection) => rejection.errors[0].code === 'too-many-files',
      );
      const fileTooLarge = fileRejection.find(
        (rejection) => rejection.errors[0].code === 'file-too-large',
      );
      const fileInvalidType = fileRejection.find(
        (rejection) => rejection.errors[0].code === 'file-invalid-type',
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
      return <RenderErrorState isDragActive={isDragActive} />;
    } else if (fileState.uploading) {
      return (
        <RenderLoadingState
          progress={fileState.progress}
          file={fileState.file as File}
        />
      );
    } else if (fileState.objectUrl) {
      return (
        <RenderSuccessState
          previewUrl={fileState.objectUrl}
          handleRemoveFile={handleRemoveFile}
          isDeleting={fileState.isDeleting}
          fileType={fileState.fileType}
        />
      );
    }
    return <RenderState isDragActive={isDragActive} />;
  }
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:
      fileTypeAccepted === 'image'
        ? {
            'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
          }
        : {
            'video/*': ['.mp4', '.mov', '.avi', '.mkv'],
          },
    maxFiles: 1,
    multiple: false,
    maxSize: fileTypeAccepted === 'image' ? 1024 * 1024 * 5 : 1024 * 1024 * 100, // 5mb for images, 100mb for videos
    onDropRejected: rejectedFile,
    disabled: fileState.uploading || !!fileState.objectUrl,
  });
  useEffect(() => {
    return () => {
      if (fileState.objectUrl && !fileState.objectUrl.startsWith('http')) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
    };
  }, [fileState.objectUrl]);
  return (
    <Card
      className={cn(
        'relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full min-h-[200px]',
        isDragActive
          ? 'border-primary bg-primary/10 border-solid'
          : 'border-border hover:border-primary hover:bg-muted/20 hover:border-solid',
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
