import type { Metadata } from "next";
import "vazirmatn/Vazirmatn-font-face.css";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { fullJalali } from "@/lib/date";

export const metadata: Metadata = {
  title: "میزِ کارِ من",
  description: "کارها، پروژه‌ها و یادداشت‌ها، در یک جا",
};

// تاریخ امروز باید هر بار تازه حساب شود، نه یک بار موقع ساخت
export const dynamic = "force-dynamic";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen bg-bg text-text antialiased" style={{ fontFamily: "Vazirmatn, sans-serif" }}>
        <AppShell today={fullJalali(new Date())}>{children}</AppShell>
      </body>
    </html>
  );
}
