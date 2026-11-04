"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { clsx } from "clsx";
import { createProject } from "@/app/projects/actions";

export function NewProjectForm() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [saving, startSaving] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setError("نام پروژه را بنویسید.");
      return;
    }
    startSaving(async () => {
      const result = await createProject(cleanName);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setName("");
      setError("");
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mb-6 flex flex-col gap-2 rounded-xl border border-line bg-card p-4">
      <label htmlFor="project-name" className="font-bold">
        پروژهٔ جدید
      </label>
      <div className="flex flex-wrap gap-2">
        <input
          id="project-name"
          value={name}
          placeholder="مثلاً کارهای خانه"
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError("");
          }}
          aria-invalid={!!error}
          aria-describedby={error ? "project-name-error" : undefined}
          className={clsx(
            "min-w-0 flex-1 rounded-lg border bg-bg px-3 py-2 outline-none focus:border-accent",
            error ? "border-high" : "border-line",
          )}
        />
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 font-semibold text-white hover:opacity-90 disabled:opacity-60"
        >
          <Plus className="size-5" />
          {saving ? "در حال ذخیره…" : "افزودن پروژه"}
        </button>
      </div>
      {error && (
        <p id="project-name-error" role="alert" className="text-sm text-high">
          {error}
        </p>
      )}
    </form>
  );
}
