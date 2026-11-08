"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg";
  href?: string;
  asChild?: boolean;
}

function Button({
  className,
  variant = "default",
  size = "default",
  href,
  asChild = false,
  ...props
}: ButtonProps) {
  const isLink = Boolean(asChild || href);

  const variants = {
    default:
      "bg-brand text-white glow-cta hover:brightness-110 border border-white/10",
    destructive:
      "border border-red-400/30 bg-red-500/15 text-red-200 hover:bg-red-500/25",
    outline:
      "border border-white/12 bg-white/[0.04] text-zinc-100 hover:bg-white/[0.08]",
    ghost: "text-zinc-300 hover:bg-white/[0.06] hover:text-white",
    link: "text-fuchsia-300 underline-offset-4 hover:underline",
  };

  const sizes = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-8 px-3 text-xs",
    lg: "h-12 px-7 text-base",
  };

  const base = cn(
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-void disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );

  if (isLink) {
    return (
      <Link href={href ?? "/"} className={base} {...(props as any)} />
    );
  }

  return <button className={base} {...props} />;
}

Button.displayName = "Button";

export default Button;
