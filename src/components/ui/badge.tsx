"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "gradient" | "outline";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors",
        variant === "default" && "border border-white/12 bg-white/[0.06] text-zinc-200",
        variant === "outline" && "border border-white/15 bg-transparent text-zinc-300",
        variant === "gradient" && "bg-brand text-white",
        className,
      )}
      {...props}
    />
  );
}

Badge.displayName = "Badge";

export default Badge;
