"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  Crown,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
};

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Дашборд", icon: LayoutDashboard },
  { href: "/dashboard/nonsense", label: "Фигня", icon: FileText },
  { href: "/dashboard/settings", label: "Настройки", icon: Settings },
];

export function Sidebar({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col border-r border-white/[0.08] bg-abyss",
        className,
      )}
      aria-label="Основная навигация"
    >
      <Link
        href="/"
        className="flex h-[72px] items-center gap-3 border-b border-white/[0.08] px-5"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white glow-cta">
          <Crown className="h-4 w-4" />
        </span>
        <span className="leading-none">
          <span className="block text-sm font-semibold text-white">Жора Крутой</span>
          <span className="mt-1 block text-[9px] uppercase tracking-[0.28em] text-plum">
            Premium
          </span>
        </span>
      </Link>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3 scrollbar-thin">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "border border-plum/30 bg-brand-soft text-white"
                  : "border border-transparent text-zinc-400 hover:bg-white/[0.05] hover:text-white",
              )}
            >
              <Icon className={cn("h-[18px] w-[18px]", isActive && "text-fuchsia-300")} />
              {item.label}
            </Link>
          );
        })}

        <div className="!mt-6 rounded-xl border border-white/10 bg-brand-soft p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            Подборка Жоры
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-zinc-400">
            Добавьте фигню в избранное, и Жора лично оценит её величие.
          </p>
          <Link
            href="/dashboard/nonsense/new"
            onClick={onNavigate}
            className="mt-3 inline-flex h-8 w-full items-center justify-center rounded-lg bg-brand text-[11px] font-semibold text-white glow-cta"
          >
            + Добавить фигню
          </Link>
        </div>
      </nav>

      <div className="border-t border-white/[0.08] p-3">
        <button
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
          onClick={() => {
            document.cookie = "session=; Path=/; Max-Age=0; SameSite=Lax";
            window.location.href = "/login";
          }}
        >
          <LogOut className="h-[18px] w-[18px]" />
          Выйти
        </button>
      </div>
    </aside>
  );
}
