"use client";
import React, { useState } from "react";
import GuestTopNavbar from "@/components/landing/GuestTopNavbar";
import { authService, getAuthErrorMessage } from "@/services/authService";

export default function PatientLogin() {
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
      setError(getAuthErrorMessage(e, "فشل تسجيل الدخول. تأكد من البيانات وحاول مرة أخرى."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={{ fontFamily: 'Cairo, sans-serif', background: '#eef1f6', color: '#1a2e4a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <GuestTopNavbar />
        {/* MAIN */}
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
          <form onSubmit={handleLogin} style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth: 480, boxShadow: '0 4px 28px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
            {/* Top Image */}
            <div style={{ padding: '20px 20px 0 20px' }}>
              <div style={{ width: '100%', height: 180, borderRadius: 12, overflow: 'hidden', position: 'relative', background: '#b8d4e8' }}>
                <img src="/images/patient_login.png" alt="تسجيل دخول المريض" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
            {/* Card Body */}
            <div style={{ padding: '30px 36px 34px' }}>
              <div style={{ textAlign: 'center', marginBottom: 26 }}>
                <h1 style={{ fontSize: 26, fontWeight: 900, color: '#1a2e4a', marginBottom: 7 }}>تسجيل الدخول</h1>
                <p style={{ fontSize: 13.5, color: '#9aa3b0', fontWeight: 400, direction: 'rtl' }}>مرحباً بك مجدداً في <span style={{ color: '#2356c8', fontWeight: 700 }}>Healup</span>. يرجى إدخال بياناتك.</p>
              </div>
              {/* Email / Phone */}
              <div style={{ marginBottom: 18 }}>
                <span style={{ display: 'block', textAlign: 'right', marginBottom: 8, fontSize: 13, fontWeight: 700, color: '#1a2e4a' }}>البريد الالكتروني أو رقم الهاتف</span>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={email}
                    onChange={(ev) => setEmail(ev.target.value)}
                    placeholder="example@mail.com"
                    style={{ width: '100%', padding: '13px 16px 13px 46px', border: '1.5px solid #dde3ed', borderRadius: 10, fontFamily: 'Cairo, sans-serif', fontSize: 14, color: '#1a2e4a', background: '#fff', outline: 'none', textAlign: 'right', direction: 'rtl', transition: 'border-color 0.2s' }}
                  />
                  <span style={{ position: 'absolute', left: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                    <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: '#9aa3b0' }}><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                  </span>
                </div>
              </div>
              {/* Password */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#1a2e4a' }}>كلمة المرور</span>
                  <a href="/forgot-password" style={{ fontSize: 12.5, fontWeight: 600, color: '#2356c8', textDecoration: 'none', cursor: 'pointer' }}>نسيت كلمة المرور؟</a>
                </div>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(ev) => setPassword(ev.target.value)}
                    placeholder="••••••••"
                    style={{ width: '100%', padding: '13px 16px 13px 46px', border: '1.5px solid #dde3ed', borderRadius: 10, fontFamily: 'Cairo, sans-serif', fontSize: 14, color: '#1a2e4a', background: '#fff', outline: 'none', textAlign: 'right', direction: 'rtl', transition: 'border-color 0.2s' }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', left: 14, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: '#9aa3b0' }}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"/></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: '#9aa3b0' }}><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                    )}
                  </button>
                </div>
              </div>
              {/* Remember me */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, marginBottom: 22, direction: 'ltr' }}>
                <label htmlFor="remember" style={{ fontSize: 13, color: '#1a2e4a', fontWeight: 500, cursor: 'pointer', order: 1, direction: 'rtl' }}>تذكرني على هذا الجهاز</label>
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
                {isSubmitting ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </button>
              <button
                type="button"
                onClick={() => {
                  authService.setGuestSession();
                  window.location.assign("/patient-home");
                }}
                style={{ width: '100%', padding: 14, background: '#eef4ff', color: '#2356c8', border: '1px solid #cfe0ff', borderRadius: 12, fontFamily: 'Cairo, sans-serif', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 14 }}
              >
                الدخول كضيف
              </button>
              {/* Register link */}
              <div style={{ textAlign: 'center', fontSize: 13.5, color: '#9aa3b0', fontWeight: 500 }}>
                ليس لديك حساب؟ <a href="/signup" style={{ color: '#2356c8', fontWeight: 700, textDecoration: 'none' }}>إنشاء حساب جديد</a>
              </div>
            </div>
          </form>
        </main>
        {/* FOOTER */}
        <footer style={{ textAlign: 'center', padding: 18, fontSize: 12.5, color: '#9aa3b0', fontWeight: 500, direction: 'ltr' }}>
          © 2024 Healup. جميع الحقوق محفوظة للنظام الطبي المتكامل.
        </footer>
    </div>
  );
}
