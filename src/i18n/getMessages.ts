import ar from "@/i18n/locales/ar.json";
import en from "@/i18n/locales/en.json";
import type { HealupLocale } from "@/contexts/LocaleContext";

const byLocale: Record<HealupLocale, Record<string, unknown>> = {
  ar,
  en,
};

export function getMessages(locale: HealupLocale): Record<string, unknown> {
  return byLocale[locale] ?? byLocale.ar;
}
