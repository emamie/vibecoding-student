import { PageHeader } from "@/components/page-header";
import { TasksBoard } from "@/components/tasks-board";
import type { Task } from "@/components/task-fields";
import { db } from "@/lib/db";

// نام‌های دیتابیس ← نام‌های رابط کاربری
const PRIORITY_FROM_DB = { HIGH: "high", MEDIUM: "mid", LOW: "low" } as const;
const STATUS_FROM_DB = { TODO: "todo", IN_PROGRESS: "doing", DONE: "done" } as const;

// هر بار تازه از دیتابیس خوانده شود.
export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const rows = await db.task.findMany({ orderBy: { createdAt: "desc" } });
  const tasks: Task[] = rows.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    priority: PRIORITY_FROM_DB[r.priority],
    due: r.dueDate,
    status: STATUS_FROM_DB[r.status],
  }));

  return (
    <>
      <PageHeader title="کارها" sub="فهرست همهٔ کارها." />
      <TasksBoard tasks={tasks} />
    </>
  );
}
