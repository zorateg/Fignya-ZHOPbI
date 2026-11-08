"use client";

import * as React from "react";
import Link from "next/link";
import { Crown, Menu, X, ArrowRight } from "lucide-react";

const links = [
  { href: "#features", label: "Возможности" },
  { href: "#product", label: "Продукт" },
  { href: "#pricing", label: "Тарифы" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader({ isAuthed }: { isAuthed: boolean }) {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-void/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white glow-cta">
            <Crown className="h-5 w-5" />
          </span>
          <span className="leading-none">
            <span className="block text-[15px] font-semibold text-white">
              Жора Крутой
            </span>
            <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.28em] text-plum">
              Premium
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-zinc-300 transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href={isAuthed ? "/dashboard" : "/login"}
            className="text-sm text-zinc-300 transition-colors hover:text-white"
          >
            {isAuthed ? "Дашборд" : "Войти"}
          </Link>
          <Link
            href={isAuthed ? "/dashboard/nonsense/new" : "/register"}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-white glow-cta transition hover:brightness-110"
          >
            {isAuthed ? "Добавить фигню" : "Начать бесплатно"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <button
          className="rounded-lg border border-white/10 p-2 text-zinc-300 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Открыть меню"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-abyss px-5 pb-5 pt-2 md:hidden">
          <nav className="flex flex-col">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-white/[0.06] py-3 text-sm text-zinc-300"
              >
                {l.label}
              </a>
            ))}
            <Link
              href={isAuthed ? "/dashboard" : "/login"}
              className="py-3 text-sm text-zinc-300"
            >
              {isAuthed ? "Дашборд" : "Войти"}
            </Link>
          </nav>
          <Link
            href={isAuthed ? "/dashboard/nonsense/new" : "/register"}
            className="mt-3 flex h-11 items-center justify-center gap-2 rounded-xl bg-brand text-sm font-semibold text-white glow-cta"
          >
            {isAuthed ? "Добавить фигню" : "Начать бесплатно"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </header>
  );
}
