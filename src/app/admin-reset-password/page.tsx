"use client";

import GuestTopNavbar from "@/components/landing/GuestTopNavbar";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { isAxiosError } from "axios";
import { HEALUP_PASSWORD_INVALID_SHORT_AR, isHealupStrictPassword } from "@/lib/passwordPolicy";
import HealupPasswordInput from "@/components/auth/HealupPasswordInput";
import { authService, getAuthErrorMessage } from "@/services/authService";

type FieldKey = "pass1" | "pass2" | null;

function apiErrorField(err: unknown): string | undefined {
  if (!isAxiosError(err)) return undefined;
  const f = (err.response?.data as { field?: string })?.field;
  return typeof f === "string" ? f : undefined;
}

function mapApiFieldToUi(field: string | undefined): FieldKey {
  if (field === "new_password") return "pass1";
  if (field === "new_password_confirmation") return "pass2";
  return null;
}

export default function AdminResetPasswordPage() {
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [error, setError] = useState("");
  const [errorField, setErrorField] = useState<FieldKey>(null);
  const [shakeField, setShakeField] = useState<FieldKey>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const triggerShake = (f: FieldKey) => {
    if (!f) return;
    setShakeField(f);
    window.setTimeout(() => setShakeField(null), 450);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setErrorField(null);

    const identifier = typeof window !== "undefined" ? localStorage.getItem("healup_reset_identifier") : null;
    if (!identifier?.trim()) {
      setError("انتهت الجلسة. ابدأ من «نسيت كلمة المرور» مرة أخرى.");
      return;
    }

    if (pass1 !== pass2) {
      setError("كلمتا المرور غير متطابقتين");
      setErrorField("pass2");
      triggerShake("pass2");
      return;
    }
    if (!isHealupStrictPassword(pass1)) {
      setError(HEALUP_PASSWORD_INVALID_SHORT_AR);
      setErrorField("pass1");
      triggerShake("pass1");
      return;
    }

    setSubmitting(true);
    try {
      await authService.resetPasswordAfterOtp({
        identifier: identifier.trim(),
        guard: "admin",
        newPassword: pass1,
        newPasswordConfirmation: pass2,
      });
      if (typeof window !== "undefined") {
        localStorage.removeItem("healup_reset_identifier");
        localStorage.removeItem("healup_reset_guard");
      }
      router.push("/admin-login");
    } catch (err: unknown) {
      const field = mapApiFieldToUi(apiErrorField(err));
      setErrorField(field);
      if (field) triggerShake(field);
      setError(getAuthErrorMessage(err, "تعذر تحديث كلمة المرور."));
    } finally {
      setSubmitting(false);
    }
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
            أدخل كلمة المرور الجديدة، ثم سجّل الدخول من صفحة الإدارة.
          </p>
          <div className={shakeField === "pass1" ? "healup-forgot-field-wrap--shake" : undefined} style={{ marginBottom: 18, textAlign: "right" }}>
            <span
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 700,
                color: errorField === "pass1" ? "#ef4444" : "#1a2e4a",
                marginBottom: 8,
                borderRadius: 8,
                padding: errorField === "pass1" ? "4px 8px" : undefined,
                border: errorField === "pass1" ? "1.5px solid #ef4444" : "1.5px solid transparent",
              }}
            >
              كلمة المرور الجديدة
            </span>
            <HealupPasswordInput
              value={pass1}
              onChange={(v) => {
                setPass1(v);
                setErrorField(null);
                setError("");
              }}
              showPassword={showPass1}
              onToggleShow={() => setShowPass1((v) => !v)}
              placeholder="أدخل كلمة المرور الجديدة"
              autoComplete="new-password"
              rtl
              invalid={errorField === "pass1"}
              inputStyle={{ fontSize: 14 }}
            />
          </div>
          <div className={shakeField === "pass2" ? "healup-forgot-field-wrap--shake" : undefined} style={{ marginBottom: 18, textAlign: "right" }}>
            <span
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 700,
                color: errorField === "pass2" ? "#ef4444" : "#1a2e4a",
                marginBottom: 8,
                borderRadius: 8,
                padding: errorField === "pass2" ? "4px 8px" : undefined,
                border: errorField === "pass2" ? "1.5px solid #ef4444" : "1.5px solid transparent",
              }}
            >
              تأكيد كلمة المرور الجديدة
            </span>
            <HealupPasswordInput
              value={pass2}
              onChange={(v) => {
                setPass2(v);
                setErrorField(null);
                setError("");
              }}
              showPassword={showPass2}
              onToggleShow={() => setShowPass2((v) => !v)}
              placeholder="أعد إدخال كلمة المرور الجديدة"
              autoComplete="new-password"
              rtl
              invalid={errorField === "pass2"}
              inputStyle={{ fontSize: 14 }}
            />
          </div>
          {error ? <div style={{ color: "#e74c3c", fontSize: 14, marginBottom: 12 }}>{error}</div> : null}
          <button
            type="submit"
            disabled={submitting}
            style={{
              width: "100%",
              padding: 16,
              background: submitting ? "#6b88de" : "#2356c8",
              color: "white",
              border: "none",
              borderRadius: 12,
              fontFamily: "Cairo, sans-serif",
              fontSize: 17,
              fontWeight: 800,
              cursor: submitting ? "not-allowed" : "pointer",
              marginBottom: 20,
            }}
          >
            {submitting ? "جارٍ الحفظ..." : "تحديث كلمة المرور"}
          </button>
          <a href="/admin-login" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 14, fontWeight: 700, color: "#2356c8", textDecoration: "none" }}>
            العودة لتسجيل دخول الإدارة ←
          </a>
        </form>
      </div>
    </div>
  );
}
