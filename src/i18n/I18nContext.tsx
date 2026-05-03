"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { STORAGE_KEY, getNested, messages, type Locale } from "./messages";

export type TParams = Record<string, string | number>;

function interpolate(template: string, params?: TParams): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    params[key] !== undefined ? String(params[key]) : `{${key}}`
  );
}

type I18nValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, params?: TParams) => string;
  dir: "ltr" | "rtl";
};

const I18nContext = createContext<I18nValue | null>(null);

function readStoredLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === "ar" ? "ar" : "en";
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const next = readStoredLocale();
    setLocaleState(next);
    document.documentElement.lang = next;
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, l);
      document.documentElement.lang = l;
      document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
    }
  }, []);

  const t = useCallback(
    (key: string, params?: TParams) => {
      const dict = messages[locale] as unknown as Record<string, unknown>;
      const raw = getNested(dict, key) ?? key;
      return interpolate(raw, params);
    },
    [locale]
  );

  const value = useMemo<I18nValue>(
    () => ({
      locale,
      setLocale,
      t,
      dir: locale === "ar" ? "rtl" : "ltr",
    }),
    [locale, setLocale, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}
