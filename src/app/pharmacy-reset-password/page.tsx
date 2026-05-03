"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useI18n } from "@/i18n/I18nContext";

export default function PharmacyResetPasswordPage() {
  const { t, dir } = useI18n();
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const ta = dir === "rtl" ? "right" : "left";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass1.length < 8) {
      setError(t("auth.resetPassword.requirementLength"));
      return;
    }
    if (!/[0-9]/.test(pass1) || !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pass1)) {
      setError(t("auth.resetPassword.requirementComplex"));
      return;
    }
    if (pass1 !== pass2) {
      setError(t("errors.passwordMismatch"));
      return;
    }
    setError("");
    router.push("/pharmacy-login");
  };

  return (
    <div
      dir={dir}
      style={{
        fontFamily: "var(--font-cairo), Cairo, sans-serif",
        background: "#eef0f5",
        color: "#1a2e4a",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 20px 80px",
      }}
    >
      <div style={{ position: "absolute", top: 16, right: 16 }}>
        <LanguageSwitcher compact />
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 28, direction: "ltr" }}>
        <div
          style={{
            width: 44,
            height: 44,
            background: "#2356c8",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 3h6v3H9z" />
            <path d="M3 7h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z" />
            <line x1="12" y1="11" x2="12" y2="17" />
            <line x1="9" y1="14" x2="15" y2="14" />
          </svg>
        </div>
        <span style={{ fontSize: 24, fontWeight: 900, color: "#2356c8", letterSpacing: -0.5 }}>Healup</span>
      </div>
      <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 440, textAlign: "center" }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: "#1a2e4a", marginBottom: 14 }}>{t("auth.resetPassword.title")}</h1>
        <p style={{ fontSize: 13, color: "#9aa3b0", fontWeight: 400, lineHeight: 1.9, marginBottom: 34, direction: dir }}>
          {t("auth.resetPassword.subtitle")}
        </p>
        <div style={{ marginBottom: 18, textAlign: ta }}>
          <span style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#1a2e4a", marginBottom: 8 }}>{t("auth.resetPassword.newPassword")}</span>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <input
              type={showPass1 ? "text" : "password"}
              placeholder={t("auth.resetPassword.newPasswordPlaceholder")}
              value={pass1}
              onChange={(e) => setPass1(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px 14px 46px",
                border: "1.5px solid #dde3ed",
                borderRadius: 10,
                fontFamily: "var(--font-cairo), Cairo, sans-serif",
                fontSize: 14,
                color: "#1a2e4a",
                background: "#fff",
                outline: "none",
                textAlign: ta,
                direction: dir,
                transition: "border-color 0.2s",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPass1((v) => !v)}
              style={{ position: "absolute", left: 14, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
            >
              {showPass1 ? (
                <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: "#9aa3b0" }}>
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" stroke="#9aa3b0" strokeWidth="1.5" fill="none" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: "#9aa3b0" }}>
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                </svg>
              )}
            </button>
          </div>
        </div>
        <div style={{ marginBottom: 18, textAlign: ta }}>
          <span style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#1a2e4a", marginBottom: 8 }}>{t("auth.resetPassword.confirmNewPassword")}</span>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <input
              type={showPass2 ? "text" : "password"}
              placeholder={t("auth.resetPassword.confirmPlaceholder")}
              value={pass2}
              onChange={(e) => setPass2(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px 14px 46px",
                border: "1.5px solid #dde3ed",
                borderRadius: 10,
                fontFamily: "var(--font-cairo), Cairo, sans-serif",
                fontSize: 14,
                color: "#1a2e4a",
                background: "#fff",
                outline: "none",
                textAlign: ta,
                direction: dir,
                transition: "border-color 0.2s",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPass2((v) => !v)}
              style={{ position: "absolute", left: 14, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
            >
              {showPass2 ? (
                <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: "#9aa3b0" }}>
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" stroke="#9aa3b0" strokeWidth="1.5" fill="none" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: "#9aa3b0" }}>
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                </svg>
              )}
            </button>
          </div>
        </div>
        <div style={{ background: "#f4f6fb", borderRadius: 12, padding: "18px 22px", marginBottom: 22, direction: dir }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 10, fontSize: 13.5, color: "#1a2e4a", fontWeight: 600, marginBottom: 10, direction: dir }}>
            <div style={{ width: 22, height: 22, background: "#2356c8", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg viewBox="0 0 24 24" style={{ width: 13, height: 13, fill: "white" }}>
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
            </div>
            {t("auth.resetPassword.requirementLength")}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 10, fontSize: 13.5, color: "#1a2e4a", fontWeight: 600, marginBottom: 0, direction: dir }}>
            <div style={{ width: 22, height: 22, background: "#2356c8", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg viewBox="0 0 24 24" style={{ width: 13, height: 13, fill: "white" }}>
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
            </div>
            {t("auth.resetPassword.requirementComplex")}
          </div>
        </div>
        {error && <div style={{ color: "#e74c3c", fontSize: 13, marginBottom: 10 }}>{error}</div>}
        <button
          type="submit"
          className="btn-submit"
          style={{
            width: "100%",
            padding: 16,
            background: "#2356c8",
            color: "white",
            border: "none",
            borderRadius: 12,
            fontFamily: "var(--font-cairo), Cairo, sans-serif",
            fontSize: 17,
            fontWeight: 800,
            cursor: "pointer",
            transition: "background 0.2s, transform 0.15s",
            marginBottom: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            direction: dir,
          }}
        >
          <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, fill: "white" }}>
            <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
          </svg>
          {t("auth.resetPassword.updatePassword")}
        </button>
        <a href="/pharmacy-login" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 14, fontWeight: 700, color: "#2356c8", textDecoration: "none", direction: "ltr" }}>
          {t("auth.resetPassword.backToPharmacyLogin")}
        </a>
      </form>
      <footer style={{ position: "fixed", bottom: 18, left: 0, right: 0, textAlign: "center", fontSize: 12.5, color: "#9aa3b0", fontWeight: 400, direction: dir }}>
        {t("auth.forgotPassword.footer")}
      </footer>
    </div>
  );
}
