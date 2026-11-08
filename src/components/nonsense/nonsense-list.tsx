"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, RefreshCw, SlidersHorizontal } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import Button from "@/components/ui/button";
import { EmptyState } from "./empty-state";
import { NonsenseCard } from "./nonsense-card";
import Link from "next/link";
import { createNonsenseItem, deleteNonsenseItem } from "@/lib/nonsense-actions";
import { categoryOptions, type NonsenseItem } from "@/lib/nonsense";

interface NonsenseListProps {
  initialItems: NonsenseItem[];
  viewerId: number;
  isAdmin: boolean;
}

export function NonsenseList({ initialItems, viewerId, isAdmin }: NonsenseListProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [items, setItems] = useState<NonsenseItem[]>(initialItems);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [showForm, setShowForm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const filtered = items
    .filter((item) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.body.toLowerCase().includes(q);
      const matchesCategory = category === "all" || item.category === category;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sort === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sort === "rating") return b.rating - a.rating;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const handleCreate = async (formData: FormData) => {
    const result = await createNonsenseItem(null, formData);
    if (result.error) {
      toast({ title: "Ошибка", description: result.error, variant: "destructive" });
      return false;
    }
    toast({ title: "Создано", description: "Новая фигня добавлена в коллекцию" });
    setShowForm(false);
    router.refresh();
    return true;
  };

  const handleDelete = async (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    const result = await deleteNonsenseItem(id);
    if (result.error) {
      toast({ title: "Не удалось удалить", description: result.error, variant: "destructive" });
      router.refresh();
    } else {
      toast({ title: "Удалено", description: "Фигня исчезла безвозвратно" });
    }
  };

  const refresh = () => {
    setRefreshing(true);
    router.refresh();
    setTimeout(() => setRefreshing(false), 700);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-plum">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Коллекция
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">Фигня</h1>
          <p className="mt-1 text-sm text-zinc-400">
            {items.length} записей в коллекции · {filtered.length} показано
          </p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)} className="md:w-auto">
          <Plus className="h-4 w-4" />
          {showForm ? "Скрыть форму" : "Добавить фигню"}
        </Button>
      </div>

      {showForm && <CreatePanel onCreate={handleCreate} />}

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            placeholder="Поиск по заголовку и описанию…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 focus:border-fuchsia-400/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-10 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-zinc-200 focus:border-fuchsia-400/50 focus:outline-none"
          >
            <option value="all">Все категории</option>
            {categoryOptions.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-10 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-zinc-200 focus:border-fuchsia-400/50 focus:outline-none"
          >
            <option value="newest">Сначала новые</option>
            <option value="oldest">Сначала старые</option>
            <option value="rating">По рейтингу</option>
          </select>
          <button
            onClick={refresh}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-zinc-300 transition hover:bg-white/[0.08]"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Обновить</span>
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={items.length === 0 ? "Коллекция пуста" : "Ничего не найдено"}
          description={
            items.length === 0
              ? "Добавьте свою первую фигню — Жора лично её оценит."
              : "Измените поисковый запрос или сбросьте фильтры, чтобы увидеть больше фигни."
          }
          actionLabel={items.length === 0 ? "Добавить фигню" : undefined}
          actionHref={items.length === 0 ? "/dashboard/nonsense/new" : undefined}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <NonsenseCard
              key={item.id}
              item={item}
              viewerId={viewerId}
              isAdmin={isAdmin}
              onDelete={() => handleDelete(item.id)}
            />
          ))}
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-brand-soft p-5 text-center">
        <p className="text-sm text-zinc-300">
          Не хватает вдохновения?{" "}
          <Link href="/dashboard/nonsense/new" className="font-medium text-fuchsia-300 hover:underline">
            Откройте полную форму
          </Link>{" "}
          и добавьте фигню с описанием и категорией.
        </p>
      </div>
    </div>
  );
}

function CreatePanel({ onCreate }: { onCreate: (formData: FormData) => Promise<boolean> }) {
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setPending(true);
    const ok = await onCreate(new FormData(form));
    if (ok) form.reset();
    setPending(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-3 rounded-2xl border border-plum/25 bg-brand-soft p-5 sm:grid-cols-6"
    >
      <div className="sm:col-span-3">
        <label className="mb-1.5 block text-xs font-medium text-zinc-300">Заголовок</label>
        <input
          name="title"
          placeholder="Например: Сапоги для хомяков"
          className="h-10 w-full rounded-xl border border-white/10 bg-void/40 px-3 text-sm text-white placeholder:text-zinc-500 focus:border-fuchsia-400/50 focus:outline-none"
          required
        />
      </div>
      <div className="sm:col-span-3">
        <label className="mb-1.5 block text-xs font-medium text-zinc-300">Категория</label>
        <select
          name="category"
          className="h-10 w-full rounded-xl border border-white/10 bg-void/40 px-3 text-sm text-zinc-200 focus:border-fuchsia-400/50 focus:outline-none"
        >
          <option value="meme">Мем</option>
          <option value="absurd">Абсурд</option>
          <option value="quote">Цитата</option>
          <option value="invention">Изобретение</option>
          <option value="other">Прочее</option>
        </select>
      </div>
      <div className="sm:col-span-4">
        <label className="mb-1.5 block text-xs font-medium text-zinc-300">Описание</label>
        <textarea
          name="body"
          rows={2}
          placeholder="В чём именно заключается фигня?"
          className="w-full resize-none rounded-xl border border-white/10 bg-void/40 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-fuchsia-400/50 focus:outline-none"
          required
        />
      </div>
      <div className="sm:col-span-1">
        <label className="mb-1.5 block text-xs font-medium text-zinc-300">Рейтинг</label>
        <select
          name="rating"
          className="h-10 w-full rounded-xl border border-white/10 bg-void/40 px-3 text-sm text-zinc-200 focus:border-fuchsia-400/50 focus:outline-none"
        >
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-1">
        <label className="mb-1.5 block text-xs font-medium text-transparent">.</label>
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "…" : "Добавить"}
        </Button>
      </div>
    </form>
  );
}
