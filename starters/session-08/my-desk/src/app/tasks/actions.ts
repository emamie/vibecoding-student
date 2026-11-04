"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";

// نام‌های رابط کاربری ← نام‌های دیتابیس
const PRIORITY_TO_DB = { high: "HIGH", mid: "MEDIUM", low: "LOW" } as const;
const STATUS_TO_DB = { todo: "TODO", doing: "IN_PROGRESS", done: "DONE" } as const;

const taskInput = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim(),
  priority: z.enum(["high", "mid", "low"]),
  due: z.date().nullable(),
  status: z.enum(["todo", "doing", "done"]),
  projectId: z.number().int().nullable(),
});

export type TaskInput = z.input<typeof taskInput>;
type Result = { ok: true } | { ok: false; error: string };

function toDb(input: TaskInput) {
  const t = taskInput.parse(input);
  return {
    title: t.title,
    description: t.description,
    priority: PRIORITY_TO_DB[t.priority],
    dueDate: t.due,
    status: STATUS_TO_DB[t.status],
    projectId: t.projectId,
  };
}

async function run(work: () => Promise<unknown>, error: string): Promise<Result> {
  try {
    await work();
  } catch (e) {
    console.error(e);
    return { ok: false, error };
  }
  revalidatePath("/tasks");
  // تعداد کارهای هر پروژه هم عوض می‌شود.
  revalidatePath("/projects", "layout");
  return { ok: true };
}

export async function createTask(input: TaskInput) {
  return run(() => db.task.create({ data: toDb(input) }), "کار ذخیره نشد. دوباره امتحان کنید.");
}

export async function updateTask(id: number, input: TaskInput) {
  return run(() => db.task.update({ where: { id }, data: toDb(input) }), "تغییرها ذخیره نشد. دوباره امتحان کنید.");
}

export async function deleteTask(id: number) {
  return run(() => db.task.delete({ where: { id } }), "کار حذف نشد. دوباره امتحان کنید.");
}
