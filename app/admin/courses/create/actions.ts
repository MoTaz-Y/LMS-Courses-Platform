'use server';

import { prisma } from '@/lib/db';
import { courseSchema, CourseSchemaType } from '@/lib/zodSchemas';
import { ApiResponse } from '@/lib/types';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function CreateCourse(
  values: CourseSchemaType
): Promise<ApiResponse> {
  try {
    const sesstion = await auth.api.getSession({
      headers: await headers(),
    });
    const validate = courseSchema.safeParse(values);
    if (!validate.success) {
      return {
        status: 'error',
        message: 'Invalid data',
      };
    }
    await prisma.course.create({
      data: {
        ...validate.data,
        userId: sesstion?.user.id as string,
      },
    });
    return {
      status: 'success',
      message: 'Course created successfully',
    };
  } catch {
    return {
      status: 'error',
      message: 'Something went wrong',
    };
  }
}
