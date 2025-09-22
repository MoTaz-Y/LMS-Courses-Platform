import 'server-only';
import { requireAdmin } from './require-admin';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';

export async function getCourse(id: string) {
  await requireAdmin();
  const data = await prisma.course.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      fileKey: true,
      duration: true,
      level: true,
      status: true,
      slug: true,
      smallDescription: true,
      category: true,
      chapter: {
        select: {
          id: true,
          title: true,
          position: true,
          lessons: {
            select: {
              id: true,
              title: true,
              description: true,
              thumbnailkey: true,
              videoKey: true,
              position: true,
            },
          },
        },
      },
    },
  });
  if (!data) return notFound();
  return data;
}

export type AdminCourseSingualrType = Awaited<ReturnType<typeof getCourse>>;
