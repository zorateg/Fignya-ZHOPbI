"use client";

import * as React from "react";
import { BookOpen } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ElementType;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  title,
  description,
  icon = BookOpen,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  const Icon = icon;
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/12 bg-white/[0.02] px-6 py-16 text-center">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-plum/25 bg-brand-soft text-plum">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="mt-2 max-w-xs text-sm text-zinc-400">{description}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-6 inline-flex h-10 items-center rounded-xl bg-brand px-5 text-sm font-semibold text-white glow-cta"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
