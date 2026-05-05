"use client";
import React, { useState } from "react";
import GuestTopNavbar from "@/components/landing/GuestTopNavbar";
import { authService, getAuthErrorMessage } from "@/services/authService";
import { useLocale } from "@/contexts/LocaleContext";
import HealupPasswordInput from "@/components/auth/HealupPasswordInput";

export default function PatientLogin() {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const tr = (ar: string, en: string) => (isAr ? ar : en);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(event?: React.FormEvent) {
    event?.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await authService.login({
        email,
        password,
        guard: "user",
      });
      authService.setSession(res, "user");
      // Force full reload so logged-in view uses the exact guest page styling baseline.
      window.location.assign("/patient-home");
    } catch (e: unknown) {
      setError(getAuthErrorMessage(e, tr("فشل تسجيل الدخول. تأكد من البيانات وحاول مرة أخرى.", "Login failed. Check your credentials and try again.")));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={{ fontFamily: 'Cairo, sans-serif', background: '#eef1f6', color: '#1a2e4a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }} dir={isAr ? "rtl" : "ltr"}>
        <GuestTopNavbar />
        {/* MAIN */}
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
          <form onSubmit={handleLogin} style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth: 480, boxShadow: '0 4px 28px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
            {/* Top Image */}
            <div style={{ padding: '20px 20px 0 20px' }}>
              <div style={{ width: '100%', height: 180, borderRadius: 12, overflow: 'hidden', position: 'relative', background: '#b8d4e8' }}>
                <img src="/images/patient_login.png" alt={tr("تسجيل دخول المريض", "Patient login")} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
            {/* Card Body */}
            <div style={{ padding: '30px 36px 34px' }}>
              <div style={{ textAlign: 'center', marginBottom: 26 }}>
                <h1 style={{ fontSize: 26, fontWeight: 900, color: '#1a2e4a', marginBottom: 7 }}>{tr("تسجيل الدخول", "Login")}</h1>
                <p style={{ fontSize: 13.5, color: '#9aa3b0', fontWeight: 400, direction: isAr ? "rtl" : "ltr" }}>{tr("مرحباً بك مجدداً في ", "Welcome back to ")}<span style={{ color: '#2356c8', fontWeight: 700 }}>Healup</span>{tr(". يرجى إدخال بياناتك.", ". Please enter your details.")}</p>
              </div>
              {/* Email / Phone */}
              <div style={{ marginBottom: 18 }}>
                <span style={{ display: 'block', textAlign: isAr ? "right" : "left", marginBottom: 8, fontSize: 13, fontWeight: 700, color: '#1a2e4a' }}>{tr("البريد الالكتروني أو رقم الهاتف", "Email or phone number")}</span>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={email}
                    onChange={(ev) => setEmail(ev.target.value)}
                    placeholder="example@mail.com"
                    style={{ width: '100%', padding: isAr ? "13px 16px 13px 46px" : "13px 46px 13px 16px", border: '1.5px solid #dde3ed', borderRadius: 10, fontFamily: 'Cairo, sans-serif', fontSize: 14, color: '#1a2e4a', background: '#fff', outline: 'none', textAlign: isAr ? "right" : "left", direction: isAr ? "rtl" : "ltr", transition: 'border-color 0.2s' }}
                  />
                  <span style={{ position: 'absolute', [isAr ? "left" : "right"]: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                    <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: '#9aa3b0' }}><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                  </span>
                </div>
              </div>
              {/* Password */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: "#1a2e4a", flex: 1, textAlign: isAr ? "right" : "left" }}>{tr("كلمة المرور", "Password")}</span>
                  <a href="/forgot-password" style={{ fontSize: 12, fontWeight: 700, color: "#2356c8", textDecoration: "none", flexShrink: 0 }}>
                    {tr("نسيت كلمة المرور؟", "Forgot password?")}
                  </a>
                </div>
                <HealupPasswordInput
                  value={password}
                  onChange={setPassword}
                  showPassword={showPassword}
                  onToggleShow={() => setShowPassword((v) => !v)}
                  autoComplete="current-password"
                  rtl={isAr}
                  inputStyle={{ fontSize: 14 }}
                />
              </div>
              {/* Remember me */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, marginBottom: 22, direction: 'ltr' }}>
                <label htmlFor="remember" style={{ fontSize: 13, color: '#1a2e4a', fontWeight: 500, cursor: 'pointer', order: 1, direction: isAr ? "rtl" : "ltr" }}>{tr("تذكرني على هذا الجهاز", "Remember me on this device")}</label>
                <input type="checkbox" id="remember" style={{ width: 16, height: 16, accentColor: '#2356c8', cursor: 'pointer', flexShrink: 0, order: 2 }} />
              </div>
              {error ? (
                <div style={{ marginBottom: 14, fontSize: 13, fontWeight: 600, color: "#b91c1c", textAlign: "right" }}>
                  {error}
                </div>
              ) : null}
              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{ width: '100%', padding: 16, background: isSubmitting ? '#6b88de' : '#2356c8', color: 'white', border: 'none', borderRadius: 12, fontFamily: 'Cairo, sans-serif', fontSize: 17, fontWeight: 800, cursor: isSubmitting ? 'not-allowed' : 'pointer', transition: 'background 0.2s, transform 0.15s', marginBottom: 22 }}
              >
                {isSubmitting ? tr("جاري تسجيل الدخول...", "Logging in...") : tr("تسجيل الدخول", "Login")}
              </button>
              <button
                type="button"
                onClick={() => {
                  authService.setGuestSession();
                  window.location.replace("/patient-home");
                }}
                style={{ width: '100%', padding: 14, background: '#eef4ff', color: '#2356c8', border: '1px solid #cfe0ff', borderRadius: 12, fontFamily: 'Cairo, sans-serif', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 14 }}
              >
                {tr("الدخول كضيف", "Continue as guest")}
              </button>
              {/* Register link */}
              <div style={{ textAlign: 'center', fontSize: 13.5, color: '#9aa3b0', fontWeight: 500 }}>
                {tr("ليس لديك حساب؟ ", "Don't have an account? ")}<a href="/signup" style={{ color: '#2356c8', fontWeight: 700, textDecoration: 'none' }}>{tr("إنشاء حساب جديد", "Create new account")}</a>
              </div>
            </div>
          </form>
        </main>
        {/* FOOTER */}
        <footer style={{ textAlign: 'center', padding: 18, fontSize: 12.5, color: '#9aa3b0', fontWeight: 500, direction: isAr ? "rtl" : "ltr" }}>
          © 2024 Healup. {tr("جميع الحقوق محفوظة للنظام الطبي المتكامل.", "All rights reserved for the integrated medical system.")}
        </footer>
    </div>
  );
}
