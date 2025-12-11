'use server';

import { requireAdmin } from '@/app/data/admin/require-admin';
import { prisma } from '@/lib/db';
import { ApiResponse } from '@/lib/types';
import {
  chapterSchema,
  ChapterSchemaType,
  courseSchema,
  CourseSchemaType,
  lessonSchema,
  LessonSchemaType,
} from '@/lib/zodSchemas';
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

export async function editCourse(
  data: CourseSchemaType,
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
    const result = courseSchema.safeParse(data);
    if (!result.success) {
      return { status: 'error', message: 'Invalid data' };
    }
    await prisma.course.update({
      where: { id: courseId, userId: user.user.id },
      data: {
        ...result.data,
      },
    });
    return { message: 'Course edited successfully', status: 'success' };
  } catch {
    return { message: 'Error parsing data', status: 'error' };
  }
}

export async function reorderLessons(
  chapterId: string,
  lessons: { id: string; position: number }[],
  courseId: string
): Promise<ApiResponse> {
  await requireAdmin();
  try {
    if (!lessons || lessons.length === 0) {
      return { status: 'error', message: 'No lessons to reorder' };
    }
    const updates = lessons.map((lesson) =>
      prisma.lesson.update({
        where: {
          id: lesson.id,
          chapterId: chapterId,
        },
        data: {
          position: lesson.position,
        },
      })
    );
    await prisma.$transaction(updates);
    revalidatePath(`/admin/courses/${courseId}/edit`);
    return { status: 'success', message: 'Lessons reordered successfully' };
  } catch {
    return {
      status: 'error',
      message: 'Failed to reorder lessons',
    };
  }
}

export async function reorderChapters(
  chapters: { id: string; position: number }[],
  courseId: string
): Promise<ApiResponse> {
  await requireAdmin();
  try {
    if (!chapters || chapters.length === 0) {
      return { status: 'error', message: 'No chapters to reorder' };
    }
    const updates = chapters.map((chapter) =>
      prisma.chapter.update({
        where: {
          id: chapter.id,
          courseId: courseId,
        },
        data: {
          position: chapter.position,
        },
      })
    );
    await prisma.$transaction(updates);
    revalidatePath(`/admin/courses/${courseId}/edit`);
    return { status: 'success', message: 'Chapters reordered successfully' };
  } catch {
    return {
      status: 'error',
      message: 'Failed to reorder chapters',
    };
  }
}

export async function createChapter(
  values: ChapterSchemaType
): Promise<ApiResponse> {
  await requireAdmin();
  try {
    const result = chapterSchema.safeParse(values);
    if (!result.success) {
      return { status: 'error', message: 'Invalid data' };
    }
    // using transaction in here is very critical to insures data integrity if two users try to create a chapter at the same time they will not overwrite each other or get the same position number
    await prisma.$transaction(async (tx) => {
      const maxPos = await tx.chapter.aggregate({
        where: {
          courseId: values.courseId,
        },
        _max: {
          position: true,
        },
      });
      await tx.chapter.create({
        data: {
          title: result.data.name,
          courseId: result.data.courseId,
          position: (maxPos._max.position ?? 0) + 1,
        },
      });
    });
    // await prisma.$transaction( async (tx)=>{
    //   const maxPos = await tx.chapter.findFirst ({
    //     where: {
    //       courseId: values.courseId,
    //     },
    //     orderBy: {
    //       position: 'desc',
    //     },
    //     select: {
    //       position: true,
    //     },
    //   });
    //   await tx.chapter.create({
    //     data: {
    //       title: result.data.name,
    //       courseId: result.data.courseId,
    //       position: maxPos ? maxPos.position + 1 : 1,
    //     },
    //   });
    // });
    revalidatePath(`/admin/courses/${values.courseId}/edit`);
    return { message: 'Chapter created successfully', status: 'success' };
  } catch {
    return { message: 'Error parsing data', status: 'error' };
  }
}

export async function deleteChapter(
  chapterId: string,
  courseId: string
): Promise<ApiResponse> {
  await requireAdmin();
  try {
    await prisma.chapter.delete({
      where: {
        id: chapterId,
        courseId: courseId,
      },
    });
    revalidatePath(`/admin/courses/${courseId}/edit`);
    return { message: 'Chapter deleted successfully', status: 'success' };
  } catch {
    return { message: 'Error deleting chapter', status: 'error' };
  }
}

export async function createLesson(
  values: LessonSchemaType
): Promise<ApiResponse> {
  await requireAdmin();
  try {
    const result = lessonSchema.safeParse(values);
    console.log('result', result);
    if (!result.success) {
      return { status: 'error', message: 'Invalid data' };
    }
    await prisma.$transaction(async (tx) => {
      // console.log('tx', tx.lesson);
      const maxPos = await tx.lesson.findFirst({
        where: {
          chapterId: values.chapterId,
        },
        orderBy: {
          position: 'desc',
        },
        select: {
          position: true,
        },
      });
      await tx.lesson.create({
        data: {
          title: result.data.name,
          description: result.data.description,
          videoKey: result.data.videoKey,
          thumbnailkey: result.data.thumbnailkey,
          chapterId: result.data.chapterId,
          position: (maxPos?.position ?? 0) + 1,
        },
      });
    });
    revalidatePath(`/admin/courses/${values.courseId}/edit`);
    return { message: 'Lesson created successfully', status: 'success' };
  } catch {
    return { message: 'Error parsing data', status: 'error' };
  }
}

export async function deleteLesson(
  lessonId: string,
  chapterId: string,
  courseId: string
): Promise<ApiResponse> {
  await requireAdmin();
  try {
    await prisma.lesson.delete({
      where: {
        id: lessonId,
        chapterId: chapterId,
      },
    });
    revalidatePath(`/admin/courses/${courseId}/edit`);
    return { message: 'Lesson deleted successfully', status: 'success' };
  } catch {
    return { message: 'Error deleting lesson', status: 'error' };
  }
}
