import { PageHeader } from "@/components/page-header";
import { LoadingState } from "@/components/tasks-states";

export default function TasksLoading() {
  return (
    <>
      <PageHeader title="کارها" sub="فهرست همهٔ کارها." />
      <LoadingState />
    </>
  );
}
