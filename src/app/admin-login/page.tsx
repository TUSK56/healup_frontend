
"use client";
import React, { useState } from "react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // TODO: Replace with real authentication logic
    setTimeout(() => {
      if (username === "admin@healup.com" && password === "admin123") {
        setError("");
      } else {
        setError("بيانات الدخول غير صحيحة");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#eef0f5", color: "#1a2e4a", display: "flex", flexDirection: "column", direction: "ltr", fontFamily: "'Cairo', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet" />
      {/* NAVBAR - swapped */}
      <nav style={{ background: "#fff", padding: "12px 36px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
        <button type="button" style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 16px", border: "1.5px solid #c8cfd8", borderRadius: 20, background: "#fff", fontFamily: "'Cairo', sans-serif", fontSize: 13.5, fontWeight: 700, color: "#1a2e4a", cursor: "pointer", direction: "rtl" }}>
          <svg viewBox="0 0 24 24" width={16} height={16} fill="#1a2e4a"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>
          <span>المساعدة</span>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexDirection: "row-reverse" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 38, height: 38, background: "#2356c8", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 3h6v3H9z" />
                  <path d="M3 7h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z" />
                  <line x1="12" y1="11" x2="12" y2="17" />
                  <line x1="9" y1="14" x2="15" y2="14" />
                </svg>
              </div>
              <span style={{ fontSize: 21, fontWeight: 900, color: "#2356c8" }}>Healup</span>
            </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#3678BE" }}>لوحة التحكم</span>
        </div>
      </nav>
      {/* MAIN - swapped boxes */}
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ display: "flex", flexDirection: "row", width: "100%", maxWidth: 900, borderRadius: 20, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.10)" }}>
          {/* Form Panel - now left */}
          <form onSubmit={handleSubmit} style={{ flex: 1, background: "#fff", padding: "48px 44px 36px", display: "flex", flexDirection: "column", direction: "rtl" }}>
            <div style={{ textAlign: "right", marginBottom: 28 }}>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: "#1a2e4a", marginBottom: 8 }}>تسجيل دخول الإدارة</h1>
              <p style={{ fontSize: 13, color: "#9aa3b0", fontWeight: 400, lineHeight: 1.7 }}>يرجى إدخال بيانات الاعتماد الخاصة بك للوصول إلى لوحة التحكم</p>
            </div>
            <div style={{ marginBottom: 18 }}>
              <span style={{ display: "block", marginBottom: 8, fontSize: 12.5, fontWeight: 700, color: "#1a2e4a" }}>البريد الإلكتروني أو اسم المستخدم</span>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="example@healup.com" style={{ width: "100%", padding: "13px 42px 13px 16px", border: "1.5px solid #dde3ed", borderRadius: 10, fontFamily: "'Cairo', sans-serif", fontSize: 13.5, color: "#1a2e4a", background: "#fff", outline: "none", textAlign: "right", direction: "rtl", transition: "border-color 0.2s" }} />
                <span style={{ position: "absolute", right: 13, pointerEvents: "none", display: "flex", alignItems: "center" }}>
                  <svg viewBox="0 0 24 24" width={17} height={17} fill="#9aa3b0"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                </span>
              </div>
            </div>
            <div style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: "#1a2e4a" }}>كلمة المرور</span>
                <a href="#" style={{ fontSize: 12, fontWeight: 700, color: "#2356c8", textDecoration: "none" }}>نسيت كلمة المرور؟</a>
              </div>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" id="adminPass" style={{ width: "100%", padding: "13px 42px 13px 16px", border: "1.5px solid #dde3ed", borderRadius: 10, fontFamily: "'Cairo', sans-serif", fontSize: 13.5, color: "#1a2e4a", background: "#fff", outline: "none", textAlign: "right", direction: "rtl", transition: "border-color 0.2s" }} />
                <span style={{ position: "absolute", right: 13, pointerEvents: "none", display: "flex", alignItems: "center" }}>
                  <svg viewBox="0 0 24 24" width={17} height={17} fill="#9aa3b0"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
                </span>
                <button type="button" style={{ position: "absolute", left: 13, background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }} onClick={() => setShowPassword(v => !v)}>
                  {showPassword ? (
                    <svg id="eyeIcon" viewBox="0 0 24 24" width={17} height={17}><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="#9aa3b0"/></svg>
                  ) : (
                    <svg id="eyeIcon" viewBox="0 0 24 24" width={17} height={17}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" stroke="#9aa3b0" strokeWidth={1.8} fill="none" strokeLinecap="round"/></svg>
                  )}
                </button>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: 8, marginBottom: 22, direction: "rtl", textAlign: "right" }}>
              <input type="checkbox" id="remember" checked={remember} onChange={e => setRemember(e.target.checked)} style={{ width: 15, height: 15, accentColor: "#2356c8", cursor: "pointer" }} />
              <label htmlFor="remember" style={{ fontSize: 13, color: "#1a2e4a", fontWeight: 500, cursor: "pointer" }}>تذكرني على هذا الجهاز</label>
            </div>
            {error && <div style={{ color: '#e74c3c', fontSize: 13, textAlign: 'center', marginBottom: 6 }}>{error}</div>}
            <button type="submit" style={{ width: "100%", padding: 15, background: "#2356c8", color: "white", border: "none", borderRadius: 12, fontFamily: "'Cairo', sans-serif", fontSize: 16, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', transition: "background 0.2s, transform 0.15s", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }} disabled={loading}>
              دخول إلى لوحة التحكم
              <svg viewBox="0 0 24 24" width={18} height={18} fill="white"><path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/></svg>
            </button>
            <p style={{ fontSize: 11.5, color: "#9aa3b0", textAlign: "center", lineHeight: 1.8, marginTop: "auto", paddingTop: 20, borderTop: "1px solid #dde3ed" }}>
              هذا النظام مخصص للموظفين المصرح لهم فقط. يتم مراقبة جميع الأنشطة وتسجيلها لضمان أمن البيانات والخصوصية.
            </p>
          </form>
          {/* Info Panel - now right */}
          <div style={{
            width: 400,
            flexShrink: 0,
            background: "linear-gradient(160deg, #c5d8e8 0%, #a8c4d8 40%, #8fb5cc 100%)",
            backgroundImage: "url('/images/admin_login.webp'), linear-gradient(160deg, #c5d8e8 0%, #a8c4d8 40%, #8fb5cc 100%)",
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            padding: '48px 36px 36px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            direction: 'rtl',
          }}>
            {/* Blue overlay layer */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(36, 104, 180, 0.32)',
              zIndex: 0,
              pointerEvents: 'none',
            }} />
            {/* SVG background ellipses */}
            <div style={{ position: "absolute", bottom: 60, left: "50%", transform: "translateX(-50%)", width: 280, height: 180, backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 120\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cellipse cx=\'100\' cy=\'60\' rx=\'95\' ry=\'55\' fill=\'none\' stroke=\'rgba(255,255,255,0.25)\' stroke-width=\'1\'/%3E%3Cellipse cx=\'100\' cy=\'60\' rx=\'65\' ry=\'55\' fill=\'none\' stroke=\'rgba(255,255,255,0.2)\' stroke-width=\'1\'/%3E%3Cellipse cx=\'100\' cy=\'60\' rx=\'30\' ry=\'55\' fill=\'none\' stroke=\'rgba(255,255,255,0.15)\' stroke-width=\'1\'/%3E%3Cline x1=\'5\' y1=\'60\' x2=\'195\' y2=\'60\' stroke=\'rgba(255,255,255,0.18)\' stroke-width=\'1\'/%3E%3Cline x1=\'100\' y1=\'5\' x2=\'100\' y2=\'115\' stroke=\'rgba(255,255,255,0.15)\' stroke-width=\'1\'/%3E%3C/svg%3E')", backgroundSize: "contain", backgroundRepeat: "no-repeat", opacity: 0.7, zIndex: 0 }} />
            <div style={{ zIndex: 1, textAlign: "right" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", marginBottom: 20 }}>
                <svg viewBox="0 0 24 24" width={60} height={60} fill="#2356c8"><path d="M12 2L4 5v6c0 5.25 3.4 10.15 8 11.35C16.6 21.15 20 16.25 20 11V5l-8-3z"/><circle cx="12" cy="9" r="2.5" fill="white"/><path d="M12 13c-2.5 0-4.5 1.1-4.5 2.5v.5h9v-.5c0-1.4-2-2.5-4.5-2.5z" fill="white"/></svg>
              </div>
              <h2 style={{ fontSize: 26, fontWeight: 900, color: "#0456AE", marginBottom: 14, lineHeight: 1.4 }}>أهلاً بك في نظام الإدارة</h2>
              <p style={{ fontSize: 13, color: "#3678BE", lineHeight: 1.9, fontWeight: 400 }}>
                منصة <span style={{ color: "#3678BE", fontWeight: 700 }}>Healup</span> توفر لك كافة الأدوات اللازمة لإدارة المرافق الطبية والبيانات الصحية بأمان وكفاءة عالية.
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 20, zIndex: 1, direction: "rtl" }}>
                <div style={{ display: "flex", flexDirection: "row-reverse", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "#1a2e4a" }}>
                اتصال مشفر
                <svg viewBox="0 0 24 24" width={16} height={16} fill="#2356c8"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1.5 13.5l-3-3 1.41-1.41 1.59 1.58 4.09-4.08 1.41 1.41-5.5 5.5z"/></svg>
              </div>
              <div style={{ display: "flex", flexDirection: "row-reverse", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "#1a2e4a" }}>
                حماية البيانات
                <svg viewBox="0 0 24 24" width={16} height={16} fill="#2356c8"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
              </div>
              
            </div>
          </div>
        </div>
      </main>
      <footer style={{ textAlign: "center", padding: 16, fontSize: 12.5, color: "#9aa3b0", direction: "rtl" }}>© 2024 Healup Medical Solutions. جميع الحقوق محفوظة.</footer>
    </div>
  );
}
