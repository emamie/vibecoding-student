"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { CalendarCheck, FolderKanban, ListTodo, Menu, StickyNote, X } from "lucide-react";
import { clsx } from "clsx";

const NAV = [
  { href: "/", label: "امروز", icon: CalendarCheck },
  { href: "/tasks", label: "کارها", icon: ListTodo },
  { href: "/projects", label: "پروژه‌ها", icon: FolderKanban },
  { href: "/notes", label: "یادداشت‌ها", icon: StickyNote },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={clsx(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
              active ? "bg-accent-soft font-semibold text-accent" : "text-muted hover:bg-bg hover:text-text",
            )}
          >
            <Icon className="size-5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand({ today }: { today: string }) {
  return (
    <div className="mb-6 px-3">
      <div className="text-lg font-bold">میز کار من</div>
      <div className="text-sm text-muted">{today}</div>
    </div>
  );
}

export function AppShell({ today, children }: { today: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-clip md:flex">
      {/* منوی کناری در صفحهٔ بزرگ */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-e border-line bg-card p-4 md:block">
        <Brand today={today} />
        <NavLinks />
      </aside>

      {/* نوار بالا و منوی کشویی در موبایل */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-card px-4 py-2 md:hidden">
          <span className="font-bold">میز کار من</span>
          <Dialog.Trigger className="rounded-lg p-2 text-muted hover:bg-bg" aria-label="باز کردن منو">
            <Menu className="size-6" />
          </Dialog.Trigger>
        </header>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-20 bg-black/30 md:hidden" />
          <Dialog.Content className="fixed inset-y-0 start-0 z-30 w-64 max-w-[80vw] overflow-y-auto bg-card p-4 shadow-xl md:hidden">
            <Dialog.Title className="sr-only">منو</Dialog.Title>
            <Dialog.Description className="sr-only">رفتن به بخش‌های اپ</Dialog.Description>
            <Dialog.Close className="absolute end-3 top-3 rounded-lg p-2 text-muted hover:bg-bg" aria-label="بستن منو">
              <X className="size-5" />
            </Dialog.Close>
            <Brand today={today} />
            <NavLinks onNavigate={() => setOpen(false)} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <main className="mx-auto w-full min-w-0 max-w-4xl flex-1 break-words px-4 py-6 md:px-8">{children}</main>
    </div>
  );
}
