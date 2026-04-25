"use client";

import GuestTopNavbar from "@/components/landing/GuestTopNavbar";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function ResetPasswordPage() {
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
    if (!/[0-9]/.test(pass1) || !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pass1)) {
      setError("يجب أن تحتوي كلمة المرور على أرقام ورموز خاصة");
      return;
    }
    if (pass1 !== pass2) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }
    setError("");
    // Success: go to patient login
    router.push("/patient-login");
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
        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 440, textAlign: 'center' }}>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#1a2e4a', marginBottom: 14 }}>إعادة تعيين كلمة المرور</h1>
          <p style={{ fontSize: 13, color: '#9aa3b0', fontWeight: 400, lineHeight: 1.9, marginBottom: 34, direction: 'rtl' }}>
            يرجى إدخال كلمة المرور الجديدة أدناه لتحديث حسابك في Healup وضمان أمن<br />
            بياناتك الصحية.
          </p>
          {/* New Password */}
          <div style={{ marginBottom: 18, textAlign: 'right' }}>
            <span style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#1a2e4a', marginBottom: 8 }}>كلمة المرور الجديدة</span>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type={showPass1 ? "text" : "password"}
                placeholder="أدخل كلمة المرور الجديدة"
                value={pass1}
                onChange={e => setPass1(e.target.value)}
                style={{ width: '100%', padding: '14px 16px 14px 46px', border: '1.5px solid #dde3ed', borderRadius: 10, fontFamily: 'Cairo, sans-serif', fontSize: 14, color: '#1a2e4a', background: '#fff', outline: 'none', textAlign: 'right', direction: 'rtl', transition: 'border-color 0.2s' }}
              />
              <button type="button" onClick={() => setShowPass1(v => !v)} style={{ position: 'absolute', left: 14, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                {showPass1 ? (
                  <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: '#9aa3b0' }}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" stroke="#9aa3b0" strokeWidth="1.5" fill="none"/></svg>
                ) : (
                  <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: '#9aa3b0' }}><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                )}
              </button>
            </div>
          </div>
          {/* Confirm Password */}
          <div style={{ marginBottom: 18, textAlign: 'right' }}>
            <span style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#1a2e4a', marginBottom: 8 }}>تأكيد كلمة المرور الجديدة</span>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type={showPass2 ? "text" : "password"}
                placeholder="أعد إدخال كلمة المرور الجديدة"
                value={pass2}
                onChange={e => setPass2(e.target.value)}
                style={{ width: '100%', padding: '14px 16px 14px 46px', border: '1.5px solid #dde3ed', borderRadius: 10, fontFamily: 'Cairo, sans-serif', fontSize: 14, color: '#1a2e4a', background: '#fff', outline: 'none', textAlign: 'right', direction: 'rtl', transition: 'border-color 0.2s' }}
              />
              <button type="button" onClick={() => setShowPass2(v => !v)} style={{ position: 'absolute', left: 14, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                {showPass2 ? (
                  <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: '#9aa3b0' }}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" stroke="#9aa3b0" strokeWidth="1.5" fill="none"/></svg>
                ) : (
                  <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: '#9aa3b0' }}><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                )}
              </button>
            </div>
          </div>
          {/* Error message */}
          {error && <div style={{ color: '#e74c3c', fontSize: 14, marginBottom: 12 }}>{error}</div>}
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
          {/* Submit button */}
          <button type="submit" className="btn-submit" style={{ width: '100%', padding: 16, background: '#2356c8', color: 'white', border: 'none', borderRadius: 12, fontFamily: 'Cairo, sans-serif', fontSize: 17, fontWeight: 800, cursor: 'pointer', transition: 'background 0.2s, transform 0.15s', marginBottom: 20 }}>
            تحديث كلمة المرور
          </button>
          {/* Back link */}
          <a href="/patient-login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 14, fontWeight: 700, color: '#2356c8', textDecoration: 'none', direction: 'ltr' }}>
            العودة لتسجيل الدخول ←
          </a>
        </form>
    </div>
  );
}
