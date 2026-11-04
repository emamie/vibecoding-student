"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { addDays, addMonths, format, getDay, getDaysInMonth, isSameDay, startOfDay, startOfMonth } from "date-fns-jalali";
import { clsx } from "clsx";
import { shortJalali, toFaDigits } from "@/lib/date";

// هفتهٔ شمسی از شنبه شروع می‌شود
const WEEK_DAYS = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

export function JalaliDatePicker({
  id,
  value,
  onChange,
}: {
  id?: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => startOfMonth(value ?? new Date()));
  const boxRef = useRef<HTMLDivElement>(null);

  // با کلیک بیرون از تقویم، بسته شود
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function toggle() {
    if (!open) setMonth(startOfMonth(value ?? new Date()));
    setOpen(!open);
  }

  function pick(date: Date | null) {
    onChange(date);
    setOpen(false);
  }

  const today = startOfDay(new Date());
  const blanks = (getDay(month) + 1) % 7;
  const days = Array.from({ length: getDaysInMonth(month) }, (_, i) => addDays(month, i));

  return (
    <div
      ref={boxRef}
      className="relative"
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.stopPropagation();
          setOpen(false);
        }
      }}
    >
      <button
        id={id}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="flex w-full items-center gap-2 rounded-lg border border-line bg-bg px-3 py-2 text-start outline-none focus:border-accent"
      >
        <CalendarDays className="size-4 text-muted" />
        {value ? shortJalali(value) : <span className="text-muted">بدون موعد</span>}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="انتخاب تاریخ"
          className="absolute start-0 top-full z-10 mt-1 w-72 rounded-xl border border-line bg-card p-3 shadow-lg"
        >
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setMonth(addMonths(month, -1))}
              aria-label="ماه قبل"
              className="rounded-md p-1 hover:bg-bg"
            >
              <ChevronRight className="size-5" />
            </button>
            <span className="font-semibold">{toFaDigits(format(month, "MMMM y"))}</span>
            <button
              type="button"
              onClick={() => setMonth(addMonths(month, 1))}
              aria-label="ماه بعد"
              className="rounded-md p-1 hover:bg-bg"
            >
              <ChevronLeft className="size-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-sm">
            {WEEK_DAYS.map((d) => (
              <span key={d} className="py-1 text-xs text-muted">
                {d}
              </span>
            ))}
            {Array.from({ length: blanks }, (_, i) => (
              <span key={`blank-${i}`} />
            ))}
            {days.map((day) => {
              const selected = value && isSameDay(day, value);
              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => pick(day)}
                  aria-label={shortJalali(day)}
                  aria-pressed={!!selected}
                  className={clsx(
                    "rounded-md py-1.5",
                    selected ? "bg-accent font-semibold text-white" : "hover:bg-accent-soft",
                    !selected && isSameDay(day, today) && "font-bold text-accent ring-1 ring-accent",
                  )}
                >
                  {toFaDigits(format(day, "d"))}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex justify-between border-t border-line pt-2 text-sm">
            <button type="button" onClick={() => pick(today)} className="rounded-md px-2 py-1 text-accent hover:bg-accent-soft">
              امروز
            </button>
            <button type="button" onClick={() => pick(null)} className="rounded-md px-2 py-1 text-muted hover:bg-bg">
              پاک کردن
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
