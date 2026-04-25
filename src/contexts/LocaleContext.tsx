"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AR_TO_EN_DICTIONARY, AR_WORD_TO_EN_DICTIONARY } from "@/lib/localeDictionary";

export type HealupLocale = "ar" | "en";

const STORAGE_KEY = "healup_locale";

type LocaleContextValue = {
  locale: HealupLocale;
  setLocale: (next: HealupLocale) => void;
  toggleLocale: () => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

const TRANSFORM_ATTRS = ["placeholder", "title", "aria-label", "alt"] as const;
const AR_TO_EN_ENTRIES = Object.entries(AR_TO_EN_DICTIONARY).sort((a, b) => b[0].length - a[0].length);
const EN_TO_AR_ENTRIES = Object.entries(AR_TO_EN_DICTIONARY)
  .map(([ar, en]) => [en, ar] as const)
  .sort((a, b) => b[0].length - a[0].length);
const AR_WORD_TO_EN_ENTRIES = Object.entries(AR_WORD_TO_EN_DICTIONARY).sort((a, b) => b[0].length - a[0].length);
const EN_WORD_TO_AR_ENTRIES = Object.entries(AR_WORD_TO_EN_DICTIONARY)
  .map(([ar, en]) => [en, ar] as const)
  .sort((a, b) => b[0].length - a[0].length);

function transformByEntries(input: string, entries: ReadonlyArray<readonly [string, string]>): string {
  let out = input;
  for (const [from, to] of entries) {
    if (!from) continue;
    if (out.includes(from)) out = out.split(from).join(to);
  }
  return out;
}

function transformByWordFallback(input: string, locale: HealupLocale): string {
  const entries = locale === "en" ? AR_WORD_TO_EN_ENTRIES : EN_WORD_TO_AR_ENTRIES;
  const tokens = input.split(/(\s+|[.,!?;:(){}\[\]<>/\\|"'`~@#$%^&*\-_=+]+)/);
  return tokens
    .map((token) => {
      const trimmed = token.trim();
      if (!trimmed) return token;

      for (const [from, to] of entries) {
        if (trimmed === from) return token.replace(trimmed, to);
      }

      return token;
    })
    .join("");
}

function applyLocaleTransform(root: ParentNode, locale: HealupLocale) {
  const entries = locale === "en" ? AR_TO_EN_ENTRIES : EN_TO_AR_ENTRIES;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let current = walker.nextNode();
  while (current) {
    const textNode = current as Text;
    const original = textNode.nodeValue ?? "";
    if (original.trim()) {
      let nextValue = transformByEntries(original, entries);
      if (nextValue === original) {
        nextValue = transformByWordFallback(original, locale);
      }
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
      let nextValue = transformByEntries(raw, entries);
      if (nextValue === raw) {
        nextValue = transformByWordFallback(raw, locale);
      }
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

  useEffect(() => {
    setLocaleState(readStoredLocale());
  }, []);

  const setLocale = useCallback((next: HealupLocale) => {
    const current = locale;
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
    if (typeof window !== "undefined" && current !== next) {
      window.location.reload();
    }
  }, [locale]);

  const toggleLocale = useCallback(() => {
    setLocaleState((prev) => {
      const next: HealupLocale = prev === "ar" ? "en" : "ar";
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // ignore
      }
      if (typeof window !== "undefined") {
        window.location.reload();
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = locale === "ar" ? "ar" : "en";
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";

    // Global textual translation pass:
    // many legacy pages still contain hardcoded Arabic labels, so we transform visible text
    // on locale switch in both directions (ar <-> en).
    applyLocaleTransform(document.body, locale);

    if (locale !== "en") return;
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            const textNode = node as Text;
            const original = textNode.nodeValue ?? "";
            const nextValue = transformByEntries(original, AR_TO_EN_ENTRIES);
            if (nextValue !== original) textNode.nodeValue = nextValue;
            return;
          }

          if (node.nodeType === Node.ELEMENT_NODE) {
            applyLocaleTransform(node as Element, "en");
          }
        });
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      toggleLocale,
    }),
    [locale, setLocale, toggleLocale]
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
