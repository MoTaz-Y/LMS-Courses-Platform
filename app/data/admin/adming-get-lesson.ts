import 'server-only';
import { requireAdmin } from './require-admin';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';

export async function getLesson(id: string) {
  await requireAdmin();
  const data = await prisma.lesson.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      thumbnailkey: true,
      videoKey: true,
      position: true,
      chapterId: true,
    },
  });
  if (!data) return notFound();
  return data;
}

export type AdminLessonSingualrType = Awaited<ReturnType<typeof getLesson>>;
