"use client";

import { useState, useTransition } from "react";
import { ArrowDownWideNarrow, CalendarDays, Check, FolderKanban, Pencil, Trash2, X } from "lucide-react";
import { clsx } from "clsx";
import { startOfDay } from "date-fns-jalali";
import { Card } from "@/components/card";
import { NewTaskForm } from "@/components/new-task-form";
import {
  PRIORITIES,
  STATUSES,
  TaskMetaFields,
  type Priority,
  type ProjectOption,
  type Status,
  type Task,
  type TaskMeta,
} from "@/components/task-fields";
import { EmptyState } from "@/components/tasks-states";
import { deleteTask, updateTask } from "@/app/tasks/actions";
import { shortJalali } from "@/lib/date";

const smallButton = "flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold";
const chip = "flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold";

const PRIORITY_COLORS = {
  high: "bg-high-soft text-high",
  mid: "bg-mid-soft text-mid",
  low: "bg-low-soft text-low",
};

const STATUS_COLORS = {
  todo: "border border-line text-muted",
  doing: "bg-accent-soft text-accent",
  done: "bg-line text-muted",
};

function TaskChips({ task }: { task: Task }) {
  const overdue = task.due && task.status !== "done" && task.due < startOfDay(new Date());
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      <span className={clsx(chip, PRIORITY_COLORS[task.priority])}>
        اولویت {PRIORITIES.find((p) => p.value === task.priority)?.label}
      </span>
      {task.due && (
        <span className={clsx(chip, overdue ? "bg-high-soft text-high" : "bg-bg text-muted")}>
          <CalendarDays className="size-3.5" />
          {shortJalali(task.due)}
          {overdue && " (گذشته)"}
        </span>
      )}
      <span className={clsx(chip, STATUS_COLORS[task.status])}>
        {STATUSES.find((s) => s.value === task.status)?.label}
      </span>
      {task.projectName && (
        <span className={clsx(chip, "bg-bg text-muted")}>
          <FolderKanban className="size-3.5" />
          {task.projectName}
        </span>
      )}
    </div>
  );
}

function TaskItem({ task, projects }: { task: Task; projects: ProjectOption[] }) {
  const [mode, setMode] = useState<"view" | "edit" | "confirm-delete">("view");
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [meta, setMeta] = useState<TaskMeta>({ priority: task.priority, due: task.due, status: task.status, projectId: task.projectId });
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [busy, startBusy] = useTransition();

  function startEdit() {
    setTitle(task.title);
    setDescription(task.description);
    setMeta({ priority: task.priority, due: task.due, status: task.status, projectId: task.projectId });
    setError("");
    setMode("edit");
  }

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setError("عنوان را بنویسید.");
      return;
    }
    startBusy(async () => {
      const result = await updateTask(task.id, { title: cleanTitle, description: description.trim(), ...meta });
      if (result.ok) setMode("view");
      else setError(result.error);
    });
  }

  function handleDelete() {
    setDeleteError("");
    startBusy(async () => {
      const result = await deleteTask(task.id);
      if (!result.ok) {
        setDeleteError(result.error);
        setMode("view");
      }
    });
  }

  if (mode === "edit") {
    const titleId = `edit-title-${task.id}`;
    return (
      <li>
        <Card highlighted>
          <form
            onSubmit={handleSave}
            onKeyDown={(e) => e.key === "Escape" && setMode("view")}
            noValidate
            className="flex flex-col gap-3"
          >
            <div className="flex flex-col gap-1">
              <label htmlFor={titleId} className="text-sm font-semibold">
                عنوان <span className="text-high">*</span>
              </label>
              <input
                id={titleId}
                autoFocus
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (error) setError("");
                }}
                aria-invalid={!!error}
                aria-describedby={error ? `${titleId}-error` : undefined}
                className={clsx(
                  "rounded-lg border bg-bg px-3 py-2 outline-none focus:border-accent",
                  error ? "border-high" : "border-line",
                )}
              />
              {error && (
                <p id={`${titleId}-error`} role="alert" className="text-sm text-high">
                  {error}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor={`edit-description-${task.id}`} className="text-sm font-semibold">
                توضیح <span className="font-normal text-muted">(اختیاری)</span>
              </label>
              <textarea
                id={`edit-description-${task.id}`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="rounded-lg border border-line bg-bg px-3 py-2 outline-none focus:border-accent"
              />
            </div>

            <TaskMetaFields idPrefix={`edit-${task.id}`} value={meta} onChange={setMeta} projects={projects} />

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={busy}
                className={clsx(smallButton, "bg-accent text-white hover:opacity-90 disabled:opacity-60")}
              >
                <Check className="size-4" />
                {busy ? "در حال ذخیره…" : "ذخیره"}
              </button>
              <button
                type="button"
                onClick={() => setMode("view")}
                className={clsx(smallButton, "border border-line hover:bg-bg")}
              >
                <X className="size-4" />
                انصراف
              </button>
            </div>
          </form>
        </Card>
      </li>
    );
  }

  return (
    <li>
      <Card className="flex flex-wrap items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className={clsx("font-semibold", task.status === "done" && "text-muted line-through")}>{task.title}</p>
          {task.description && <p className="mt-1 text-sm whitespace-pre-line text-muted">{task.description}</p>}
          <TaskChips task={task} />
          {deleteError && (
            <p role="alert" className="mt-2 text-sm text-high">
              {deleteError}
            </p>
          )}
        </div>

        {mode === "view" ? (
          <div className="flex gap-2">
            <button type="button" onClick={startEdit} className={clsx(smallButton, "border border-line hover:bg-bg")}>
              <Pencil className="size-4" />
              ویرایش
            </button>
            <button
              type="button"
              onClick={() => setMode("confirm-delete")}
              className={clsx(smallButton, "border border-line text-high hover:bg-high-soft")}
            >
              <Trash2 className="size-4" />
              حذف
            </button>
          </div>
        ) : (
          <div role="alertdialog" aria-label="تأیید حذف" className="flex items-center gap-2">
            <span className="text-sm font-semibold text-high">مطمئنید؟</span>
            <button
              type="button"
              onClick={handleDelete}
              disabled={busy}
              className={clsx(smallButton, "bg-high text-white hover:opacity-90 disabled:opacity-60")}
            >
              {busy ? "در حال حذف…" : "بله، حذف شود"}
            </button>
            <button
              type="button"
              autoFocus
              onClick={() => setMode("view")}
              className={clsx(smallButton, "border border-line hover:bg-bg")}
            >
              نه
            </button>
          </div>
        )}
      </Card>
    </li>
  );
}

function FilterGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T | "all";
  onChange: (value: T | "all") => void;
}) {
  const all: { value: T | "all"; label: string }[] = [{ value: "all", label: "همه" }, ...options];
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-1.5">
      <span className="text-sm text-muted">{label}:</span>
      {all.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          aria-pressed={value === o.value}
          className={clsx(
            "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
            value === o.value ? "border-accent bg-accent-soft text-accent" : "border-line text-muted hover:bg-bg",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// کارها از دیتابیس می‌آیند؛ بعد از هر تغییر، سرور فهرست تازه را می‌فرستد.
export function TasksBoard({
  tasks,
  projects,
  defaultProjectId,
}: {
  tasks: Task[];
  projects: ProjectOption[];
  defaultProjectId?: number;
}) {
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [sortByDue, setSortByDue] = useState(false);

  let shown = tasks.filter(
    (t) => (statusFilter === "all" || t.status === statusFilter) && (priorityFilter === "all" || t.priority === priorityFilter),
  );
  if (sortByDue) {
    // کارهای بی‌موعد آخر فهرست می‌آیند.
    shown = [...shown].sort((a, b) => (a.due?.getTime() ?? Infinity) - (b.due?.getTime() ?? Infinity));
  }

  return (
    <>
      <NewTaskForm projects={projects} defaultProjectId={defaultProjectId} />
      {tasks.length > 0 && (
        <div className="mb-4 flex flex-col gap-3 rounded-xl border border-line bg-card p-3">
          <FilterGroup label="وضعیت" options={STATUSES} value={statusFilter} onChange={setStatusFilter} />
          <FilterGroup label="اولویت" options={PRIORITIES} value={priorityFilter} onChange={setPriorityFilter} />
          <div>
            <button
              type="button"
              onClick={() => setSortByDue((v) => !v)}
              aria-pressed={sortByDue}
              className={clsx(
                smallButton,
                sortByDue ? "bg-accent text-white hover:opacity-90" : "border border-line hover:bg-bg",
              )}
            >
              <ArrowDownWideNarrow className="size-4" />
              مرتب‌سازی بر اساس موعد
            </button>
          </div>
        </div>
      )}
      {tasks.length === 0 ? (
        <EmptyState />
      ) : shown.length === 0 ? (
        <p className="rounded-xl border border-line bg-card p-6 text-center text-sm text-muted">
          هیچ کاری با این فیلترها پیدا نشد.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {shown.map((task) => (
            <TaskItem key={task.id} task={task} projects={projects} />
          ))}
        </ul>
      )}
    </>
  );
}
