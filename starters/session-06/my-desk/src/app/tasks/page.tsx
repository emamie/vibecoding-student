import { PageHeader } from "@/components/page-header";
import { TasksBoard } from "@/components/tasks-board";

export default function TasksPage() {
  return (
    <>
      <PageHeader title="کارها" sub="فهرست همهٔ کارها." />
      <TasksBoard />
    </>
  );
}
