'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Control, useForm } from 'react-hook-form';
import {
  CourseSchemaType,
  courseSchema,
  courseCategories,
  courseLevel,
  courseStatus,
} from '@/lib/zodSchemas';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, PlusSquareIcon, SparkleIcon } from 'lucide-react';
import slugify from 'slugify';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from '@/components/ui/select';
import Tiptap from '@/components/richTextEditor/Tiptap';
import Uploader from '@/components/fileUploader/Uploader';
import { useTransition } from 'react';
import { tryCatch } from '@/hooks/try-catch';
import { CreateCourse } from '../actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const CourseForm = () => {
  console.log('CourseForm component is rendering.');
  const [isPendig, startTransition] = useTransition();
  const router = useRouter();
  // 1. Define your form.
  const form = useForm<CourseSchemaType>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      fileKey: '',
      duration: 0,
      level: 'BEGINNER',
      // image: '',
      category: 'General',
      smallDescription: '',
      slug: '',
      status: 'DRAFT',
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: CourseSchemaType) {
    console.log('these are the values', values);
    startTransition(async () => {
      console.log('these are the values', values);
      const { data, error } = await tryCatch(CreateCourse(values));
      console.log('data from inside', data);
      // checked on the server side
      if (error) {
        toast.error('Something went wrong while creating the course');
        return;
      }
      // checked on the client side
      if (!data) {
        toast.error('Something went wrong while creating the course');
        return;
      }
      if (data.status === 'success') {
        toast.success('Course created successfully');
        form.reset();
        // redirect to the course page
        // router.push(`/courses/${data.course.slug}`);
        router.push(`/admin/courses`);
      } else if (data.status === 'error') {
        toast.error(data.message);
        return;
      }
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control as Control<CourseSchemaType>}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder='Title' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex gap-4 items-end'>
          <FormField
            control={form.control as Control<CourseSchemaType>}
            name='slug'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder='Slug' {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type='button'
            /* to prevemt submitting the form */ className='w-fit'
            onClick={() => {
              const title = form.getValues('title');
              const slug = slugify(title, { lower: true });
              form.setValue('slug', slug, { shouldValidate: true });
            }}
          >
            Generate Slug <SparkleIcon className='h-4 w-4 ml-1' />
          </Button>
        </div>
        <FormField
          control={form.control as Control<CourseSchemaType>}
          name='smallDescription'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Small Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Small Description'
                  className='min-h-[120px]'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control as Control<CourseSchemaType>}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Description'
                  className='min-h-[120px]'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <FormField
          control={form.control as Control<CourseSchemaType>}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Tiptap field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control as Control<CourseSchemaType>}
          name='fileKey'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thumbnail Image</FormLabel>
              <FormControl>
                <Uploader onChange={field.onChange} value={field.value} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* catergory field */}

          <FormField
            control={form.control as Control<CourseSchemaType>}
            name='category'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select a category' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {courseCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* level field */}
          <FormField
            control={form.control as Control<CourseSchemaType>}
            name='level'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select a level' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {courseLevel.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control as Control<CourseSchemaType>}
            name='duration'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (Hours)</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Duration'
                    type='number'
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control as Control<CourseSchemaType>}
            name='price'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Price'
                    type='number'
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control as Control<CourseSchemaType>}
          name='status'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select a status' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {courseStatus.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type='submit'
          disabled={isPendig}
          onClick={() => {
            console.log(form.getValues());
            onSubmit(form.getValues());
          }}
        >
          {isPendig ? (
            <>
              Creating Course... <Loader2 className='animate-spin' />
            </>
          ) : (
            <>
              Create Course <PlusSquareIcon className='ml-1' size={16} />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default CourseForm;
