"use client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { authService, getAuthErrorMessage } from "@/services/authService";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useI18n } from "@/i18n/I18nContext";

export default function PharmacyVerifyOtpPage() {
  const router = useRouter();
  const { t, dir } = useI18n();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(59);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  React.useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((x) => x - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (idx: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);
    setError("");
    if (value && idx < 3) {
      (inputRefs[idx + 1].current as HTMLInputElement | null)?.focus();
    }
    if (!value && idx > 0) {
      (inputRefs[idx - 1].current as HTMLInputElement | null)?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const identifier = typeof window !== "undefined" ? localStorage.getItem("healup_reset_identifier") : null;
    if (!identifier) {
      setError(t("errors.noResetIdentifier"));
      return;
    }
    setIsSubmitting(true);
    try {
      await authService.verifyOtp({ identifier, otp: otp.join("") });
      router.push("/pharmacy-reset-password");
    } catch (err: unknown) {
      setError(getAuthErrorMessage(err, t("errors.incorrectOtp")));
    } finally {
      setIsSubmitting(false);
    }
  };

  const mm = String(Math.floor(timer / 60)).padStart(2, "0");
  const ss = String(timer % 60).padStart(2, "0");

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
        padding: "24px 16px 100px",
      }}
    >
      <div style={{ position: "absolute", top: 16, right: 16 }}>
        <LanguageSwitcher compact />
      </div>
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: "44px 48px 40px",
          width: "100%",
          maxWidth: 480,
          boxShadow: "0 6px 32px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 28, direction: "ltr" }}>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#2356c8", letterSpacing: -0.5 }}>Healup</span>
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
            <svg viewBox="0 0 24 24" fill="white" style={{ width: 26, height: 26 }}>
              <path d="M19 3H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
            </svg>
          </div>
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: "#1a2e4a", marginBottom: 14 }}>{t("auth.verifyOtp.title")}</h1>
        <p style={{ fontSize: 13, color: "#9aa3b0", fontWeight: 400, lineHeight: 1.9, marginBottom: 32, direction: dir }}>
          {t("auth.verifyOtp.subtitle")}
        </p>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", justifyContent: "center", gap: 14, marginBottom: 28, direction: "ltr" }}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={inputRefs[idx]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                style={{
                  width: 64,
                  height: 64,
                  border: `1.5px solid ${digit ? "#2356c8" : "#dde3ed"}`,
                  borderRadius: 12,
                  fontFamily: "var(--font-cairo), Cairo, sans-serif",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#1a2e4a",
                  textAlign: "center",
                  outline: "none",
                  background: "#fff",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                  caretColor: "#2356c8",
                  borderWidth: digit ? 2 : 1.5,
                }}
              />
            ))}
          </div>
          {error && <div style={{ color: "#e74c3c", fontSize: 13, marginBottom: 10 }}>{error}</div>}
          <button
            disabled={isSubmitting}
            type="submit"
            className="btn-submit"
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            {t("auth.verifyOtp.verifyNow")}
            <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: "white" }}>
              <path d="M12 2L4 5v6c0 5.25 3.4 10.15 8 11.35C16.6 21.15 20 16.25 20 11V5l-8-3z" />
            </svg>
          </button>
        </form>
        <div style={{ fontSize: 13, color: "#9aa3b0", marginBottom: 10, direction: dir }}>
          {t("auth.verifyOtp.didntGetCode")}{" "}
          <a
            href="#"
            style={{
              color: "#2356c8",
              fontWeight: 700,
              textDecoration: "none",
              cursor: isResending ? "not-allowed" : "pointer",
              opacity: isResending ? 0.7 : 1,
            }}
            onClick={async (e) => {
              e.preventDefault();
              const identifier = typeof window !== "undefined" ? localStorage.getItem("healup_reset_identifier") : null;
              if (!identifier) {
                setError(t("errors.noResetIdentifier"));
                return;
              }
              setIsResending(true);
              setError("");
              try {
                await authService.sendOtp({ identifier });
                setTimer(59);
              } catch (err: unknown) {
                setError(getAuthErrorMessage(err, t("errors.resendOtpFailed")));
              } finally {
                setIsResending(false);
              }
            }}
          >
            {t("auth.verifyOtp.resend")}
          </a>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 12.5, color: "#9aa3b0", direction: "ltr" }}>
          <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, fill: "#9aa3b0" }}>
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
          </svg>
          {t("auth.verifyOtp.timerHint", { minutes: mm, seconds: ss })}
        </div>
        <a
          href="/pharmacy-forgot-password"
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
            marginTop: 18,
          }}
        >
          <span style={{ fontSize: 16 }}>←</span>
          {t("auth.verifyOtp.backShort")}
        </a>
      </div>
      <footer style={{ position: "fixed", bottom: 20, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "#fff",
            border: "1px solid #dde3ed",
            borderRadius: 25,
            padding: "7px 18px",
            fontSize: 12.5,
            color: "#9aa3b0",
            fontWeight: 500,
            direction: "ltr",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          {t("auth.verifyOtp.secureFooter")}
          <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, fill: "#27ae60" }}>
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
          </svg>
        </div>
      </footer>
    </div>
  );
}
