import Link from "next/link";
import { clsx } from "clsx";

// ظاهر کارت کارها و پروژه‌ها از همین‌جا کنترل می‌شود.
// با href کارت یک لینک است و با رفتن نشانگر رویش، حاشیه‌اش رنگی می‌شود.
// highlighted حاشیه را همیشه رنگی می‌کند (مثلاً وقتی کارت در حال ویرایش است).
export function Card({
  href,
  highlighted = false,
  className,
  children,
}: {
  href?: string;
  highlighted?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const classes = clsx(
    "rounded-xl border bg-card p-4",
    highlighted ? "border-accent" : "border-line",
    href && "transition-colors hover:border-accent",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return <div className={classes}>{children}</div>;
}
