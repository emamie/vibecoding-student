"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";

type Result = { ok: true } | { ok: false; error: string };

export async function createProject(name: string): Promise<Result> {
  const parsed = z.string().trim().min(1).safeParse(name);
  if (!parsed.success) return { ok: false, error: "نام پروژه را بنویسید." };
  try {
    await db.project.create({ data: { name: parsed.data } });
  } catch (e) {
    console.error(e);
    return { ok: false, error: "پروژه ذخیره نشد. دوباره امتحان کنید." };
  }
  revalidatePath("/projects");
  // منوی انتخاب پروژه در صفحهٔ کارها هم پروژهٔ تازه را نشان دهد.
  revalidatePath("/tasks");
  return { ok: true };
}
