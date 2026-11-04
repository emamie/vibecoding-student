import { PageHeader } from "@/components/page-header";
import { TasksStates } from "@/components/tasks-states";

export default function TasksPage() {
  return (
    <>
      <PageHeader title="کارها" sub="فهرست همهٔ کارها." />
      <TasksStates />
    </>
  );
}
