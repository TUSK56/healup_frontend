import type { HealupLocale } from "@/contexts/LocaleContext";
import { getMessages } from "@/i18n/getMessages";

export type TranslationKey = string;

function getValueByPath(source: Record<string, unknown>, path: string): string | undefined {
  const result = path.split(".").reduce<unknown>((acc, segment) => {
    if (!acc || typeof acc !== "object") return undefined;
    return (acc as Record<string, unknown>)[segment];
  }, source);

  return typeof result === "string" ? result : undefined;
}

export function translate(locale: HealupLocale, key: TranslationKey, fallback?: string): string {
  const messages = getMessages(locale);
  return getValueByPath(messages, key) ?? fallback ?? key;
}
