import { PageHeader } from "@/components/page-header";
import { TasksBoard } from "@/components/tasks-board";
import { loadProjectOptions, loadTasks } from "@/lib/tasks";

// هر بار تازه از دیتابیس خوانده شود.
export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const [tasks, projects] = await Promise.all([loadTasks(), loadProjectOptions()]);

  return (
    <>
      <PageHeader title="کارها" sub="فهرست همهٔ کارها." />
      <TasksBoard tasks={tasks} projects={projects} />
    </>
  );
}
