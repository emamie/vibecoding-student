"use client";

import { useState } from "react";
import { AlertTriangle, ListTodo, Plus, RotateCw } from "lucide-react";
import { clsx } from "clsx";

type State = "loading" | "empty" | "error";

const STATES: { value: State; label: string }[] = [
  { value: "loading", label: "در حال بارگذاری" },
  { value: "empty", label: "خالی" },
  { value: "error", label: "خطا" },
];

// انتخاب‌گر آزمایشی: فقط برای دیدن حالت‌ها. بعداً حذف می‌شود.
function StatePicker({ value, onChange }: { value: State; onChange: (s: State) => void }) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-line bg-card p-2 text-sm">
      <span className="px-2 text-muted">حالت آزمایشی:</span>
      {STATES.map((s) => (
        <button
          key={s.value}
          type="button"
          onClick={() => onChange(s.value)}
          aria-pressed={value === s.value}
          className={clsx(
            "rounded-md px-3 py-1 transition-colors",
            value === s.value ? "bg-accent-soft font-semibold text-accent" : "text-muted hover:bg-bg hover:text-text",
          )}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}

function LoadingState() {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">در حال بارگذاری کارها…</span>
      <ul className="flex flex-col gap-3">
        {[0, 1, 2, 3].map((i) => (
          <li key={i} className="flex items-center gap-3 rounded-xl border border-line bg-card p-4">
            <div className="size-5 animate-pulse rounded bg-line" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-2/3 animate-pulse rounded bg-line" />
              <div className="h-3 w-1/3 animate-pulse rounded bg-line" />
            </div>
            <div className="h-6 w-14 animate-pulse rounded-full bg-line" />
          </li>
        ))}
      </ul>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center rounded-xl border border-line bg-card px-6 py-12 text-center">
      <div className="mb-4 rounded-full bg-accent-soft p-4 text-accent">
        <ListTodo className="size-8" />
      </div>
      <h2 className="text-lg font-bold">هنوز کاری ندارید</h2>
      <p className="mt-2 max-w-sm text-sm text-muted">
        فهرستتان خالی و آرام است. اولین کارتان را اضافه کنید تا روزتان را از همین‌جا برنامه‌ریزی کنید.
      </p>
      <button
        type="button"
        className="mt-6 flex items-center gap-2 rounded-lg bg-accent px-4 py-2 font-semibold text-white hover:opacity-90"
      >
        <Plus className="size-5" />
        افزودن کار
      </button>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center rounded-xl border border-high/30 bg-high-soft px-6 py-12 text-center">
      <AlertTriangle className="mb-4 size-8 text-high" />
      <h2 className="text-lg font-bold">کارها بارگذاری نشدند</h2>
      <p className="mt-2 max-w-sm text-sm text-muted">مشکلی پیش آمد. لطفاً دوباره امتحان کنید.</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 flex items-center gap-2 rounded-lg border border-line bg-card px-4 py-2 font-semibold hover:bg-bg"
      >
        <RotateCw className="size-5" />
        دوباره
      </button>
    </div>
  );
}

export function TasksStates() {
  const [state, setState] = useState<State>("loading");

  return (
    <>
      <StatePicker value={state} onChange={setState} />
      {state === "loading" && <LoadingState />}
      {state === "empty" && <EmptyState />}
      {state === "error" && <ErrorState onRetry={() => setState("loading")} />}
    </>
  );
}
