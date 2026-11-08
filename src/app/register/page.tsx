import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Crown } from "lucide-react";
import RegisterForm from "./form";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-void px-5 py-12">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
      <div className="aura left-1/2 top-[-10rem] h-80 w-[34rem] -translate-x-1/2 bg-plum/25" />
      <div className="aura bottom-[-8rem] left-[-6rem] h-72 w-72 bg-fuchsia-glow/15" />

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
          <h1 className="text-2xl font-semibold text-white">Начать бесплатно</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Создайте аккаунт и получите доступ к коллекции фигни.
          </p>
          <div className="mt-6">
            <RegisterForm />
          </div>
          <p className="mt-6 border-t border-white/10 pt-5 text-center text-sm text-zinc-400">
            Уже есть аккаунт?{" "}
            <Link href="/login" className="font-medium text-fuchsia-300 hover:underline">
              Войти
            </Link>
          </p>
        </div>

        <p className="mt-5 text-center text-xs text-zinc-500">
          Регистрируясь, вы соглашаетесь с существованием фигни.
        </p>
      </div>
    </main>
  );
}
