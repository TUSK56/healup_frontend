"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { translate, type TranslationKey } from "@/i18n/messages";

export type HealupLocale = "ar" | "en";

const STORAGE_KEY = "healup_locale";

export function readStoredLocale(): HealupLocale {
  if (typeof window === "undefined") return "ar";
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === "en" || raw === "ar") return raw;
  } catch {
    // ignore
  }
  return "ar";
}

type LocaleContextValue = {
  locale: HealupLocale;
  dir: "rtl" | "ltr";
  isRTL: boolean;
  setLocale: (next: HealupLocale) => void;
  toggleLocale: () => void;
  t: (key: TranslationKey, fallback?: string) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function subscribeLocale(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) onStoreChange();
  };
  const onHealupLocale = () => onStoreChange();
  window.addEventListener("storage", onStorage);
  window.addEventListener("healup:locale", onHealupLocale);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("healup:locale", onHealupLocale);
  };
}

function getLocaleSnapshot(): HealupLocale {
  return readStoredLocale();
}

function getServerLocaleSnapshot(): HealupLocale {
  return "ar";
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(subscribeLocale, getLocaleSnapshot, getServerLocaleSnapshot);
  const isRTL = locale === "ar";
  const dir: LocaleContextValue["dir"] = isRTL ? "rtl" : "ltr";

  const setLocale = useCallback((next: HealupLocale) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
    window.dispatchEvent(new Event("healup:locale"));
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === "ar" ? "en" : "ar");
  }, [locale, setLocale]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  const value = useMemo(
    () => ({
      locale,
      dir,
      isRTL,
      setLocale,
      toggleLocale,
      t: (key: TranslationKey, fallback?: string) => translate(locale, key, fallback),
    }),
    [locale, dir, isRTL, setLocale, toggleLocale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}
