import { PrismaClient } from "@prisma/client";

// یک اتصال مشترک؛ در حالت توسعه با هر تغییر کد اتصال تازه ساخته نمی‌شود.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
