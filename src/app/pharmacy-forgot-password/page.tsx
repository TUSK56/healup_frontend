"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function PharmacyForgotPasswordPage() {
  const router = useRouter();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/pharmacy-verify-otp");
  };
  return (
    <html lang="ar" dir="rtl">
      <head>
        <title>نسيت كلمة المرور - Healup</title>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={{ fontFamily: 'Cairo, sans-serif', background: '#eef0f5', color: '#1a2e4a', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 20, padding: '44px 48px 40px', width: '100%', maxWidth: 460, boxShadow: '0 6px 32px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 28, direction: 'ltr' }}>
            <div style={{ width: 42, height: 42, background: '#2356c8', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 3h6v3H9z" />
                <path d="M3 7h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z" />
                <line x1="12" y1="11" x2="12" y2="17" />
                <line x1="9" y1="14" x2="15" y2="14" />
              </svg>
            </div>
            <span style={{ fontSize: 24, fontWeight: 900, color: '#2356c8', letterSpacing: -0.5 }}>Healup</span>
          </div>
          {/* Heading */}
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#1a2e4a', marginBottom: 14, lineHeight: 1.4 }}>نسيت كلمة المرور؟</h1>
          <p style={{ fontSize: 13.5, color: '#9aa3b0', fontWeight: 400, lineHeight: 1.9, marginBottom: 28, direction: 'rtl' }}>
            لا تقلق. أدخل بريدك الإلكتروني أو رقم هاتفك وسنرسل لك رابطاً<br />
            لإعادة تعيين كلمة المرور.
          </p>
          {/* Field */}
          <span style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#1a2e4a', textAlign: 'right', marginBottom: 8 }}>البريد الإلكتروني أو رقم الهاتف</span>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: 20 }}>
            <input type="text" placeholder="example@mail.com" style={{ width: '100%', padding: '13px 16px 13px 46px', border: '1.5px solid #dde3ed', borderRadius: 10, fontFamily: 'Cairo, sans-serif', fontSize: 14, color: '#1a2e4a', background: '#fff', outline: 'none', textAlign: 'right', direction: 'rtl', transition: 'border-color 0.2s' }} required />
            <span style={{ position: 'absolute', left: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', fontSize: 16, fontWeight: 700, color: '#9aa3b0', fontFamily: 'Cairo, sans-serif' }}>@</span>
          </div>
          {/* Submit */}
          <button type="submit" style={{ width: '100%', padding: 16, background: '#2356c8', color: 'white', border: 'none', borderRadius: 12, fontFamily: 'Cairo, sans-serif', fontSize: 17, fontWeight: 800, cursor: 'pointer', transition: 'background 0.2s, transform 0.15s', marginBottom: 22 }}>إرسال كود التحقق</button>
          {/* Back link */}
          <a href="/pharmacy-login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 14, fontWeight: 700, color: '#2356c8', textDecoration: 'none', direction: 'rtl' }}>
            <span style={{ fontSize: 16 }}>←</span>
            العودة إلى تسجيل الدخول
          </a>
        </form>
        <footer style={{ position: 'fixed', bottom: 18, left: 0, right: 0, textAlign: 'center', fontSize: 12.5, color: '#9aa3b0', fontWeight: 400, direction: 'rtl' }}>
          © 2023 Healup. جميع الحقوق محفوظة لمنصة هيل أب الطبية.
        </footer>
      </body>
    </html>
  );
}
