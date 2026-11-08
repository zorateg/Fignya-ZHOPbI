"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, Search, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar({
  className,
  user,
  onMenu,
}: {
  className?: string;
  user: { name: string; email: string; role: string };
  onMenu?: () => void;
}) {
  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-[72px] items-center justify-between gap-4 border-b border-white/[0.08] bg-void/80 px-4 backdrop-blur-xl sm:px-6",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onMenu}
          className="rounded-lg border border-white/10 p-2 text-zinc-400 transition hover:text-white lg:hidden"
          aria-label="Открыть навигацию"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 md:flex">
          <Search className="h-4 w-4 text-zinc-500" />
          <span className="text-xs text-zinc-500">
            Поиск по фигне…
          </span>
          <kbd className="ml-6 rounded border border-white/10 bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-zinc-500">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/dashboard/nonsense/new"
          className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-brand px-3 text-xs font-semibold text-white glow-cta transition hover:brightness-110 sm:px-4 sm:text-sm"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Добавить</span>
        </Link>
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] py-1 pl-1 pr-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-[11px] font-bold text-white">
            {initials || "Ж"}
          </span>
          <div className="hidden leading-tight sm:block">
            <div className="max-w-[120px] truncate text-xs font-medium text-white">
              {user.name}
            </div>
            <div className="text-[10px] text-zinc-500">
              {user.role === "admin" ? "Premium" : "Старт"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
