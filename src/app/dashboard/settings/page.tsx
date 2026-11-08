import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ChangePasswordForm from "./form";
import { Crown, Mail, User as UserIcon, CalendarDays, ShieldCheck } from "lucide-react";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  const rows = [
    { icon: UserIcon, label: "Имя", value: user.name },
    { icon: Mail, label: "Email", value: user.email },
    {
      icon: ShieldCheck,
      label: "Роль",
      value: user.role === "admin" ? "Администратор" : "Участник",
    },
    { icon: CalendarDays, label: "Участник с", value: memberSince },
  ];

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-plum">
          <Crown className="h-3.5 w-3.5" />
          Аккаунт
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">Настройки</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Управляйте профилем и безопасностью аккаунта.
        </p>
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-col items-start gap-4 border-b border-white/[0.07] bg-brand-soft p-6 sm:flex-row sm:items-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-lg font-bold text-white glow-cta">
            {user.name.slice(0, 2).toUpperCase()}
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold text-white">{user.name}</h2>
            <p className="truncate text-sm text-zinc-400">{user.email}</p>
          </div>
          <span className="sm:ml-auto rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold text-amber-200">
            {user.role === "admin" ? "PREMIUM" : "СТАРТ"}
          </span>
        </div>
        <CardContent className="p-0">
          <dl className="divide-y divide-white/[0.06]">
            {rows.map((r) => {
              const Icon = r.icon;
              return (
                <div key={r.label} className="flex items-center gap-4 px-6 py-4">
                  <Icon className="h-4 w-4 text-zinc-500" />
                  <dt className="w-32 shrink-0 text-sm text-zinc-500">{r.label}</dt>
                  <dd className="truncate text-sm text-zinc-200">{r.value}</dd>
                </div>
              );
            })}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Безопасность</CardTitle>
          <CardDescription>
            Смените пароль. Пароли хранятся в виде scrypt-хэша.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
