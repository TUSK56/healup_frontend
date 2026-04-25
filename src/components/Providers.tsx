"use client";

import React, { useMemo } from "react";
import { NextIntlClientProvider } from "next-intl";
import { LocaleProvider, useLocale } from "@/contexts/LocaleContext";
import { getMessages } from "@/i18n/getMessages";

function IntlBridge({ children }: { children: React.ReactNode }) {
  const { locale } = useLocale();
  const messages = useMemo(() => getMessages(locale), [locale]);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <IntlBridge>{children}</IntlBridge>
    </LocaleProvider>
  );
}
