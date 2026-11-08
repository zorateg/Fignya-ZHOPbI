"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { nonsenseItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "./auth";
import { getNonsenseItem } from "./nonsense-server";
import { nonsenseSchema } from "./nonsense";

export async function createNonsenseItem(
  _prevState: { error?: string } | null,
  formData: FormData,
) {
  "use server";
  const user = await getCurrentUser();
  if (!user) return { error: "Требуется вход в систему" };

  const raw = {
    title: String(formData.get("title") ?? "").trim(),
    body: String(formData.get("body") ?? "").trim(),
    category: String(formData.get("category") ?? "other"),
    rating: String(formData.get("rating") ?? "3"),
  };

  const parsed = nonsenseSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Неверные данные" };
  }

  await db.insert(nonsenseItems).values({
    ...parsed.data,
    authorId: user.id,
  });

  revalidatePath("/dashboard/nonsense");
  revalidatePath("/dashboard");
  return { error: null };
}

export async function updateNonsenseItem(
  id: number,
  _prevState: { error?: string } | null,
  formData: FormData,
) {
  "use server";
  const user = await getCurrentUser();
  if (!user) return { error: "Требуется вход в систему" };

  const existing = await getNonsenseItem(id);
  if (!existing) return { error: "Фигня не найдена" };
  if (existing.authorId !== user.id && user.role !== "admin") {
    return { error: "Недостаточно прав" };
  }

  const raw = {
    title: String(formData.get("title") ?? "").trim(),
    body: String(formData.get("body") ?? "").trim(),
    category: String(formData.get("category") ?? "other"),
    rating: String(formData.get("rating") ?? "3"),
  };

  const parsed = nonsenseSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Неверные данные" };
  }

  await db
    .update(nonsenseItems)
    .set({
      ...parsed.data,
      updatedAt: new Date(),
    })
    .where(eq(nonsenseItems.id, id));

  revalidatePath("/dashboard/nonsense");
  revalidatePath(`/dashboard/nonsense/${id}`);
  return { error: null };
}

export async function deleteNonsenseItem(id: number) {
  "use server";
  const user = await getCurrentUser();
  if (!user) return { error: "Требуется вход в системе" };

  const existing = await getNonsenseItem(id);
  if (!existing) return { error: "Фигня не найдена" };
  if (existing.authorId !== user.id && user.role !== "admin") {
    return { error: "Недостаточно прав" };
  }

  await db.delete(nonsenseItems).where(eq(nonsenseItems.id, id));

  revalidatePath("/dashboard/nonsense");
  revalidatePath("/dashboard");
  return { error: null };
}

export async function toggleFeatured(id: number) {
  "use server";
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return { error: "Требуются права администратора" };
  }

  const existing = await getNonsenseItem(id);
  if (!existing) return { error: "Фигня не найдена" };

  await db
    .update(nonsenseItems)
    .set({ isFeatured: !existing.isFeatured, updatedAt: new Date() })
    .where(eq(nonsenseItems.id, id));

  revalidatePath("/dashboard/nonsense");
  revalidatePath("/dashboard");
  return { error: null };
}
