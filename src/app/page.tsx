"use client";

import React from "react";
import GuestTopNavbar from "@/components/landing/GuestTopNavbar";
import { useLocale } from "@/contexts/LocaleContext";

export default function HomePage() {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const t = (ar: string, en: string) => (isAr ? ar : en);

  return (
    <div
      className="flex min-h-screen flex-col bg-[#f0f4f7] text-[#1a2e4a]"
      dir={isAr ? "rtl" : "ltr"}
    >
      <GuestTopNavbar />

      <section className="px-5 py-10 text-center sm:py-14">
        <h1 className="mb-3 text-3xl font-black leading-snug text-[#1a2e4a] sm:text-[38px]">
          {t("مرحباً بك في هيل أب - اختر نوع حسابك", "Welcome to Healup — choose your account type")}
        </h1>
        <p className="mx-auto max-w-2xl text-[15px] font-normal text-[#6b7a8d]">
          {t(
            "بوابتك الذكية لإدارة الدواء والرعاية الصحية. اختر المسار المناسب لبدء الاستخدام.",
            "Your smart gateway for medication and healthcare. Pick a path to get started."
          )}
        </p>
      </section>

      <div className="mx-auto flex flex-wrap justify-center gap-8 px-5 pb-14 sm:gap-10 sm:px-10">
        {/* Patient */}
        <div className="mb-5 flex w-full max-w-[440px] flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.10)] sm:mb-0">
          <div className="relative flex h-[260px] w-full items-center justify-center bg-[#b3d4e8]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/patient.png"
              alt=""
              className="absolute inset-0 z-0 h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 z-[1] bg-[rgba(36,104,180,0.32)]" />
            <div className="absolute bottom-3.5 end-3.5 z-[1] flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.18)]">
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="#1a4a8a">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            </div>
          </div>
          <div className="flex flex-1 flex-col px-5 pb-6 pt-6">
            <div className={`mb-2.5 text-lg font-extrabold ${isAr ? "text-right" : "text-left"}`}>
              {t("تسجيل دخول المريض", "Patient login")}
            </div>
            <p className={`mb-5 flex-1 text-[13.5px] leading-relaxed text-[#6b7a8d] ${isAr ? "text-right" : "text-left"}`}>
              {t(
                "للباحثين عن الدواء، إدارة الطلبات الشخصية، ومتابعة السجلات الصحية بكل سهولة وخصوصية.",
                "For people looking for medicine, managing personal orders, and following health records with ease and privacy."
              )}
            </p>
            <a
              href="/patient-login"
              className={`flex w-full items-center justify-center gap-2.5 rounded-xl border-0 bg-[#1a4a8a] py-3.5 text-[15px] font-bold text-white no-underline ${isAr ? "flex-row" : "flex-row-reverse"}`}
            >
              {t("دخول المريض", "Enter as patient")}
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0 fill-white">
                <path d="M4 12l8-8v5h8v6h-8v5l-8-8z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Pharmacy */}
        <div className="mb-5 flex w-full max-w-[440px] flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.10)] sm:mb-0">
          <div className="relative flex h-[260px] w-full items-center justify-center bg-[#80cbc4]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/pharmcy.png"
              alt=""
              className="absolute inset-0 z-0 h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 z-[1] bg-[rgba(39,174,96,0.22)]" />
            <div className="absolute bottom-3.5 end-3.5 z-[1] flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.18)]">
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="#27ae60">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 9h-4v4h-2v-4H7v-2h4V6h2v4h4v2z" />
              </svg>
            </div>
          </div>
          <div className="flex flex-1 flex-col px-5 pb-6 pt-6">
            <div className={`mb-2.5 text-lg font-extrabold ${isAr ? "text-right" : "text-left"}`}>
              {t("تسجيل دخول الصيدلية", "Pharmacy login")}
            </div>
            <p className={`mb-5 flex-1 text-[13.5px] leading-relaxed text-[#6b7a8d] ${isAr ? "text-right" : "text-left"}`}>
              {t(
                "لأصحاب الصيدليات لإدارة المخزون، استقبال الطلبات الواردة، وتوسيع نطاق خدماتكم الرقمية.",
                "For pharmacy owners to manage stock, receive incoming orders, and grow your digital services."
              )}
            </p>
            <a
              href="/pharmacy-login"
              className={`flex w-full items-center justify-center gap-2.5 rounded-xl border-0 bg-[#27ae60] py-3.5 text-[15px] font-bold text-white no-underline ${isAr ? "flex-row" : "flex-row-reverse"}`}
            >
              {t("دخول الصيدلية", "Enter as pharmacy")}
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0 fill-white">
                <path d="M4 12l8-8v5h8v6h-8v5l-8-8z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Admin */}
        <div className="mb-5 flex w-full max-w-[440px] flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.10)] sm:mb-0">
          <div className="relative flex h-[260px] w-full items-center justify-center bg-[#607d8b]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/admin.png"
              alt=""
              className="absolute inset-0 z-0 h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 z-[1] bg-[rgba(30,40,60,0.32)]" />
            <div className="absolute bottom-3.5 end-3.5 z-[1] flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.18)]">
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="#1a2e4a">
                <path d="M12 2L4 5v6c0 5.25 3.4 10.15 8 11.35C16.6 21.15 20 16.25 20 11V5l-8-3z" />
              </svg>
            </div>
          </div>
          <div className="flex flex-1 flex-col px-5 pb-6 pt-6">
            <div className={`mb-2.5 text-lg font-extrabold ${isAr ? "text-right" : "text-left"}`}>
              {t("تسجيل دخول الإدارة", "Admin login")}
            </div>
            <p className={`mb-5 flex-1 text-[13.5px] leading-relaxed text-[#6b7a8d] ${isAr ? "text-right" : "text-left"}`}>
              {t(
                "لوحة التحكم الكاملة لمشرفي النظام لمراقبة الأداء، إدارة المستخدمين، وضمان جودة الخدمة.",
                "The full dashboard for system supervisors to monitor performance, manage users, and ensure service quality."
              )}
            </p>
            <a
              href="/admin-login"
              className={`flex w-full items-center justify-center gap-2.5 rounded-xl border-0 bg-[#1a2e4a] py-3.5 text-[15px] font-bold text-white no-underline ${isAr ? "flex-row" : "flex-row-reverse"}`}
            >
              {t("دخول الإدارة", "Enter as admin")}
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0 fill-white">
                <path d="M4 12l8-8v5h8v6h-8v5l-8-8z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <footer className="mt-auto border-t border-[#e8edf2] bg-white px-6 py-4 text-center sm:px-10">
        <div className="mb-3 flex flex-wrap items-center justify-center gap-6 sm:gap-8">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-[#1a2e4a]">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e0f4f4]">
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#1a8a8a" strokeWidth={3}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            {t("أمن ومحمي 100%", "100% secure")}
          </div>
          <div className="flex items-center gap-2 text-[13px] font-semibold text-[#1a2e4a]">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e0f4f4]">
              <svg width={16} height={16} viewBox="0 0 24 24" fill="#1a8a8a">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5c-2.49-1.24-4-3.53-4-6.5h2c0 2 1.01 3.75 2.5 4.77L8 14.5zm1.5-5.5c-.83 0-1.5-.67-1.5-1.5S10.67 8 11.5 8s1.5.67 1.5 1.5S12.33 9 11.5 9zm3 5.5l-2.5-.23C13.49 13.25 14.5 11.5 14.5 9.5h2c0 2.97-1.51 5.26-4 6.5zm-1-5.5c-.83 0-1.5-.67-1.5-1.5S12.67 8 13.5 8s1.5.67 1.5 1.5S14.33 9 13.5 9z" />
              </svg>
            </span>
            {t("دعم فني على مدار الساعة", "24/7 support")}
          </div>
        </div>
        <p className="text-xs text-[#6b7a8d]">
          {isAr ? (
            <>
              © 2024 هيل أب (<span className="text-[#1a8a8a]">Healup</span>). جميع الحقوق محفوظة للرعاية الصحية الذكية.
            </>
          ) : (
            <>© 2024 Healup. All rights reserved for smart healthcare.</>
          )}
        </p>
      </footer>
    </div>
  );
}
