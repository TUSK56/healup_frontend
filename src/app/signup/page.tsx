"use client";

import { authService, getAuthErrorMessage } from "@/services/authService";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function SignupPage() {
  const [accountType, setAccountType] = useState("patient");
  const router = useRouter();
  // Form state (for demo, not validated)
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!terms) {
      setError("يجب الموافقة على شروط الاستخدام وسياسة الخصوصية.");
      return;
    }

    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (accountType === "patient") {
        const res = await authService.registerPatient({
          name: fullName,
          email,
          phone: phone || undefined,
          password,
          passwordConfirmation: confirmPassword,
        });

        authService.setSession(res, "user");
        // Keep post-signup patient UI identical to direct guest-style patient-home render.
        window.location.assign("/patient-home");
        return;
      }

      router.push("/pharmacy-signup");
    } catch (err: unknown) {
      setError(getAuthErrorMessage(err, "فشل إنشاء الحساب. تأكد من البيانات وحاول مرة أخرى."));
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <html lang="ar" dir="rtl">
      <head>
        <title>إنشاء حساب - Healup</title>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={{ fontFamily: 'Cairo, sans-serif', background: '#f0f3f8', color: '#1a2e4a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* NAVBAR */}
        <nav style={{ background: '#fff', padding: '12px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            <div style={{ width: 38, height: 38, background: '#2356c8', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 3h6v3H9z" />
                <path d="M3 7h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z" />
                <line x1="12" y1="11" x2="12" y2="17" />
                <line x1="9" y1="14" x2="15" y2="14" />
              </svg>
            </div>
            <span style={{ fontSize: 22, fontWeight: 900, color: '#1a2e4a', letterSpacing: -0.5, direction: 'ltr' }}>Healup</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <a href="#" style={{ fontSize: 14, fontWeight: 600, color: '#1a2e4a', textDecoration: 'none' }}>خدماتنا</a>
              <a href="#" style={{ fontSize: 14, fontWeight: 600, color: '#1a2e4a', textDecoration: 'none' }}>الرئيسية</a>
            </div>
            <button type="button" onClick={() => router.push("/patient-login")} style={{ background: '#2356c8', color: 'white', border: 'none', borderRadius: 25, padding: '10px 22px', fontFamily: 'Cairo, sans-serif', fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }}>تسجيل الدخول</button>
          </div>
        </nav>
        {/* MAIN */}
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
          <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 18, padding: '40px 44px 36px', width: '100%', maxWidth: 560, boxShadow: '0 4px 28px rgba(0,0,0,0.07)' }}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: '#1a2e4a', marginBottom: 8 }}>إنشاء حساب جديد</h1>
              <p style={{ fontSize: 13.5, color: '#9aa3b0', fontWeight: 400 }}>انضم إلى منصة Healup الصحية وابدأ رحلتك نحو رعاية أفضل</p>
            </div>
            {/* Account Type */}
            <span style={{ fontSize: 13, fontWeight: 700, color: '#1a2e4a', marginBottom: 8, display: 'block', textAlign: 'right' }}>نوع الحساب</span>
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexDirection: 'row' }}>
              <button type="button" className={accountType === "patient" ? "type-btn active" : "type-btn"} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 10px', border: '1.5px solid #dde3ed', borderRadius: 10, background: '#fff', fontFamily: 'Cairo, sans-serif', fontSize: 15, fontWeight: 700, color: accountType === "patient" ? '#2356c8' : '#1a2e4a', cursor: 'pointer', transition: 'all 0.2s', borderColor: accountType === "patient" ? '#2356c8' : '#dde3ed', borderWidth: accountType === "patient" ? 2 : 1.5, backgroundColor: accountType === "patient" ? '#f0f5ff' : '#fff' }} onClick={() => setAccountType("patient") }>
                <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: accountType === "patient" ? '#2356c8' : '#9aa3b0' }}><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                مريض
              </button>
              <button
                type="button"
                className={accountType === "pharmacy" ? "type-btn active" : "type-btn"}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 10px', border: '1.5px solid #dde3ed', borderRadius: 10, background: '#fff', fontFamily: 'Cairo, sans-serif', fontSize: 15, fontWeight: 700, color: accountType === "pharmacy" ? '#2356c8' : '#1a2e4a', cursor: 'pointer', transition: 'all 0.2s', borderColor: accountType === "pharmacy" ? '#2356c8' : '#dde3ed', borderWidth: accountType === "pharmacy" ? 2 : 1.5, backgroundColor: accountType === "pharmacy" ? '#f0f5ff' : '#fff' }}
                onClick={() => {
                  setAccountType("pharmacy");
                  router.push("/pharmacy-signup");
                }}
              >
                <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: accountType === "pharmacy" ? '#2356c8' : '#9aa3b0' }}><path d="M19 3H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
                صيدلية
              </button>
            </div>
            {/* Full Name */}
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1a2e4a', marginBottom: 8, display: 'block', textAlign: 'right' }}>الاسم الكامل</span>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input type="text" placeholder="أدخل اسمك بالكامل" value={fullName} onChange={e => setFullName(e.target.value)} style={{ width: '100%', padding: '13px 16px 13px 44px', border: '1.5px solid #dde3ed', borderRadius: 10, fontFamily: 'Cairo, sans-serif', fontSize: 14, color: '#1a2e4a', background: '#fff', outline: 'none', textAlign: 'right', direction: 'rtl', transition: 'border-color 0.2s' }} />
                <span style={{ position: 'absolute', left: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                  <svg viewBox="0 0 24 24" style={{ width: 17, height: 17, fill: '#9aa3b0' }}><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                </span>
              </div>
            </div>
            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1a2e4a', marginBottom: 8, display: 'block', textAlign: 'right' }}>البريد الإلكتروني</span>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input type="email" placeholder="example@mail.com" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '13px 16px 13px 44px', border: '1.5px solid #dde3ed', borderRadius: 10, fontFamily: 'Cairo, sans-serif', fontSize: 14, color: '#1a2e4a', background: '#fff', outline: 'none', textAlign: 'right', direction: 'rtl', transition: 'border-color 0.2s' }} />
                <span style={{ position: 'absolute', left: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                  <svg viewBox="0 0 24 24" style={{ width: 17, height: 17, fill: '#9aa3b0' }}><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                </span>
              </div>
            </div>
            {/* Phone */}
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1a2e4a', marginBottom: 8, display: 'block', textAlign: 'right' }}>رقم الهاتف</span>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input type="tel" placeholder="+966 5x xxx xxxx" value={phone} onChange={e => setPhone(e.target.value)} style={{ width: '100%', padding: '13px 16px 13px 44px', border: '1.5px solid #dde3ed', borderRadius: 10, fontFamily: 'Cairo, sans-serif', fontSize: 14, color: '#1a2e4a', background: '#fff', outline: 'none', textAlign: 'right', direction: 'rtl', transition: 'border-color 0.2s' }} />
                <span style={{ position: 'absolute', left: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                  <svg viewBox="0 0 24 24" style={{ width: 17, height: 17, fill: '#9aa3b0' }}><path d="M6.62 10.79a15.15 15.15 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.61 21 3 13.39 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.24 1.02l-2.21 2.2z"/></svg>
                </span>
              </div>
            </div>
            {/* Password Row */}
            <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
              {/* Password */}
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#1a2e4a', marginBottom: 8, display: 'block', textAlign: 'right' }}>كلمة المرور</span>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '13px 16px 13px 44px', border: '1.5px solid #dde3ed', borderRadius: 10, fontFamily: 'Cairo, sans-serif', fontSize: 14, color: '#1a2e4a', background: '#fff', outline: 'none', textAlign: 'right', direction: 'rtl', transition: 'border-color 0.2s' }} />
                  <span style={{ position: 'absolute', left: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                    <svg viewBox="0 0 24 24" style={{ width: 17, height: 17, fill: '#9aa3b0' }}><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
                  </span>
                </div>
              </div>
              {/* Confirm Password */}
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#1a2e4a', marginBottom: 8, display: 'block', textAlign: 'right' }}>تأكيد كلمة المرور</span>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={{ width: '100%', padding: '13px 16px 13px 44px', border: '1.5px solid #dde3ed', borderRadius: 10, fontFamily: 'Cairo, sans-serif', fontSize: 14, color: '#1a2e4a', background: '#fff', outline: 'none', textAlign: 'right', direction: 'rtl', transition: 'border-color 0.2s' }} />
                  <span style={{ position: 'absolute', left: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                    <svg viewBox="0 0 24 24" style={{ width: 17, height: 17, fill: '#9aa3b0' }}><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
                  </span>
                </div>
              </div>
            </div>
            {/* Terms */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, marginBottom: 20, direction: 'ltr' }}>
              <label htmlFor="terms" style={{ fontSize: 13, color: '#1a2e4a', fontWeight: 500, cursor: 'pointer', order: 1, direction: 'rtl' }}>أوافق على <a href="#" style={{ color: '#2356c8', textDecoration: 'none', fontWeight: 700 }}>شروط الاستخدام</a> و <a href="#" style={{ color: '#2356c8', textDecoration: 'none', fontWeight: 700 }}>سياسة الخصوصية</a></label>
              <input type="checkbox" id="terms" checked={terms} onChange={e => setTerms(e.target.checked)} style={{ width: 16, height: 16, accentColor: '#2356c8', cursor: 'pointer', flexShrink: 0, order: 2 }} />
            </div>
            {error ? (
              <div style={{ marginBottom: 14, fontSize: 13, fontWeight: 600, color: '#b91c1c', textAlign: 'right' }}>
                {error}
              </div>
            ) : null}
            {/* Submit */}
            <button type="submit" disabled={isSubmitting} style={{ width: '100%', padding: 16, background: isSubmitting ? '#6b88de' : '#2356c8', color: 'white', border: 'none', borderRadius: 12, fontFamily: 'Cairo, sans-serif', fontSize: 17, fontWeight: 800, cursor: isSubmitting ? 'not-allowed' : 'pointer', transition: 'background 0.2s, transform 0.15s', marginBottom: 20 }}>{isSubmitting ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}</button>
            {/* Login link */}
            <div style={{ textAlign: 'center', fontSize: 13.5, color: '#9aa3b0', fontWeight: 500 }}>
              لديك حساب بالفعل؟ <a href="/patient-login" style={{ color: '#2356c8', fontWeight: 700, textDecoration: 'none' }}>تسجيل الدخول</a>
            </div>
          </form>
        </main>
        {/* FOOTER */}
        <footer style={{ textAlign: 'center', padding: 18, fontSize: 12.5, color: '#9aa3b0', fontWeight: 500, direction: 'ltr' }}>
          © 2024 Healup. جميع الحقوق محفوظة.
        </footer>
      </body>
    </html>
  );
}
