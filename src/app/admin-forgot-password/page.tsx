"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import GuestTopNavbar from "@/components/landing/GuestTopNavbar";
import { authService, getAuthErrorMessage } from "@/services/authService";

export default function AdminForgotPasswordPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [fieldInvalid, setFieldInvalid] = React.useState(false);
  const [fieldShake, setFieldShake] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldInvalid(false);
    setIsSubmitting(true);
    try {
      await authService.sendOtp({ identifier, guard: "admin" });
      if (typeof window !== "undefined") {
        localStorage.setItem("healup_reset_identifier", identifier);
        localStorage.setItem("healup_reset_guard", "admin");
      }
      router.push("/verify-otp");
    } catch (err: unknown) {
      const is404 = isAxiosError(err) && err.response?.status === 404;
      if (is404) {
        setFieldInvalid(true);
        setFieldShake(true);
        window.setTimeout(() => setFieldShake(false), 450);
      }
      setError(
        getAuthErrorMessage(err, "لا يوجد حساب بهذا البريد أو رقم الهاتف في سجلات الإدارة."),
      );
    } finally {
      setIsSubmitting(false);
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
        alignItems: "center",
      }}
    >
      <GuestTopNavbar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", padding: "24px 16px 80px" }}>
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
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#1a2e4a", marginBottom: 14, lineHeight: 1.4 }}>استعادة حساب الإدارة</h1>
          <p style={{ fontSize: 13.5, color: "#9aa3b0", fontWeight: 400, lineHeight: 1.9, marginBottom: 28, direction: "rtl" }}>
            أدخل البريد الإلكتروني المسجّل لحساب المشرف. لن يُرسل رمز إلا إذا وُجدت مطابقة في النظام.
          </p>
          <span style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#1a2e4a", textAlign: "right", marginBottom: 8 }}>البريد الإلكتروني أو رقم الهاتف</span>
          <div
            className={`healup-forgot-field-wrap ${fieldInvalid ? "healup-forgot-field-wrap--invalid" : ""} ${fieldShake ? "healup-forgot-field-wrap--shake" : ""}`}
            style={{ position: "relative", display: "flex", alignItems: "center", marginBottom: 20 }}
          >
            <input
              type="text"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                setFieldInvalid(false);
                setError("");
              }}
              placeholder="admin@healup.com"
              required
              style={{
                width: "100%",
                padding: "13px 16px 13px 46px",
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
                fontFamily: "Cairo, sans-serif",
              }}
            >
              @
            </span>
          </div>
          {error ? <div style={{ color: "#e74c3c", fontSize: 13, marginBottom: 12, textAlign: "right" }}>{error}</div> : null}
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
              fontFamily: "Cairo, sans-serif",
              fontSize: 17,
              fontWeight: 800,
              cursor: isSubmitting ? "not-allowed" : "pointer",
              marginBottom: 22,
            }}
          >
            {isSubmitting ? "جارٍ الإرسال..." : "إرسال كود التحقق"}
          </button>
          <a href="/admin-login" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 14, fontWeight: 700, color: "#2356c8", textDecoration: "none", direction: "rtl" }}>
            <span style={{ fontSize: 16 }}>←</span>
            العودة لتسجيل دخول الإدارة
          </a>
        </form>
      </div>
    </div>
  );
}
