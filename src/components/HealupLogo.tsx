"use client";

import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";

type HealupLogoProps = {
  href?: string;
  className?: string;
  /** Smaller lockup for sidebars / tight spaces */
  compact?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

function PillIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 3h6v3H9z" />
      <path d="M3 7h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z" />
      <line x1="12" y1="11" x2="12" y2="17" />
      <line x1="9" y1="14" x2="15" y2="14" />
    </svg>
  );
}

/** Landing-style lockup: pill icon + هيل أب + Healup (matches `/` marketing header). */
export default function HealupLogo({ href, className, compact = false, onClick }: HealupLogoProps) {
  const box = compact ? "h-8 w-8 rounded-lg" : "h-[42px] w-[42px] rounded-[10px]";
  const iconPx = compact ? 14 : 18;
  const titleClass = compact ? "text-base font-black leading-none" : "text-[20px] font-black leading-none";

  const content = (
    <span className={cn("inline-flex items-center gap-3 text-inherit no-underline", className)} dir="rtl">
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center bg-[#2356c8] text-white",
          box
        )}
      >
        <PillIcon size={iconPx} />
      </span>
      <span className={cn("text-[#1a2e4a]", titleClass)}>
        هيل أب <span className="text-[#2356c8]">Healup</span>
      </span>
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} onClick={onClick} className="inline-flex items-center text-inherit no-underline">
      {content}
    </Link>
  );
}
