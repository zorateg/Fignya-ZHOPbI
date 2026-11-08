"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createNonsenseItem } from "@/lib/nonsense-actions";
import { useToast } from "@/components/ui/toast";
import Button from "@/components/ui/button";
import Link from "next/link";

export default function NewNonsensePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    const result = await createNonsenseItem(null, formData);
    if (result.error) {
      setError(result.error);
      toast({
        title: "Ошибка",
        description: result.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Создано",
        description: "Новая фигня добавлена в коллекцию. Жора рад.",
      });
      router.replace("/dashboard/nonsense");
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center gap-2">
        <Link href="/dashboard/nonsense">
          <Button variant="outline" size="sm">
            ← Назад к списку
          </Button>
        </Link>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] shadow-none">
        <div className="border-b border-white/10 bg-white/[0.03] px-6 py-4">
          <h2 className="text-lg font-semibold text-white">Новая фигня</h2>
          <p className="text-xs text-zinc-500">Запишите что-нибудь прекрасно бессмысленное.</p>
        </div>
        <form action={handleSubmit} className="p-6 space-y-4">
          {error && <p className="text-sm text-red-300">{error}</p>}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-300">Заголовок</label>
            <input name="title" className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white shadow-none focus:border-fuchsia-400/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20" placeholder="Например: Сапоги для хомяков" required />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-300">Описание</label>
            <textarea name="body" rows={5} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white shadow-none focus:border-fuchsia-400/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20" placeholder="Расскажите подробнее, в чём именно заключается фигня…" required></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-300">Категория</label>
              <select name="category" className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white shadow-none focus:border-fuchsia-400/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20">
                <option value="meme">Мем</option>
                <option value="absurd">Абсурд</option>
                <option value="quote">Цитата</option>
                <option value="invention">Изобретение</option>
                <option value="other">Прочее</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-300">Рейтинг фигни (1–5)</label>
              <select name="rating" className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white shadow-none focus:border-fuchsia-400/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20">
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="pt-2 flex gap-3">
            <Button type="submit">Опубликовать фигню</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
