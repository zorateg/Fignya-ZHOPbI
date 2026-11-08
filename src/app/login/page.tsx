import { db } from "@/db";
import { users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Crown } from "lucide-react";
import LoginForm from "./form";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  const seedUser = await db.select({ email: users.email }).from(users).limit(1);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-void px-5 py-12">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
      <div className="aura left-1/2 top-[-10rem] h-80 w-[34rem] -translate-x-1/2 bg-plum/25" />
      <div className="aura bottom-[-8rem] right-[-6rem] h-72 w-72 bg-ember/15" />

      <div className="relative w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white glow-cta">
            <Crown className="h-5 w-5" />
          </span>
          <span className="leading-none">
            <span className="block text-[15px] font-semibold text-white">Жора Крутой</span>
            <span className="mt-1 block text-[10px] uppercase tracking-[0.28em] text-plum">
              Premium
            </span>
          </span>
        </Link>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl glow-plum">
          <h1 className="text-2xl font-semibold text-white">С возвращением</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Войдите, чтобы продолжить коллекционировать фигню.
          </p>
          <div className="mt-6">
            <LoginForm seedEmail={seedUser[0]?.email ?? null} />
          </div>
          <p className="mt-6 border-t border-white/10 pt-5 text-center text-sm text-zinc-400">
            Нет аккаунта?{" "}
            <Link href="/register" className="font-medium text-fuchsia-300 hover:underline">
              Создать бесплатно
            </Link>
          </p>
        </div>

        <p className="mt-5 text-center text-xs text-zinc-500">
          Демо: zhora@fignya.ru · пароль parol123
        </p>
      </div>
    </main>
  );
}
