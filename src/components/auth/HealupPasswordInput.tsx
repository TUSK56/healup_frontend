"use client";

import React from "react";

const ICON = 17;
const EDGE = 13;

export type HealupPasswordInputProps = {
  value: string;
  onChange: (value: string) => void;
  showPassword: boolean;
  onToggleShow: () => void;
  placeholder?: string;
  autoComplete?: string;
  name?: string;
  id?: string;
  /** When true, use Arabic layout: text RTL, eye on the left and lock on the right (mirror of LTR). */
  rtl?: boolean;
  inputStyle?: React.CSSProperties;
  /** When false, only the show/hide control is shown (e.g. patient / pharmacy login). */
  showLock?: boolean;
  /** Red border on the input (validation error). */
  invalid?: boolean;
  /** Brief shake on the field wrapper (matches globals.css keyframes). */
  shake?: boolean;
};

/**
 * Password field with optional lock + visibility toggle (admin-style when showLock is true).
 */
export default function HealupPasswordInput({
  value,
  onChange,
  showPassword,
  onToggleShow,
  placeholder = "••••••••",
  autoComplete,
  name,
  id,
  rtl = false,
  showLock = true,
  invalid = false,
  shake = false,
  inputStyle,
}: HealupPasswordInputProps) {
  const padding = showLock
    ? rtl
      ? "13px 42px 13px 46px"
      : "13px 46px 13px 42px"
    : rtl
      ? "13px 16px 13px 46px"
      : "13px 46px 13px 16px";

  const eyePos = rtl ? { left: EDGE } : { right: EDGE };
  const lockPos = rtl ? { right: EDGE } : { left: EDGE };

  const baseInput: React.CSSProperties = {
    width: "100%",
    padding,
    border: "1.5px solid #dde3ed",
    borderRadius: 10,
    fontFamily: "'Cairo', sans-serif",
    fontSize: 13.5,
    color: "#1a2e4a",
    background: "#fff",
    outline: "none",
    textAlign: rtl ? "right" : "left",
    direction: rtl ? "rtl" : "ltr",
    transition: "border-color 0.2s",
    ...inputStyle,
    ...(invalid ? { border: "1.5px solid #ef4444" } : null),
  };

  return (
    <div
      className={shake ? "healup-forgot-field-wrap--shake" : undefined}
      style={{ position: "relative", display: "flex", alignItems: "center", borderRadius: 10 }}
    >
      <input
        id={id}
        name={name}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        style={baseInput}
      />
      {showLock ? (
        <span
          style={{
            position: "absolute",
            ...lockPos,
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            zIndex: 1,
          }}
          aria-hidden
        >
          <svg viewBox="0 0 24 24" width={ICON} height={ICON} fill="#9aa3b0">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
          </svg>
        </span>
      ) : null}
      <button
        type="button"
        onClick={onToggleShow}
        aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
        style={{
          position: "absolute",
          ...eyePos,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          display: "flex",
          alignItems: "center",
          zIndex: 2,
        }}
      >
        {showPassword ? (
          <svg viewBox="0 0 24 24" width={ICON} height={ICON}>
            <path
              d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
              fill="#9aa3b0"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width={ICON} height={ICON}>
            <path
              d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"
              stroke="#9aa3b0"
              strokeWidth={1.8}
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
