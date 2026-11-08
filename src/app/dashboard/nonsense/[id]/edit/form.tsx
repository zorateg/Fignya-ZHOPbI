"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import Button from "@/components/ui/button";
import { updateNonsenseItem } from "@/lib/nonsense-actions";

interface EditFormProps {
  item: {
    id: number;
    title: string;
    body: string;
    category: string;
    rating: number;
  };
}

export default function EditForm({ item }: EditFormProps) {
  const [error, setError] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  async function handleSubmit(formData: FormData) {
    const result = await updateNonsenseItem(item.id, null, formData);
    if (result.error) {
      setError(result.error);
      toast({ title: "Ошибка", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Обновлено", description: "Запись сохранена" });
      router.replace(`/dashboard/nonsense/${item.id}`);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && <p className="text-sm text-red-300">{error}</p>}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-300">Заголовок</label>
        <input
          name="title"
          defaultValue={item.title}
          className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white shadow-none focus:border-fuchsia-400/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-300">Описание</label>
        <textarea
          name="body"
          defaultValue={item.body}
          rows={6}
          className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white shadow-none focus:border-fuchsia-400/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20"
          required
        ></textarea>
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
          <label className="block text-sm font-medium text-zinc-300">Рейтинг (1–5)</label>
          <select name="rating" className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white shadow-none focus:border-fuchsia-400/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20">
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="pt-2 flex gap-3">
        <Button type="submit">Сохранить изменения</Button>
      </div>
    </form>
  );
}
