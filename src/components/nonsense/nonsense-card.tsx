"use client";

import Link from "next/link";
import { Trash2, Crown, Star, Pencil } from "lucide-react";
import { formatRelativeDate, categoryLabel, categoryColor } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { deleteNonsenseItem, toggleFeatured } from "@/lib/nonsense-actions";
import type { NonsenseItem } from "@/lib/nonsense";

interface NonsenseCardProps {
  item: NonsenseItem;
  isAdmin: boolean;
  viewerId: number;
  onDelete?: () => void;
}

export function NonsenseCard({ item, isAdmin, viewerId, onDelete }: NonsenseCardProps) {
  const { toast } = useToast();
  const isOwner = item.authorId === viewerId;

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(`Удалить «${item.title}»? Это нельзя отменить.`)) return;
    onDelete?.();
    const result = await deleteNonsenseItem(item.id);
    if (result.error) {
      toast({ title: "Не удалось удалить", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Удалено", description: "Фигня безвозвратно исчезла" });
    }
  }

  async function handleToggleFeatured(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const result = await toggleFeatured(item.id);
    if (result.error) {
      toast({ title: "Ошибка", description: result.error, variant: "destructive" });
    }
  }

  return (
    <Link href={`/dashboard/nonsense/${item.id}`} className="group block">
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] transition-all hover:-translate-y-0.5 hover:border-plum/40 hover:bg-white/[0.055]">
        <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-plum/20 opacity-0 blur-3xl transition-opacity group-hover:opacity-100" />
        <div className="relative flex-1 p-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold ${categoryColor(item.category)}`}>
              {categoryLabel(item.category)}
            </span>
            <div className="flex items-center gap-2">
              {item.isFeatured && (
                <span title="В подборке Жоры" className="text-amber-300">
                  <Crown className="h-3.5 w-3.5" />
                </span>
              )}
              <span className="flex items-center gap-1 text-[11px] font-medium text-zinc-300">
                {item.rating}
                <Star className="h-3 w-3 fill-amber-300 text-amber-300" />
              </span>
            </div>
          </div>

          <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-white group-hover:text-fuchsia-100">
            {item.title}
          </h3>
          <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-zinc-400">
            {item.body}
          </p>
        </div>

        <div className="relative flex items-center justify-between gap-2 border-t border-white/[0.07] px-5 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
              {item.author.name.slice(0, 1).toUpperCase()}
            </span>
            <span className="truncate text-[11px] text-zinc-400">
              {isOwner ? "Вы" : item.author.name} · {formatRelativeDate(item.createdAt)}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {isAdmin && (
              <button
                onClick={handleToggleFeatured}
                title={item.isFeatured ? "Убрать из подборки" : "В подборку Жоры"}
                className={`rounded-lg p-1.5 transition-colors hover:bg-white/10 ${
                  item.isFeatured ? "text-amber-300" : "text-zinc-500 hover:text-white"
                }`}
              >
                <Crown className="h-3.5 w-3.5" />
              </button>
            )}
            {isOwner && (
              <>
                <Link
                  href={`/dashboard/nonsense/${item.id}/edit`}
                  onClick={(e) => e.stopPropagation()}
                  title="Редактировать"
                  className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Link>
                <button
                  onClick={handleDelete}
                  title="Удалить"
                  className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-red-500/15 hover:text-red-300"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
