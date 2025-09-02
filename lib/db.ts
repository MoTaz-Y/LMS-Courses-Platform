// this file is for connecting to the database because prisma client is not compatible with nextjs as nextjs is serverless

import { PrismaClient } from './generated/prisma';
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
