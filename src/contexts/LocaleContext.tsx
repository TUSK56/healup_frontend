"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { translate, type TranslationKey } from "@/i18n/messages";
import { AR_TO_EN_DICTIONARY, AR_WORD_TO_EN_DICTIONARY } from "@/lib/localeDictionary";

export type HealupLocale = "ar" | "en";

const STORAGE_KEY = "healup_locale";

type LocaleContextValue = {
  locale: HealupLocale;
  dir: "rtl" | "ltr";
  isRTL: boolean;
  setLocale: (next: HealupLocale) => void;
  toggleLocale: () => void;
  t: (key: TranslationKey, fallback?: string) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

const TRANSFORM_ATTRS = ["placeholder", "title", "aria-label", "alt"] as const;
const AR_TO_EN_ENTRIES = Object.entries(AR_TO_EN_DICTIONARY).sort((a, b) => b[0].length - a[0].length);
const AR_WORD_TO_EN_ENTRIES = Object.entries(AR_WORD_TO_EN_DICTIONARY).sort((a, b) => b[0].length - a[0].length);

function transformByEntries(input: string, entries: ReadonlyArray<readonly [string, string]>): string {
  let out = input;
  for (const [from, to] of entries) {
    if (!from) continue;
    if (out.includes(from)) out = out.split(from).join(to);
  }
  return out;
}

function transformTextForEnglish(input: string): string {
  let nextValue = transformByEntries(input, AR_TO_EN_ENTRIES);
  nextValue = transformByEntries(nextValue, AR_WORD_TO_EN_ENTRIES);
  return nextValue;
}

function applyEnglishLocaleTransform(root: ParentNode) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let current = walker.nextNode();
  while (current) {
    const textNode = current as Text;
    const original = textNode.nodeValue ?? "";
    if (original.trim()) {
      const nextValue = transformTextForEnglish(original);
      if (nextValue !== original) textNode.nodeValue = nextValue;
    }
    current = walker.nextNode();
  }

  if (!(root instanceof Element || root instanceof Document)) return;
  const elements = root.querySelectorAll("*");
  elements.forEach((el) => {
    TRANSFORM_ATTRS.forEach((attr) => {
      const raw = el.getAttribute(attr);
      if (!raw) return;
      const nextValue = transformTextForEnglish(raw);
      if (nextValue !== raw) el.setAttribute(attr, nextValue);
    });
  });
}

function readStoredLocale(): HealupLocale {
  if (typeof window === "undefined") return "ar";
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === "en" || raw === "ar") return raw;
  } catch {
    // ignore
  }
  return "ar";
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<HealupLocale>("ar");
  const isRTL = locale === "ar";
  const dir: LocaleContextValue["dir"] = isRTL ? "rtl" : "ltr";

  useEffect(() => {
    setLocaleState(readStoredLocale());
  }, []);

  const setLocale = useCallback((next: HealupLocale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === "ar" ? "en" : "ar");
  }, [locale, setLocale]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;

    if (locale !== "en") return;
    applyEnglishLocaleTransform(document.body);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            const textNode = node as Text;
            const original = textNode.nodeValue ?? "";
            const nextValue = transformTextForEnglish(original);
            if (nextValue !== original) textNode.nodeValue = nextValue;
            return;
          }
          if (node.nodeType === Node.ELEMENT_NODE) {
            applyEnglishLocaleTransform(node as Element);
          }
        });
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
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
