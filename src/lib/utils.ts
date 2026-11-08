import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeDate(date: Date | string) {
  const d = new Date(date);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffDays <= 0) return "Сегодня";
  if (diffDays === 1) return "Вчера";
  if (diffDays < 7) return `${diffDays} дн. назад`;
  return d.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function categoryLabel(category: string) {
  const found = [
    { value: "meme", label: "Мем" },
    { value: "absurd", label: "Абсурд" },
    { value: "quote", label: "Цитата" },
    { value: "invention", label: "Изобретение" },
    { value: "other", label: "Прочее" },
  ].find((c) => c.value === category);
  return found?.label ?? category;
}

export function categoryColor(category: string) {
  const map: Record<string, string> = {
    meme: "border-amber-400/25 bg-amber-400/10 text-amber-200",
    absurd: "border-fuchsia-400/25 bg-fuchsia-400/10 text-fuchsia-200",
    quote: "border-sky-400/25 bg-sky-400/10 text-sky-200",
    invention: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
    other: "border-white/15 bg-white/5 text-zinc-300",
  };
  return map[category] ?? map.other;
}
