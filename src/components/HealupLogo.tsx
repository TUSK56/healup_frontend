"use client";

import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";

type HealupLogoProps = {
  href?: string;
  className?: string;
  textClassName?: string;
  iconClassName?: string;
  iconSize?: number;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

export default function HealupLogo({
  href,
  className,
  textClassName,
  iconClassName,
  iconSize = 14,
  onClick,
}: HealupLogoProps) {
  const content = (
    <span className={cn("inline-flex items-center gap-2 text-left", className)} dir="ltr">
      <span className={cn("text-[20px] font-extrabold leading-none text-[#1a56db]", textClassName)}>Healup</span>
      <span
        className={cn(
          "inline-flex h-[30px] w-[30px] items-center justify-center rounded-[8px] bg-[#1a56db] text-white",
          iconClassName
        )}
      >
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 3h6v3H9z" />
          <path d="M3 7h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z" />
          <line x1="12" y1="11" x2="12" y2="17" />
          <line x1="9" y1="14" x2="15" y2="14" />
        </svg>
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
