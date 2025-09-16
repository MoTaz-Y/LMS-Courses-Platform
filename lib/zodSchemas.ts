import { z } from 'zod';

export const courseLevel = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const;
export const courseStatus = ['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const;
export const courseCategories = [
  'General',
  'Cardiology',
  'Dermatology',
  'Endocrinology',
  'Gastroenterology',
  'Hematology',
  'Infectious Diseases',
  'Neurology',
  'Oncology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Radiology',
  'Urology',
] as const;

export const courseSchema = z.object({
  title: z.string().min(3, 'Title is required').max(50, 'Title is too long'),
  description: z
    .string()
    .min(3, 'Description is required')
    .max(500, 'Description is too long'),
  price: z.number().min(1, 'Price is required'),
  fileKey: z.string().min(1, 'File is required'),
  duration: z
    .number()
    .min(1, 'Duration is required')
    .max(500, 'Duration is too long'),
  level: z.enum(courseLevel, {
    message: 'Invalid course level',
  }),
  // image: z.string().min(1, 'Image is required'),
  category: z.enum(courseCategories, {
    message: 'Invalid course category',
  }),
  smallDescription: z
    .string()
    .min(1, 'Small Description is required')
    .max(200, 'Small Description is too long'),
  slug: z.string().min(3, 'Slug is required').max(50, 'Slug is too long'),
  status: z.enum(courseStatus, {
    message: 'Invalid course status',
  }),
});
export type CourseSchemaType = z.infer<typeof courseSchema>;

// some medical course categories
