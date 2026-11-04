import type { Prisma } from "@prisma/client";
import type { ProjectOption, Task } from "@/components/task-fields";
import { db } from "@/lib/db";

// نام‌های دیتابیس ← نام‌های رابط کاربری
const PRIORITY_FROM_DB = { HIGH: "high", MEDIUM: "mid", LOW: "low" } as const;
const STATUS_FROM_DB = { TODO: "todo", IN_PROGRESS: "doing", DONE: "done" } as const;

/** کارها را از دیتابیس می‌خواند؛ با `where` می‌شود مثلاً فقط کارهای یک پروژه را گرفت. */
export async function loadTasks(where?: Prisma.TaskWhereInput): Promise<Task[]> {
  const rows = await db.task.findMany({ where, include: { project: true }, orderBy: { createdAt: "desc" } });
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    priority: PRIORITY_FROM_DB[r.priority],
    due: r.dueDate,
    status: STATUS_FROM_DB[r.status],
    projectId: r.projectId,
    projectName: r.project?.name ?? null,
  }));
}

/** فهرست پروژه‌ها برای منوی انتخاب پروژه در فرم کار */
export async function loadProjectOptions(): Promise<ProjectOption[]> {
  return db.project.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } });
}
