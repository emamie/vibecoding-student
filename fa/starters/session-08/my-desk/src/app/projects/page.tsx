import { ChevronLeft, FolderKanban } from "lucide-react";
import { Card } from "@/components/card";
import { NewProjectForm } from "@/components/new-project-form";
import { PageHeader } from "@/components/page-header";
import { db } from "@/lib/db";

// هر بار تازه از دیتابیس خوانده شود.
export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await db.project.findMany({
    include: { _count: { select: { tasks: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <>
      <PageHeader title="پروژه‌ها" sub="کارها، گروه‌بندی‌شده در پروژه‌ها." />
      <NewProjectForm />
      {projects.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-line bg-card px-6 py-12 text-center">
          <div className="mb-4 rounded-full bg-accent-soft p-4 text-accent">
            <FolderKanban className="size-8" />
          </div>
          <h2 className="text-lg font-bold">هنوز پروژه‌ای ندارید</h2>
          <p className="mt-2 max-w-sm text-sm text-muted">با فرم بالا اولین پروژه را بسازید و کارهایتان را در آن گروه کنید.</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {projects.map((p) => (
            <li key={p.id}>
              <Card href={`/projects/${p.id}`} className="flex items-center gap-3">
                <FolderKanban className="size-5 text-accent" />
                <span className="min-w-0 flex-1 font-semibold">{p.name}</span>
                <span className="rounded-full bg-bg px-2.5 py-0.5 text-xs font-semibold text-muted">
                  {p._count.tasks.toLocaleString("fa-IR")} کار
                </span>
                <ChevronLeft className="size-5 text-muted" />
              </Card>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
