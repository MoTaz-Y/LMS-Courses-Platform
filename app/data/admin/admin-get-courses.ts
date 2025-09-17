import { prisma } from '@/lib/db';
import { requireAdmin } from './require-admin';

export async function adminGetCourses() {
  await requireAdmin();
  const data = await prisma.course.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      title: true,
      smallDescription: true,
      duration: true,
      level: true,
      status: true,
      price: true,
      fileKey: true,
      slug: true,
      // image: true,
      // createdAt: true,
      // updatedAt: true,
    },
  });

  return data;
}

export type AdminCourseType = Awaited<ReturnType<typeof adminGetCourses>>[0];
// this is the type of the data that we get from the database instead of the type of the data that we send to the database in every single layer or component
// but also we can make it as always interface inside the component or where ever we need it
