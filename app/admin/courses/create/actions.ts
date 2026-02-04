'use server';

import { prisma } from '@/lib/db';
import { courseSchema, CourseSchemaType } from '@/lib/zodSchemas';
import { ApiResponse } from '@/lib/types';
import { requireAdmin } from '@/app/data/admin/require-admin';
import arcjet, { detectBot, fixedWindow } from '@/lib/arcjet';
import { request } from '@arcjet/next';

const aj = arcjet
  .withRule(
    detectBot({
      mode: 'LIVE',
      allow: [],
    }),
  )
  .withRule(
    fixedWindow({
      mode: 'LIVE',
      window: '1m',
      max: 5,
    }),
  );

export async function CreateCourse(
  values: CourseSchemaType,
): Promise<ApiResponse> {
  console.log('values from inside the create course function', values);
  const sesstion = await requireAdmin();
  try {
    //there is a problem to get the request on the server side so open the arcject doc and find the reuest method used to get the request on the server side
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: sesstion?.user.id as string,
    });
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: 'error',
          message: 'Too many requests',
        };
      } else if (decision.reason.isBot()) {
        return {
          status: 'error',
          message: 'Bot detected',
        };
      } else {
        return {
          status: 'error',
          message:
            'You are a bot if you are not a bot then please contact our support team',
        };
      }
    }
    console.log('Received values in CreateCourse:', values);
    const validate = courseSchema.safeParse(values);
    if (!validate.success) {
      console.error('Validation failed in CreateCourse:', validate.error);
      return {
        status: 'error',
        message: 'Invalid data',
      };
    }
    console.log('Validation successful, data:', validate.data);
    await prisma.course.create({
      data: {
        ...validate.data,
        image: '', // this will be modified
        userId: sesstion?.user.id as string, // this will be modified also
      },
    });
    return {
      status: 'success',
      message: 'Course created successfully',
    };
  } catch {
    console.error('Error in CreateCourse:');
    return {
      status: 'error',
      message: 'Something went wrong',
    };
  }
}
