"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { authService, getAuthErrorMessage } from "@/services/authService";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useI18n } from "@/i18n/I18nContext";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { t, dir } = useI18n();
  const [identifier, setIdentifier] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await authService.sendOtp({ identifier });
      if (typeof window !== "undefined") {
        localStorage.setItem("healup_reset_identifier", identifier);
        localStorage.setItem("healup_reset_guard", "user");
      }
      router.push("/verify-otp");
    } catch (err: unknown) {
      setError(getAuthErrorMessage(err, t("errors.sendOtpFailed")));
    } finally {
      setIsSubmitting(false);
    }
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
        justifyContent: "center",
        padding: "24px 16px 80px",
      }}
    >
      <div style={{ position: "absolute", top: 16, right: 16 }}>
        <LanguageSwitcher compact />
      </div>
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: "44px 48px 40px",
          width: "100%",
          maxWidth: 460,
          boxShadow: "0 6px 32px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 28, direction: "ltr" }}>
          <div
            style={{
              width: 42,
              height: 42,
              background: "#2356c8",
              borderRadius: 11,
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
        <h1 style={{ fontSize: 26, fontWeight: 900, color: "#1a2e4a", marginBottom: 14, lineHeight: 1.4 }}>{t("auth.forgotPassword.title")}</h1>
        <p style={{ fontSize: 13.5, color: "#9aa3b0", fontWeight: 400, lineHeight: 1.9, marginBottom: 28, direction: dir }}>
          {t("auth.forgotPassword.subtitle")}
        </p>
        <span
          style={{
            display: "block",
            fontSize: 13,
            fontWeight: 700,
            color: "#1a2e4a",
            textAlign: dir === "rtl" ? "right" : "left",
            marginBottom: 8,
          }}
        >
          {t("auth.emailOrPhone")}
        </span>
        <div style={{ position: "relative", display: "flex", alignItems: "center", marginBottom: 20 }}>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
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
            required
          />
          <span
            style={{
              position: "absolute",
              left: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              fontSize: 16,
              fontWeight: 700,
              color: "#9aa3b0",
              fontFamily: "var(--font-cairo), Cairo, sans-serif",
            }}
          >
            @
          </span>
        </div>
        {error ? <div style={{ color: "#e74c3c", fontSize: 13, marginBottom: 12, textAlign: dir === "rtl" ? "right" : "left" }}>{error}</div> : null}
        <button
          disabled={isSubmitting}
          type="submit"
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
          {isSubmitting ? t("auth.forgotPassword.sending") : t("auth.forgotPassword.sendCode")}
        </button>
        <a
          href="/patient-login"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            fontSize: 14,
            fontWeight: 700,
            color: "#2356c8",
            textDecoration: "none",
            direction: dir,
          }}
        >
          <span style={{ fontSize: 16 }}>←</span>
          {t("auth.forgotPassword.backToLogin")}
        </a>
      </form>
      <footer
        style={{
          position: "fixed",
          bottom: 18,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 12.5,
          color: "#9aa3b0",
          fontWeight: 400,
          direction: dir,
        }}
      >
        {t("auth.forgotPassword.footer")}
      </footer>
    </div>
  );
}
