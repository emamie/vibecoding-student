"use client";

import { PageHeader } from "@/components/page-header";
import { ErrorState } from "@/components/tasks-states";

// اگر خواندن کارها از دیتابیس شکست بخورد، این صفحه نشان داده می‌شود.
export default function TasksError({ reset }: { reset: () => void }) {
  return (
    <>
      <PageHeader title="کارها" sub="فهرست همهٔ کارها." />
      <ErrorState onRetry={reset} />
    </>
  );
}
