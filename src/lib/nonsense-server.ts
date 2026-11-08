"use server";

import { db } from "@/db";
import { nonsenseItems, users } from "@/db/schema";
import { eq, desc, asc, ilike, and, or } from "drizzle-orm";
import { categoryOptions, type NonsenseItem } from "./nonsense";

const selection = {
  id: nonsenseItems.id,
  title: nonsenseItems.title,
  body: nonsenseItems.body,
  category: nonsenseItems.category,
  rating: nonsenseItems.rating,
  isFeatured: nonsenseItems.isFeatured,
  authorId: nonsenseItems.authorId,
  createdAt: nonsenseItems.createdAt,
  updatedAt: nonsenseItems.updatedAt,
  authorName: users.name,
  authorEmail: users.email,
  authorAvatarUrl: users.avatarUrl,
};

type Row = {
  id: number;
  title: string;
  body: string;
  category: string;
  rating: number;
  isFeatured: boolean;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  authorName: string;
  authorEmail: string;
  authorAvatarUrl: string | null;
};

function toItem(row: Row): NonsenseItem {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    category: row.category,
    rating: row.rating,
    isFeatured: row.isFeatured,
    authorId: row.authorId,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    author: {
      id: row.authorId,
      name: row.authorName,
      email: row.authorEmail,
      avatarUrl: row.authorAvatarUrl,
    },
  };
}

export async function getNonsenseItems({
  search,
  category,
  sort = "newest",
}: {
  search?: string;
  category?: string;
  sort?: "newest" | "oldest" | "rating";
} = {}): Promise<NonsenseItem[]> {
  const conditions = [];

  if (search) {
    conditions.push(
      or(
        ilike(nonsenseItems.title, `%${search}%`),
        ilike(nonsenseItems.body, `%${search}%`),
      ),
    );
  }

  if (category && categoryOptions.some((c) => c.value === category)) {
    conditions.push(eq(nonsenseItems.category, category));
  }

  let orderBy;
  if (sort === "oldest") orderBy = asc(nonsenseItems.createdAt);
  else if (sort === "rating") orderBy = desc(nonsenseItems.rating);
  else orderBy = desc(nonsenseItems.createdAt);

  const rows = await db
    .select(selection)
    .from(nonsenseItems)
    .innerJoin(users, eq(nonsenseItems.authorId, users.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(orderBy);

  return rows.map((row) => toItem(row as Row));
}

export async function getNonsenseItem(id: number): Promise<NonsenseItem | null> {
  const rows = await db
    .select(selection)
    .from(nonsenseItems)
    .innerJoin(users, eq(nonsenseItems.authorId, users.id))
    .where(eq(nonsenseItems.id, id))
    .limit(1);

  if (!rows[0]) return null;
  return toItem(rows[0] as Row);
}
