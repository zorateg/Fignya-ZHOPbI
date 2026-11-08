import { db } from "@/db";
import { nonsenseItems, users } from "@/db/schema";
import { desc, eq, count } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import {
  FileText,
  Star,
  Crown,
  Users,
  Plus,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { formatRelativeDate, categoryColor, categoryLabel } from "@/lib/utils";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  const [[totalCount], [myCount], [featuredCount], [userCount], recentItems] =
    await Promise.all([
      db.select({ count: count() }).from(nonsenseItems),
      db
        .select({ count: count() })
        .from(nonsenseItems)
        .where(eq(nonsenseItems.authorId, user!.id)),
      db
        .select({ count: count() })
        .from(nonsenseItems)
        .where(eq(nonsenseItems.isFeatured, true)),
      db.select({ count: count() }).from(users),
      db
        .select({
          id: nonsenseItems.id,
          title: nonsenseItems.title,
          category: nonsenseItems.category,
          rating: nonsenseItems.rating,
          isFeatured: nonsenseItems.isFeatured,
          createdAt: nonsenseItems.createdAt,
          authorName: users.name,
        })
        .from(nonsenseItems)
        .innerJoin(users, eq(nonsenseItems.authorId, users.id))
        .orderBy(desc(nonsenseItems.createdAt))
        .limit(6),
    ]);

  const stats = [
    {
      label: "Всего записей",
      value: totalCount.count,
      icon: FileText,
      tint: "text-fuchsia-300 border-fuchsia-400/25 bg-fuchsia-400/10",
    },
    {
      label: "Создано вами",
      value: myCount.count,
      icon: Sparkles,
      tint: "text-amber-300 border-amber-400/25 bg-amber-400/10",
    },
    {
      label: "В подборке Жоры",
      value: featuredCount.count,
      icon: Crown,
      tint: "text-violet-300 border-violet-400/25 bg-violet-400/10",
    },
    {
      label: "Коллекционеров",
      value: userCount.count,
      icon: Users,
      tint: "text-emerald-300 border-emerald-400/25 bg-emerald-400/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-plum">
            <Crown className="h-3.5 w-3.5" />
            Premium workspace
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
            Привет, {user?.name.split(" ")[0]} 👋
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Ваша персональная коллекция фигни. Жора уже посмотрел и одобрил.
          </p>
        </div>
        <Link
          href="/dashboard/nonsense/new"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-white glow-cta transition hover:brightness-110"
        >
          <Plus className="h-4 w-4" />
          Добавить фигню
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-400">{s.label}</span>
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg border ${s.tint}`}>
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-4 text-3xl font-bold tracking-tight text-white">
                {s.value}
              </div>
              <div className="mt-1 text-[11px] text-zinc-500">
                обновляется в реальном времени
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
            <h2 className="text-sm font-semibold text-white">Недавно добавлено</h2>
            <Link
              href="/dashboard/nonsense"
              className="inline-flex items-center gap-1 text-xs font-medium text-fuchsia-300 hover:underline"
            >
              Вся фигня <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-white/[0.06]">
              {recentItems.length > 0 ? (
                recentItems.map((item) => (
                  <Link
                    key={item.id}
                    href={`/dashboard/nonsense/${item.id}`}
                    className="flex items-center justify-between gap-3 px-6 py-4 transition-colors hover:bg-white/[0.04]"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-semibold ${categoryColor(item.category)}`}
                      >
                        {categoryLabel(item.category)}
                      </span>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-white">
                          {item.title}
                        </div>
                        <div className="mt-0.5 text-[11px] text-zinc-500">
                          {item.authorName} · {formatRelativeDate(item.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {item.isFeatured && (
                        <Crown className="h-4 w-4 text-amber-300" />
                      )}
                      <span className="flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.05] px-2 py-0.5 text-[11px] text-zinc-300">
                        {item.rating}
                        <Star className="h-3 w-3 fill-amber-300 text-amber-300" />
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="px-6 py-12 text-center text-sm text-zinc-500">
                  Пока ни одной записи. Самое время добавить первую фигню!
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="bg-brand-soft p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white glow-cta">
              <Crown className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-white">
              Подборка Жоры
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-400">
              {featuredCount.count > 0
                ? `${featuredCount.count} единиц фигни удостоены личного одобрения.`
                : "Пока Жора ничего не одобрил. У вас есть шанс стать первым."}
            </p>
            <Link
              href="/dashboard/nonsense"
              className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.07] px-3 text-xs font-medium text-white transition hover:bg-white/[0.12]"
            >
              Посмотреть подборку <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-semibold text-white">Демо-аккаунт</h3>
            <dl className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between gap-3">
                <dt className="text-zinc-500">Email</dt>
                <dd className="truncate text-zinc-300">{user?.email}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-zinc-500">Роль</dt>
                <dd className="text-zinc-300">
                  {user?.role === "admin" ? "Администратор" : "Участник"}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-zinc-500">Пароль</dt>
                <dd className="text-zinc-300">parol123</dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}
