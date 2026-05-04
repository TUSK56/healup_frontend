"use client";

import GuestTopNavbar from "@/components/landing/GuestTopNavbar";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { HEALUP_PASSWORD_POLICY_AR, isHealupStrictPassword } from "@/lib/passwordPolicy";

export default function AdminResetPasswordPage() {
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass1 !== pass2) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }
    if (!isHealupStrictPassword(pass1)) {
      setError(HEALUP_PASSWORD_POLICY_AR);
      return;
    }
    setError("");
    router.push("/admin-login");
  };

  return (
    <div
      style={{
        fontFamily: "Cairo, sans-serif",
        background: "#eef0f5",
        color: "#1a2e4a",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        alignItems: "stretch",
      }}
    >
      <GuestTopNavbar className="w-full shrink-0" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "0 20px 60px", width: "100%" }}>
        <div
          style={{
            width: "100%",
            maxWidth: 440,
            height: 160,
            background: "#e8ecf4",
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 28,
            marginBottom: 28,
          }}
        >
          <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 80, height: 80, opacity: 0.5 }}>
            <circle cx="40" cy="44" r="22" stroke="#7a9cc8" strokeWidth="3" fill="none" />
            <path
              d="M28 44c0-6.63 5.37-12 12-12 3.5 0 6.65 1.5 8.9 3.9"
              stroke="#7a9cc8"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path d="M52 32l-3 4 4 2" stroke="#7a9cc8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="31" y="44" width="18" height="13" rx="3" fill="#7a9cc8" opacity="0.6" />
            <rect x="34" y="37" width="12" height="10" rx="6" stroke="#7a9cc8" strokeWidth="2.5" fill="none" />
            <circle cx="40" cy="51" r="2" fill="white" opacity="0.9" />
          </svg>
        </div>
        <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 440, textAlign: "center" }}>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#1a2e4a", marginBottom: 14 }}>إعادة تعيين كلمة مرور الإدارة</h1>
          <p style={{ fontSize: 13, color: "#9aa3b0", fontWeight: 400, lineHeight: 1.9, marginBottom: 34, direction: "rtl" }}>
            أدخل كلمة المرور الجديدة وفق المتطلبات أدناه، ثم سجّل الدخول من صفحة الإدارة.
          </p>
          <div style={{ marginBottom: 18, textAlign: "right" }}>
            <span style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#1a2e4a", marginBottom: 8 }}>كلمة المرور الجديدة</span>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <input
                type={showPass1 ? "text" : "password"}
                placeholder="أدخل كلمة المرور الجديدة"
                value={pass1}
                onChange={(e) => setPass1(e.target.value)}
                autoComplete="new-password"
                style={{
                  width: "100%",
                  padding: "14px 16px 14px 46px",
                  border: "1.5px solid #dde3ed",
                  borderRadius: 10,
                  fontFamily: "Cairo, sans-serif",
                  fontSize: 14,
                  color: "#1a2e4a",
                  background: "#fff",
                  outline: "none",
                  textAlign: "right",
                  direction: "rtl",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPass1((v) => !v)}
                style={{ position: "absolute", left: 14, background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                {showPass1 ? (
                  <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: "#9aa3b0" }}>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: "#9aa3b0" }}>
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div style={{ marginBottom: 18, textAlign: "right" }}>
            <span style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#1a2e4a", marginBottom: 8 }}>تأكيد كلمة المرور الجديدة</span>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <input
                type={showPass2 ? "text" : "password"}
                placeholder="أعد إدخال كلمة المرور الجديدة"
                value={pass2}
                onChange={(e) => setPass2(e.target.value)}
                autoComplete="new-password"
                style={{
                  width: "100%",
                  padding: "14px 16px 14px 46px",
                  border: "1.5px solid #dde3ed",
                  borderRadius: 10,
                  fontFamily: "Cairo, sans-serif",
                  fontSize: 14,
                  color: "#1a2e4a",
                  background: "#fff",
                  outline: "none",
                  textAlign: "right",
                  direction: "rtl",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPass2((v) => !v)}
                style={{ position: "absolute", left: 14, background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                {showPass2 ? (
                  <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: "#9aa3b0" }}>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: "#9aa3b0" }}>
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          {error ? <div style={{ color: "#e74c3c", fontSize: 14, marginBottom: 12 }}>{error}</div> : null}
          <div style={{ background: "#f4f6fb", borderRadius: 12, padding: "18px 22px", marginBottom: 22, direction: "rtl", fontSize: 13.5, color: "#1a2e4a", fontWeight: 600 }}>
            {HEALUP_PASSWORD_POLICY_AR}
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: 16,
              background: "#2356c8",
              color: "white",
              border: "none",
              borderRadius: 12,
              fontFamily: "Cairo, sans-serif",
              fontSize: 17,
              fontWeight: 800,
              cursor: "pointer",
              marginBottom: 20,
            }}
          >
            تحديث كلمة المرور
          </button>
          <a href="/admin-login" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 14, fontWeight: 700, color: "#2356c8", textDecoration: "none" }}>
            العودة لتسجيل دخول الإدارة ←
          </a>
        </form>
      </div>
    </div>
  );
}
