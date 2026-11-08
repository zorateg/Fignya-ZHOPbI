"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Crown, Trash2, Pencil } from "lucide-react";
import Button from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { deleteNonsenseItem, toggleFeatured } from "@/lib/nonsense-actions";

export function DetailActions({
  itemId,
  title,
  isFeatured,
  isOwner,
  isAdmin,
}: {
  itemId: number;
  title: string;
  isFeatured: boolean;
  isOwner: boolean;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [featured, setFeatured] = useState(isFeatured);
  const [busy, setBusy] = useState(false);

  async function handleToggle() {
    setBusy(true);
    const previous = featured;
    setFeatured(!previous);
    const result = await toggleFeatured(itemId);
    setBusy(false);
    if (result.error) {
      setFeatured(previous);
      toast({ title: "Ошибка", description: result.error, variant: "destructive" });
    } else {
      toast({
        title: !previous ? "Добавлено в подборку" : "Убрано из подборки",
        description: !previous ? "Жора лично одобрил эту фигню" : "Запись больше не в подборке",
      });
      router.refresh();
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Удалить «${title}»? Это нельзя отменить.`)) return;
    setBusy(true);
    const result = await deleteNonsenseItem(itemId);
    if (result.error) {
      setBusy(false);
      toast({ title: "Ошибка", description: result.error, variant: "destructive" });
      return;
    }
    toast({ title: "Удалено", description: "Фигня безвозвратно исчезла" });
    router.push("/dashboard/nonsense");
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={handleToggle}
        disabled={busy}
      >
        <Crown className={`h-3.5 w-3.5 ${featured ? "text-amber-300" : ""}`} />
        {featured ? "Убрать из подборки" : "В подборку Жоры"}
      </Button>
      {isOwner && (
        <Link href={`/dashboard/nonsense/${itemId}/edit`}>
          <Button size="sm" variant="outline">
            <Pencil className="h-3.5 w-3.5" />
            Редактировать
          </Button>
        </Link>
      )}
      {isOwner && (
        <Button size="sm" variant="destructive" onClick={handleDelete} disabled={busy}>
          <Trash2 className="h-3.5 w-3.5" />
          Удалить
        </Button>
      )}
      {isAdmin && !isOwner && (
        <span className="rounded-md border border-amber-400/25 bg-amber-400/10 px-2 py-1 text-[11px] text-amber-200">
          Запись другого автора
        </span>
      )}
    </div>
  );
}
