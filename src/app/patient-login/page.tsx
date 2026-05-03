"use client";
import React, { useState } from "react";
import { authService, getAuthErrorMessage } from "@/services/authService";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useI18n } from "@/i18n/I18nContext";

export default function PatientLogin() {
  const { t, dir } = useI18n();
  const year = new Date().getFullYear();
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
      window.location.assign("/patient-home");
    } catch (e: unknown) {
      setError(getAuthErrorMessage(e, t("errors.loginFailed")));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      dir={dir}
      style={{
        fontFamily: "var(--font-cairo), Cairo, sans-serif",
        background: "#eef1f6",
        color: "#1a2e4a",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <nav
        style={{
          background: "#fff",
          padding: "12px 30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: dir === "rtl" ? "row-reverse" : "row",
          boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 40,
              height: 40,
              background: "#2356c8",
              borderRadius: 10,
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
          <span style={{ fontSize: 22, fontWeight: 900, color: "#1a2e4a", letterSpacing: -0.5, direction: "ltr" }}>
            Healup
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <LanguageSwitcher compact />
          <div style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <svg viewBox="0 0 24 24" style={{ width: 22, height: 22, fill: "#1a2e4a" }}>
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
            </svg>
          </div>
          <div
            style={{
              width: 42,
              height: 42,
              background: "#e8edf8",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1.5px solid #d0d8ee",
            }}
          >
            <svg viewBox="0 0 24 24" style={{ width: 22, height: 22, fill: "#2356c8" }}>
              <path d="M20 4H4v2l1 1v11c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V7l1-1V4zm-9 13H9V11h2v6zm4 0h-2v-6h2v6zm1-9H8V6h8v2z" />
            </svg>
          </div>
        </div>
      </nav>
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <form
          onSubmit={handleLogin}
          style={{
            background: "#fff",
            borderRadius: 18,
            width: "100%",
            maxWidth: 480,
            boxShadow: "0 4px 28px rgba(0,0,0,0.07)",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "20px 20px 0 20px" }}>
            <div style={{ width: "100%", height: 180, borderRadius: 12, overflow: "hidden", position: "relative", background: "#b8d4e8" }}>
              <img src="/images/patient_login.png" alt={t("auth.patientLogin.imageAlt")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </div>
          <div style={{ padding: "30px 36px 34px" }}>
            <div style={{ textAlign: "center", marginBottom: 26 }}>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: "#1a2e4a", marginBottom: 7 }}>{t("auth.patientLogin.title")}</h1>
              <p style={{ fontSize: 13.5, color: "#9aa3b0", fontWeight: 400, direction: dir }}>
                {t("auth.welcomeBack", { brand: t("common.brand") })}
              </p>
            </div>
            <div style={{ marginBottom: 18 }}>
              <span
                style={{
                  display: "block",
                  textAlign: dir === "rtl" ? "right" : "left",
                  marginBottom: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#1a2e4a",
                }}
              >
                {t("auth.emailOrPhone")}
              </span>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <input
                  type="text"
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                  placeholder={t("auth.emailPlaceholder")}
                  style={{
                    width: "100%",
                    padding: "13px 16px 13px 46px",
                    border: "1.5px solid #dde3ed",
                    borderRadius: 10,
                    fontFamily: "var(--font-cairo), Cairo, sans-serif",
                    fontSize: 14,
                    color: "#1a2e4a",
                    background: "#fff",
                    outline: "none",
                    textAlign: dir === "rtl" ? "right" : "left",
                    direction: dir,
                    transition: "border-color 0.2s",
                  }}
                />
                <span style={{ position: "absolute", left: 14, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                  <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: "#9aa3b0" }}>
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </span>
              </div>
            </div>
            <div style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexDirection: dir === "rtl" ? "row-reverse" : "row" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#1a2e4a" }}>{t("auth.password")}</span>
                <a href="/forgot-password" style={{ fontSize: 12.5, fontWeight: 600, color: "#2356c8", textDecoration: "none", cursor: "pointer" }}>
                  {t("auth.forgotPassword")}
                </a>
              </div>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(ev) => setPassword(ev.target.value)}
                  placeholder={t("auth.passwordPlaceholder")}
                  style={{
                    width: "100%",
                    padding: "13px 16px 13px 46px",
                    border: "1.5px solid #dde3ed",
                    borderRadius: 10,
                    fontFamily: "var(--font-cairo), Cairo, sans-serif",
                    fontSize: 14,
                    color: "#1a2e4a",
                    background: "#fff",
                    outline: "none",
                    textAlign: dir === "rtl" ? "right" : "left",
                    direction: dir,
                    transition: "border-color 0.2s",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", left: 14, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                >
                  {showPassword ? (
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: dir === "rtl" ? "flex-end" : "flex-start",
                gap: 8,
                marginBottom: 22,
                direction: "ltr",
              }}
            >
              <label
                htmlFor="remember"
                style={{
                  fontSize: 13,
                  color: "#1a2e4a",
                  fontWeight: 500,
                  cursor: "pointer",
                  order: 1,
                  direction: dir,
                }}
              >
                {t("auth.rememberMe")}
              </label>
              <input type="checkbox" id="remember" style={{ width: 16, height: 16, accentColor: "#2356c8", cursor: "pointer", flexShrink: 0, order: 2 }} />
            </div>
            {error ? (
              <div style={{ marginBottom: 14, fontSize: 13, fontWeight: 600, color: "#b91c1c", textAlign: dir === "rtl" ? "right" : "left" }}>{error}</div>
            ) : null}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: 16,
                background: isSubmitting ? "#6b88de" : "#2356c8",
                color: "white",
                border: "none",
                borderRadius: 12,
                fontFamily: "var(--font-cairo), Cairo, sans-serif",
                fontSize: 17,
                fontWeight: 800,
                cursor: isSubmitting ? "not-allowed" : "pointer",
                transition: "background 0.2s, transform 0.15s",
                marginBottom: 22,
              }}
            >
              {isSubmitting ? t("auth.loggingIn") : t("auth.loginButton")}
            </button>
            <button
              type="button"
              onClick={() => {
                authService.setGuestSession();
                window.location.assign("/patient-home");
              }}
              style={{
                width: "100%",
                padding: 14,
                background: "#eef4ff",
                color: "#2356c8",
                border: "1px solid #cfe0ff",
                borderRadius: 12,
                fontFamily: "var(--font-cairo), Cairo, sans-serif",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                marginBottom: 14,
              }}
            >
              {t("auth.guestLogin")}
            </button>
            <div style={{ textAlign: "center", fontSize: 13.5, color: "#9aa3b0", fontWeight: 500 }}>
              {t("auth.noAccount")}{" "}
              <a href="/signup" style={{ color: "#2356c8", fontWeight: 700, textDecoration: "none" }}>
                {t("auth.createAccount")}
              </a>
            </div>
          </div>
        </form>
      </main>
      <footer style={{ textAlign: "center", padding: 18, fontSize: 12.5, color: "#9aa3b0", fontWeight: 500, direction: "ltr" }}>
        {t("auth.footerMedical", { year })}
      </footer>
    </div>
  );
}
