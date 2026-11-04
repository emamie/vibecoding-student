"use client";

import { JalaliDatePicker } from "@/components/jalali-date-picker";

export type Priority = "high" | "mid" | "low";
export type Status = "todo" | "doing" | "done";

export type Task = {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  due: Date | null;
  status: Status;
  projectId: number | null;
  projectName: string | null;
};

export type ProjectOption = { id: number; name: string };

export type TaskMeta = Pick<Task, "priority" | "due" | "status" | "projectId">;

export const DEFAULT_META: TaskMeta = { priority: "mid", due: null, status: "todo", projectId: null };

export const PRIORITIES: { value: Priority; label: string }[] = [
  { value: "high", label: "زیاد" },
  { value: "mid", label: "متوسط" },
  { value: "low", label: "کم" },
];

export const STATUSES: { value: Status; label: string }[] = [
  { value: "todo", label: "انجام‌نشده" },
  { value: "doing", label: "در حال انجام" },
  { value: "done", label: "انجام‌شده" },
];

const selectClass = "rounded-lg border border-line bg-bg px-3 py-2 outline-none focus:border-accent";

/** فیلدهای اولویت، موعد، وضعیت و پروژه؛ در فرم «کار جدید» و فرم «ویرایش» */
export function TaskMetaFields({
  idPrefix,
  value,
  onChange,
  projects,
}: {
  idPrefix: string;
  value: TaskMeta;
  onChange: (meta: TaskMeta) => void;
  projects: ProjectOption[];
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="flex flex-col gap-1">
        <label htmlFor={`${idPrefix}-priority`} className="text-sm font-semibold">
          اولویت
        </label>
        <select
          id={`${idPrefix}-priority`}
          value={value.priority}
          onChange={(e) => onChange({ ...value, priority: e.target.value as Priority })}
          className={selectClass}
        >
          {PRIORITIES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor={`${idPrefix}-due`} className="text-sm font-semibold">
          موعد <span className="font-normal text-muted">(اختیاری)</span>
        </label>
        <JalaliDatePicker id={`${idPrefix}-due`} value={value.due} onChange={(due) => onChange({ ...value, due })} />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor={`${idPrefix}-status`} className="text-sm font-semibold">
          وضعیت
        </label>
        <select
          id={`${idPrefix}-status`}
          value={value.status}
          onChange={(e) => onChange({ ...value, status: e.target.value as Status })}
          className={selectClass}
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor={`${idPrefix}-project`} className="text-sm font-semibold">
          پروژه <span className="font-normal text-muted">(اختیاری)</span>
        </label>
        <select
          id={`${idPrefix}-project`}
          value={value.projectId ?? ""}
          onChange={(e) => onChange({ ...value, projectId: e.target.value ? Number(e.target.value) : null })}
          className={selectClass}
        >
          <option value="">بدون پروژه</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
