import { z } from "zod";

export const categoryOptions = [
  { value: "meme", label: "Мем" },
  { value: "absurd", label: "Абсурд" },
  { value: "quote", label: "Цитата" },
  { value: "invention", label: "Изобретение" },
  { value: "other", label: "Прочее" },
] as const;

export type Category = (typeof categoryOptions)[number]["value"];

export const nonsenseSchema = z.object({
  title: z
    .string()
    .min(2, "Заголовок слишком короткий")
    .max(100, "Заголовок слишком длинный"),
  body: z.string().min(5, "Опишите подробнее").max(2000),
  category: z.enum(["meme", "absurd", "quote", "invention", "other"]),
  rating: z.coerce.number().min(1).max(5),
});

export type NonsenseItem = {
  id: number;
  title: string;
  body: string;
  category: string;
  rating: number;
  isFeatured: boolean;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: number;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
};
