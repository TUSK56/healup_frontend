"use client";

import { useI18n } from "@/i18n/I18nContext";
import type { Locale } from "@/i18n/messages";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  compact?: boolean;
};

export default function LanguageSwitcher({ className, compact }: Props) {
  const { locale, setLocale, t } = useI18n();

  const btn = (code: Locale, label: string) => (
    <button
      key={code}
      type="button"
      onClick={() => setLocale(code)}
      className={cn(
        compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        "rounded-md font-semibold transition",
        locale === code
          ? "bg-[#0055B3] text-white shadow-sm"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
      )}
      aria-pressed={locale === code}
      aria-label={label}
    >
      {compact ? (code === "en" ? "EN" : "ع") : label}
    </button>
  );

  return (
    <div
      className={cn("inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-0.5", className)}
      role="group"
      aria-label={t("language.switch")}
    >
      {btn("en", t("language.en"))}
      {btn("ar", t("language.ar"))}
    </div>
  );
}
