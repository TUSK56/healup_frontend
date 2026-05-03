import ar from "@/locales/ar.json";
import enJson from "@/locales/en.json";

export type Locale = "en" | "ar";

export type Messages = typeof enJson;

export const messages: Record<Locale, Messages> = {
  en: enJson,
  ar: ar as Messages,
};

export const STORAGE_KEY = "healup-locale";

export function getNested(obj: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split(".");
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur === null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return typeof cur === "string" ? cur : undefined;
}
