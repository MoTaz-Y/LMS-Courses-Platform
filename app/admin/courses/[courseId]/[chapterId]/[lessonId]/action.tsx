'use server';

import { requireAdmin } from '@/app/data/admin/require-admin';
import { prisma } from '@/lib/db';
import { ApiResponse } from '@/lib/types';
import { lessonSchema, LessonSchemaType } from '@/lib/zodSchemas';
import arcjet, { detectBot, fixedWindow } from '@/lib/arcjet';
import { request } from '@arcjet/next';
import { revalidatePath } from 'next/cache';
const aj = arcjet
  .withRule(
    detectBot({
      mode: 'LIVE',
      allow: [],
    })
  )
  .withRule(
    fixedWindow({
      mode: 'LIVE',
      window: '1m',
      max: 1,
    })
  );

export async function editLesson(
  data: LessonSchemaType,
  courseId: string
): Promise<ApiResponse> {
  const req = await request();
  const user = await requireAdmin();
  const decision = await aj.protect(req, {
    fingerprint: user?.user.id as string,
  });
  // if (!user) return { error: 'Unauthorized' };
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
  try {
    const result = lessonSchema.safeParse(data);
    if (!result.success) {
      return { status: 'error', message: 'Invalid data' };
    }
    await prisma.course.update({
      where: { id: courseId, userId: user.user.id },
      data: {
        ...result.data,
      },
    });
    revalidatePath(`/admin/courses/${courseId}/edit`);
    return { message: 'Course edited successfully', status: 'success' };
  } catch {
    return { message: 'Error parsing data', status: 'error' };
  }
}
