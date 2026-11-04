import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { TasksBoard } from "@/components/tasks-board";
import { db } from "@/lib/db";
import { loadProjectOptions, loadTasks } from "@/lib/tasks";

// هر بار تازه از دیتابیس خوانده شود.
export const dynamic = "force-dynamic";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  const project = Number.isInteger(id) ? await db.project.findUnique({ where: { id } }) : null;
  if (!project) notFound();

  const [tasks, projects] = await Promise.all([loadTasks({ projectId: id }), loadProjectOptions()]);

  return (
    <>
      <Link href="/projects" className="mb-3 inline-flex items-center gap-1 text-sm text-muted hover:text-accent">
        <ChevronRight className="size-4" />
        بازگشت به پروژه‌ها
      </Link>
      <PageHeader title={project.name} sub={`${tasks.length.toLocaleString("fa-IR")} کار در این پروژه.`} />
      <TasksBoard tasks={tasks} projects={projects} defaultProjectId={id} />
    </>
  );
}
