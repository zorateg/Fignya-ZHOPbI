import { db } from "@/db";
import { nonsenseItems, users as usersSchema } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { formatRelativeDate, categoryLabel, categoryColor } from "@/lib/utils";
import { Crown, ArrowLeft, Star, Pencil } from "lucide-react";
import { DetailActions } from "@/components/nonsense/detail-actions";

export default async function NonsenseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const itemId = Number(id);
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const record = await db
    .select({
      id: nonsenseItems.id,
      title: nonsenseItems.title,
      body: nonsenseItems.body,
      category: nonsenseItems.category,
      rating: nonsenseItems.rating,
      isFeatured: nonsenseItems.isFeatured,
      authorId: nonsenseItems.authorId,
      createdAt: nonsenseItems.createdAt,
      updatedAt: nonsenseItems.updatedAt,
      authorName: usersSchema.name,
    })
    .from(nonsenseItems)
    .innerJoin(usersSchema, eq(nonsenseItems.authorId, usersSchema.id))
    .where(eq(nonsenseItems.id, itemId))
    .limit(1)
    .then((rows) => rows[0]);

  if (!record) redirect("/dashboard/nonsense");

  const isOwner = record.authorId === user.id;
  const isAdmin = user.role === "admin";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/dashboard/nonsense"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> К списку фигни
      </Link>

      <Card className="overflow-hidden">
        <div className="relative border-b border-white/[0.07] bg-brand-soft p-6">
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-plum/25 blur-3xl" />
          <div className="relative flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-md border px-2 py-0.5 text-[11px] font-semibold ${categoryColor(record.category)}`}>
                  {categoryLabel(record.category)}
                </span>
                {record.isFeatured && (
                  <span className="inline-flex items-center gap-1 rounded-md border border-amber-400/25 bg-amber-400/10 px-2 py-0.5 text-[11px] font-semibold text-amber-200">
                    <Crown className="h-3 w-3" /> Подборка Жоры
                  </span>
                )}
              </div>
              <h1 className="mt-4 text-2xl font-bold leading-tight text-white sm:text-3xl">
                {record.title}
              </h1>
              <p className="mt-2 text-xs text-zinc-400">
                Запись №{record.id} · {isOwner ? "Ваша запись" : `Автор: ${record.authorName}`} ·{" "}
                {formatRelativeDate(record.createdAt)}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1 text-2xl font-bold text-white">
                {record.rating}
                <Star className="h-5 w-5 fill-amber-300 text-amber-300" />
              </div>
              <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                рейтинг фигни
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-3 text-sm leading-relaxed text-zinc-300 sm:text-[15px]">
            {record.body.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-white/[0.07] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-[11px] text-zinc-500">
              Обновлено: {formatRelativeDate(record.updatedAt)}
            </div>
            <DetailActions
              itemId={record.id}
              title={record.title}
              isFeatured={record.isFeatured}
              isOwner={isOwner}
              isAdmin={isAdmin}
            />
          </div>
        </div>
      </Card>

      {isOwner && (
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-xs text-zinc-400">
          <Pencil className="h-4 w-4 text-plum" />
          Вы можете отредактировать или удалить эту запись в любой момент.
        </div>
      )}
    </div>
  );
}
