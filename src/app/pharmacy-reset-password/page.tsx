"use client";

import GuestTopNavbar from "@/components/landing/GuestTopNavbar";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import HealupPasswordInput from "@/components/auth/HealupPasswordInput";

export default function PharmacyResetPasswordPage() {
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation: at least 8 chars, contains number and special char, and match
    if (pass1.length < 8) {
      setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      return;
    }
    if (!/[0-9]/.test(pass1) || !/[!@#$%^&*()_+\-=[\]{};':\"\\|,.<>/?]/.test(pass1)) {
      setError("يجب أن تحتوي كلمة المرور على أرقام ورموز خاصة");
      return;
    }
    if (pass1 !== pass2) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }
    setError("");
    // Success: go to pharmacy login
    router.push("/pharmacy-login");
  };

  return (
    <div style={{ fontFamily: 'Cairo, sans-serif', background: '#eef0f5', color: '#1a2e4a', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 20px 60px' }}>
      <GuestTopNavbar />
        {/* Illustration */}
        <div style={{ width: '100%', maxWidth: 440, height: 160, background: '#e8ecf4', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 28, marginBottom: 28 }}>
          <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 80, height: 80, opacity: 0.5 }}>
            <circle cx="40" cy="44" r="22" stroke="#7a9cc8" strokeWidth="3" fill="none"/>
            <path d="M28 44c0-6.63 5.37-12 12-12 3.5 0 6.65 1.5 8.9 3.9" stroke="#7a9cc8" strokeWidth="3" strokeLinecap="round"/>
            <path d="M52 32l-3 4 4 2" stroke="#7a9cc8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="31" y="44" width="18" height="13" rx="3" fill="#7a9cc8" opacity="0.6"/>
            <rect x="34" y="37" width="12" height="10" rx="6" stroke="#7a9cc8" strokeWidth="2.5" fill="none"/>
            <circle cx="40" cy="51" r="2" fill="white" opacity="0.9"/>
          </svg>
        </div>
        {/* Content */}
        <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 20, padding: '36px 40px 32px', width: '100%', maxWidth: 440, boxShadow: '0 6px 32px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#1a2e4a', marginBottom: 14 }}>إعادة تعيين كلمة المرور</h1>
          <p style={{ fontSize: 13, color: '#9aa3b0', fontWeight: 400, lineHeight: 1.9, marginBottom: 34, direction: 'rtl' }}>
            يرجى إدخال كلمة المرور الجديدة أدناه لتحديث حسابك في Healup وضمان أمن<br />بياناتك الصحية.
          </p>
          {/* New Password */}
          <div style={{ marginBottom: 18, textAlign: 'right' }}>
            <span style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#1a2e4a', marginBottom: 8 }}>كلمة المرور الجديدة</span>
            <HealupPasswordInput
              value={pass1}
              onChange={setPass1}
              showPassword={showPass1}
              onToggleShow={() => setShowPass1((v) => !v)}
              placeholder="أدخل كلمة المرور الجديدة"
              autoComplete="new-password"
              rtl
              inputStyle={{ fontSize: 14, padding: "14px 42px 14px 46px" }}
            />
          </div>
          {/* Confirm Password */}
          <div style={{ marginBottom: 18, textAlign: 'right' }}>
            <span style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#1a2e4a', marginBottom: 8 }}>تأكيد كلمة المرور الجديدة</span>
            <HealupPasswordInput
              value={pass2}
              onChange={setPass2}
              showPassword={showPass2}
              onToggleShow={() => setShowPass2((v) => !v)}
              placeholder="أعد إدخال كلمة المرور الجديدة"
              autoComplete="new-password"
              rtl
              inputStyle={{ fontSize: 14, padding: "14px 42px 14px 46px" }}
            />
          </div>
          {/* Requirements */}
          <div style={{ background: '#f4f6fb', borderRadius: 12, padding: '18px 22px', marginBottom: 22, direction: 'rtl' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 10, fontSize: 13.5, color: '#1a2e4a', fontWeight: 600, marginBottom: 10, direction: 'rtl' }}>
              <div style={{ width: 22, height: 22, background: '#2356c8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg viewBox="0 0 24 24" style={{ width: 13, height: 13, fill: 'white' }}><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
              </div>
              يجب أن تتكون من 8 أحرف على الأقل
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 10, fontSize: 13.5, color: '#1a2e4a', fontWeight: 600, marginBottom: 0, direction: 'rtl' }}>
              <div style={{ width: 22, height: 22, background: '#2356c8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg viewBox="0 0 24 24" style={{ width: 13, height: 13, fill: 'white' }}><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
              </div>
              يجب أن تحتوي على أرقام ورموز خاصة
            </div>
          </div>
          {error && <div style={{ color: '#e74c3c', fontSize: 13, marginBottom: 10 }}>{error}</div>}
          <button type="submit" className="btn-submit" style={{ width: '100%', padding: 16, background: '#2356c8', color: 'white', border: 'none', borderRadius: 12, fontFamily: 'Cairo, sans-serif', fontSize: 17, fontWeight: 800, cursor: 'pointer', transition: 'background 0.2s, transform 0.15s', marginBottom: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, direction: 'rtl' }}>
            <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, fill: 'white' }}><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>
            حفظ كلمة المرور الجديدة
          </button>
          <a href="/pharmacy-login" className="back-link" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 14, fontWeight: 700, color: '#2356c8', textDecoration: 'none', direction: 'ltr' }}>
            العودة لتسجيل الدخول ←
          </a>
        </form>
        <footer style={{ position: 'fixed', bottom: 18, left: 0, right: 0, textAlign: 'center', fontSize: 12.5, color: '#9aa3b0', fontWeight: 400, direction: 'rtl' }}>
          © 2023 Healup. جميع الحقوق محفوظة لمنصة هيل أب الطبية.
        </footer>
    </div>
  );
}
