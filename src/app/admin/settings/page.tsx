"use client";

import React from "react";
import { motion } from "motion/react";
import { CheckCircle2, FileText, Save, Shield, type LucideIcon } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

export default function AdminSettingsPage() {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const t = (ar: string, en: string) => (isAr ? ar : en);

  const [siteName, setSiteName] = React.useState("Healup");
  const [supportEmail, setSupportEmail] = React.useState("support@healup.test");
  const [saved, setSaved] = React.useState(false);

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-w-0 flex-1 bg-[#F8FAFC] p-4 sm:p-8" dir={isAr ? "rtl" : "ltr"}>
      <main className="mx-auto max-w-5xl pb-16">
        <div className="relative mb-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-36 w-full bg-gradient-to-r from-[#1a2e4a] to-[#2356c8] sm:h-40" />

          <div className="flex flex-col items-center gap-5 px-6 pb-8 pt-0 sm:flex-row sm:items-end sm:px-8">
            <div className="relative -mt-14 shrink-0">
              <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-slate-100 bg-white p-1.5 shadow-xl sm:h-32 sm:w-32">
                <div className="flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-b from-slate-100 to-slate-200 text-4xl">
                  ⚙️
                </div>
              </div>
            </div>
            <div className={`mb-1 w-full flex-1 text-center sm:mb-3 sm:text-start ${isAr ? "sm:text-right" : "sm:text-left"}`}>
              <h1 className="text-2xl font-bold text-slate-900">
                {t("إعدادات النظام", "System settings")}
              </h1>
              <div className="mt-1 flex items-center justify-center gap-1 text-sm text-slate-500 sm:justify-start">
                <CheckCircle2 size={14} className="shrink-0 text-slate-400" />
                <span>{t("لوحة تحكم الإدارة — بدون بيانات موقع أو هاتف", "Admin console — no map or phone fields")}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <InfoCard title={t("إعدادات المنصة", "Platform")} icon={FileText} isAr={isAr}>
              <form className="space-y-4" onSubmit={onSave}>
                <InputField
                  label={t("اسم المنصة", "Platform name")}
                  value={siteName}
                  onChange={setSiteName}
                  isAr={isAr}
                />
                <InputField
                  label={t("بريد الدعم", "Support email")}
                  type="email"
                  value={supportEmail}
                  onChange={setSupportEmail}
                  dir="ltr"
                  isAr={isAr}
                />
                <div className={`flex flex-wrap items-center gap-3 pt-2 ${isAr ? "flex-row-reverse" : "flex-row"}`}>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1a4b9c] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-900/15 transition hover:bg-blue-800"
                  >
                    <Save size={18} />
                    {t("حفظ التغييرات", "Save changes")}
                  </button>
                  {saved ? (
                    <span className="text-sm font-semibold text-green-600">
                      {t("تم حفظ الإعدادات بنجاح.", "Settings saved.")}
                    </span>
                  ) : null}
                </div>
              </form>
            </InfoCard>
          </div>

          <div>
            <InfoCard title={t("الأمان والامتثال", "Security")} icon={Shield} isAr={isAr}>
              <p className={`text-sm leading-relaxed text-slate-500 ${isAr ? "text-right" : "text-left"}`}>
                {t(
                  "يُنصح بمراجعة سياسات الوصول بشكل دوري، واستخدام كلمات مرور قوية لحسابات الإدارة فقط.",
                  "Review access policies regularly and use strong passwords for admin accounts only."
                )}
              </p>
            </InfoCard>
          </div>
        </div>
      </main>
    </div>
  );
}

function InfoCard({
  title,
  icon: Icon,
  children,
  isAr,
}: {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  isAr: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-blue-50 p-2 text-[#1a4b9c]">
          <Icon size={20} />
        </div>
        <h2 className="text-lg font-bold text-slate-800">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </motion.div>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  dir,
  isAr,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  dir?: "rtl" | "ltr";
  isAr: boolean;
}) {
  const inputDir = dir ?? (isAr ? "rtl" : "ltr");
  return (
    <div className={`space-y-1.5 ${isAr ? "text-right" : "text-left"}`}>
      <label className="text-sm font-medium text-slate-500">{label}</label>
      <input
        type={type}
        value={value}
        dir={inputDir}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      />
    </div>
  );
}
