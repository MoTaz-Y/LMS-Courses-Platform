'use server';

import { requireAdmin } from '@/app/data/admin/require-admin';
import { prisma } from '@/lib/db';
import { ApiResponse } from '@/lib/types';
import arcjet, { detectBot, fixedWindow } from '@/lib/arcjet';
import { request } from '@arcjet/next';
import { revalidatePath } from 'next/cache';

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

export async function deleteCourse(courseId: string): Promise<ApiResponse> {
  const req = await request();
  const user = await requireAdmin();
  const decision = await aj.protect(req, {
    fingerprint: user?.user.id as string,
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
  try {
    await prisma.course.delete({
      where: { id: courseId, userId: user.user.id },
    });
    // this could be a problem as there is a relation between the course and the chapters and lessons so we have to delete them all in a transaction
    // or we can use the cascade delete in the prisma schema
    revalidatePath(`/admin/courses`);
    return { message: 'Course deleted successfully', status: 'success' };
  } catch {
    return { message: 'Error deleting course', status: 'error' };
  }
}
