"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { authService, getAuthErrorMessage } from "@/services/authService";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Handle OTP input change
  const handleChange = (idx: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);
    setError("");
    // Move to next input if value entered
    if (value && idx < 3) {
      (inputRefs[idx + 1].current as any)?.focus();
    }
    // Move to previous if deleted
    if (!value && idx > 0) {
      (inputRefs[idx - 1].current as any)?.focus();
    }
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const identifier = typeof window !== "undefined" ? localStorage.getItem("healup_reset_identifier") : null;
    if (!identifier) {
      setError("لا يوجد معرف استرجاع. أعد طلب كود جديد.");
      return;
    }
    setIsSubmitting(true);
    try {
      await authService.verifyOtp({ identifier, otp: otp.join("") });
      router.push("/reset-password");
    } catch (err: unknown) {
      setError(getAuthErrorMessage(err, "رمز التحقق غير صحيح."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <html lang="ar" dir="rtl">
      <head>
        <title>تحقق من الرمز - Healup</title>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={{ fontFamily: 'Cairo, sans-serif', background: '#eef0f5', color: '#1a2e4a', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 20, padding: '44px 48px 40px', width: '100%', maxWidth: 480, boxShadow: '0 6px 32px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 28, direction: 'ltr' }}>
            <div style={{ width: 44, height: 44, background: '#2356c8', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#1a2e4a', marginBottom: 14 }}>تحقق من الرمز</h1>
          <p style={{ fontSize: 13, color: '#9aa3b0', fontWeight: 400, lineHeight: 1.9, marginBottom: 32, direction: 'rtl' }}>
            لقد أرسلنا كود التحقق المكون من 4 أرقام إلى بريدك الإلكتروني أو رقم هاتفك. يرجى إدخاله<br />أدناه.
          </p>
          {/* OTP Inputs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginBottom: 28, direction: 'ltr' }}>
            {otp.map((val, idx) => (
              <input
                key={idx}
                ref={inputRefs[idx]}
                className="otp-input"
                type="text"
                maxLength={1}
                inputMode="numeric"
                pattern="[0-9]*"
                value={val}
                onChange={e => handleChange(idx, e.target.value)}
                style={{ width: 64, height: 64, border: '1.5px solid #dde3ed', borderRadius: 12, fontFamily: 'Cairo, sans-serif', fontSize: 22, fontWeight: 700, color: '#1a2e4a', textAlign: 'center', outline: 'none', background: '#fff', transition: 'border-color 0.2s, box-shadow 0.2s', caretColor: '#2356c8' }}
              />
            ))}
          </div>
          {error && <div style={{ color: '#e74c3c', fontSize: 14, marginBottom: 16 }}>{error}</div>}
          {/* Submit */}
          <button disabled={isSubmitting} type="submit" className="btn-submit" style={{ width: '100%', padding: 16, background: isSubmitting ? '#6b88de' : '#2356c8', color: 'white', border: 'none', borderRadius: 12, fontFamily: 'Cairo, sans-serif', fontSize: 17, fontWeight: 800, cursor: isSubmitting ? 'not-allowed' : 'pointer', transition: 'background 0.2s, transform 0.15s', marginBottom: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            تحقق الان
            <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: 'white' }}><path d="M12 2L4 5v6c0 5.25 3.4 10.15 8 11.35C16.6 21.15 20 16.25 20 11V5l-8-3z"/></svg>
          </button>
          {/* Resend */}
          <div style={{ fontSize: 13, color: '#9aa3b0', marginBottom: 10, direction: 'rtl' }}>
            لم يصلك الكود؟ <a href="#" onClick={async (e) => { e.preventDefault(); const identifier = typeof window !== "undefined" ? localStorage.getItem("healup_reset_identifier") : null; if (!identifier) { setError("لا يوجد معرف استرجاع."); return; } setIsResending(true); setError(""); try { await authService.sendOtp({ identifier }); } catch (err: unknown) { setError(getAuthErrorMessage(err, "تعذر إعادة إرسال الكود.")); } finally { setIsResending(false); } }} style={{ color: '#2356c8', fontWeight: 700, textDecoration: 'none', cursor: isResending ? 'not-allowed' : 'pointer', opacity: isResending ? 0.7 : 1 }}>إعادة إرسال</a>
          </div>
          {/* Timer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12.5, color: '#9aa3b0', direction: 'ltr' }}>
            <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, fill: '#9aa3b0' }}><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg>
            يمكنك طلب كود جديد خلال 00:59
          </div>
        </form>
        {/* Footer */}
        <footer style={{ position: 'fixed', bottom: 20, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #dde3ed', borderRadius: 25, padding: '7px 18px', fontSize: 12.5, color: '#9aa3b0', fontWeight: 500, direction: 'ltr', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            اتصال آمن ومشفر bit-256
            <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, fill: '#27ae60' }}><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
          </div>
        </footer>
      </body>
    </html>
  );
}
