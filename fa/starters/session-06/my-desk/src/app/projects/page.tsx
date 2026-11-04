import { PageHeader } from "@/components/page-header";

const projects = [
  { title: "کارهای خانه", count: 3 },
  { title: "کارهای اداری", count: 5 },
];

export default function ProjectsPage() {
  const main = projects.find((p) => p.title === "کارهای خانه");
  const sub = main
    ? `کارها، گروه‌بندی‌شده در پروژه‌ها. ${main.count.toLocaleString("fa-IR")} کار در پروژهٔ اصلی.`
    : "کارها، گروه‌بندی‌شده در پروژه‌ها.";

  return <PageHeader title="پروژه‌ها" sub={sub} />;
}
