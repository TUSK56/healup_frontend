"use client";

import React from "react";
import HealupLogo from "@/components/HealupLogo";
import { useLocale } from "@/contexts/LocaleContext";
import { cn } from "@/lib/utils";

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={cn("h-[18px] w-[18px] shrink-0 text-[#1a2e4a]", className)}
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

/**
 * Unified pre-auth top bar: Healup brand (same as landing) + language toggle.
 * Arabic: visual logo left / language right (row-reverse + [lang, logo]).
 * English: logo left / language right (row + [logo, lang]).
 */
export default function GuestTopNavbar({ className }: { className?: string }) {
  const { locale, toggleLocale } = useLocale();
  const isRtl = locale === "ar";

  const langControl = (
    <button
      type="button"
      onClick={toggleLocale}
      className={cn(
        "inline-flex cursor-pointer items-center gap-1.5 border-0 bg-transparent font-semibold text-[#1a2e4a]",
        "px-1 py-1 text-sm hover:opacity-90",
        isRtl ? "flex-row-reverse" : "flex-row"
      )}
    >
      {isRtl ? (
        <>
          English
          <GlobeIcon />
        </>
      ) : (
        <>
          <GlobeIcon />
          العربية
        </>
      )}
    </button>
  );

  return (
    <nav
      className={cn(
        "flex w-full items-center justify-between bg-white py-3.5 shadow-[0_1px_8px_rgba(0,0,0,0.07)]",
        "px-6 sm:px-10",
        isRtl ? "flex-row-reverse" : "flex-row",
        className
      )}
    >
      {isRtl ? (
        <>
          {langControl}
          <HealupLogo href="/" />
        </>
      ) : (
        <>
          <HealupLogo href="/" />
          {langControl}
        </>
      )}
    </nav>
  );
}
