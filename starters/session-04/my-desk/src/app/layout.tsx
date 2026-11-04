import type { Metadata } from "next";
import "vazirmatn/Vazirmatn-font-face.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "میزِ کارِ من",
  description: "کارها، پروژه‌ها و یادداشت‌ها، در یک جا",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased" style={{ fontFamily: "Vazirmatn, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
