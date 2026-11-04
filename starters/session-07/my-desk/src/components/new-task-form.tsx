"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { clsx } from "clsx";
import { DEFAULT_META, TaskMetaFields, type TaskMeta } from "@/components/task-fields";
import { createTask } from "@/app/tasks/actions";

export function NewTaskForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [meta, setMeta] = useState<TaskMeta>(DEFAULT_META);
  const [error, setError] = useState("");
  const [saving, startSaving] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setError("عنوان را بنویسید.");
      return;
    }
    startSaving(async () => {
      const result = await createTask({ title: cleanTitle, description: description.trim(), ...meta });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setTitle("");
      setDescription("");
      setMeta(DEFAULT_META);
      setError("");
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mb-6 flex flex-col gap-4 rounded-xl border border-line bg-card p-4">
      <h2 className="font-bold">کار جدید</h2>

      <div className="flex flex-col gap-1">
        <label htmlFor="task-title" className="text-sm font-semibold">
          عنوان <span className="text-high">*</span>
        </label>
        <input
          id="task-title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError("");
          }}
          aria-invalid={!!error}
          aria-describedby={error ? "task-title-error" : undefined}
          className={clsx(
            "rounded-lg border bg-bg px-3 py-2 outline-none focus:border-accent",
            error ? "border-high" : "border-line",
          )}
        />
        {error && (
          <p id="task-title-error" role="alert" className="text-sm text-high">
            {error}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="task-description" className="text-sm font-semibold">
          توضیح <span className="font-normal text-muted">(اختیاری)</span>
        </label>
        <textarea
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="rounded-lg border border-line bg-bg px-3 py-2 outline-none focus:border-accent"
        />
      </div>

      <TaskMetaFields idPrefix="task" value={meta} onChange={setMeta} />

      <button
        type="submit"
        disabled={saving}
        className="flex items-center gap-2 self-start rounded-lg bg-accent px-4 py-2 font-semibold text-white hover:opacity-90 disabled:opacity-60"
      >
        <Plus className="size-5" />
        {saving ? "در حال ذخیره…" : "افزودن کار"}
      </button>
    </form>
  );
}
