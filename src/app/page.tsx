"use client";

import React from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useI18n } from "@/i18n/I18nContext";

export default function HomePage() {
  const { t, dir } = useI18n();
  const year = new Date().getFullYear();

  return (
    <div
      dir={dir}
      style={{
        fontFamily: "var(--font-cairo), Cairo, sans-serif",
        background: "#f0f4f7",
        color: "#1a2e4a",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* NAVBAR */}
      <nav
        style={{
          background: "#fff",
          padding: "14px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: dir === "rtl" ? "row-reverse" : "row",
          boxShadow: "0 1px 8px rgba(0,0,0,0.07)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <LanguageSwitcher compact />
          <div
            style={{
              width: 40,
              height: 40,
              background: "#f5cba7",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg viewBox="0 0 24 24" style={{ width: 22, height: 22, fill: "#b5651d" }}>
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 42,
              height: 42,
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
          <span style={{ fontSize: 20, fontWeight: 900, color: "#1a2e4a", direction: dir }}>
            هيل أب <span style={{ color: "#2356c8" }}>Healup</span>
          </span>
        </div>
      </nav>
      {/* HERO */}
      <section style={{ textAlign: "center", padding: "60px 20px 40px" }}>
        <h1 style={{ fontSize: 38, fontWeight: 900, color: "#1a2e4a", marginBottom: 14, lineHeight: 1.4 }}>
          {t("landing.chooseAccountTitle")}
        </h1>
        <p style={{ fontSize: 15, color: "#6b7a8d", fontWeight: 400 }}>{t("landing.chooseAccountSubtitle")}</p>
      </section>
      {/* CARDS */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 40,
          padding: "10px 40px 60px",
          flexWrap: "wrap",
        }}
      >
        {/* Patient Card */}
        <div
          style={{
            background: "#fff",
            borderRadius: 28,
            width: 440,
            minHeight: 420,
            boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            margin: "20px 0",
          }}
        >
          <div
            style={{
              width: "100%",
              height: 260,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              background: "#b3d4e8",
            }}
          >
            <img
              src="/images/patient.png"
              alt={t("landing.patientAlt")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 0,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(36, 104, 180, 0.32)",
                zIndex: 1,
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 14,
                right: 14,
                width: 52,
                height: 52,
                background: "#fff",
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.18)",
                zIndex: 1,
              }}
            >
              <svg viewBox="0 0 24 24" fill="#1a4a8a" style={{ width: 28, height: 28 }}>
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            </div>
          </div>
          <div style={{ padding: "24px 20px 26px", flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 10, textAlign: dir === "rtl" ? "right" : "left" }}>
              {t("landing.patientLoginTitle")}
            </div>
            <div
              style={{
                fontSize: 13.5,
                color: "#6b7a8d",
                lineHeight: 1.8,
                textAlign: dir === "rtl" ? "right" : "left",
                flex: 1,
              }}
            >
              {t("landing.patientLoginDesc")}
            </div>
            <a
              href="/patient-login"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                marginTop: 22,
                padding: "14px 20px",
                border: "none",
                borderRadius: 12,
                fontFamily: "var(--font-cairo), Cairo, sans-serif",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                color: "white",
                width: "100%",
                background: "#1a4a8a",
                direction: dir,
                textDecoration: "none",
              }}
            >
              {t("landing.patientCta")}
              <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: "white", flexShrink: 0 }}>
                <path d="M4 12l8-8v5h8v6h-8v5l-8-8z" />
              </svg>
            </a>
          </div>
        </div>
        {/* Pharmacy Card */}
        <div
          style={{
            background: "#fff",
            borderRadius: 28,
            width: 440,
            minHeight: 420,
            boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            margin: "20px 0",
          }}
        >
          <div
            style={{
              width: "100%",
              height: 260,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              background: "#80cbc4",
            }}
          >
            <img
              src="/images/pharmcy.png"
              alt={t("landing.pharmacyAlt")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 0,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(39, 174, 96, 0.22)",
                zIndex: 1,
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 14,
                right: 14,
                width: 52,
                height: 52,
                background: "#fff",
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.18)",
                zIndex: 1,
              }}
            >
              <svg viewBox="0 0 24 24" fill="#27ae60" style={{ width: 28, height: 28 }}>
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 9h-4v4h-2v-4H7v-2h4V6h2v4h4v2z" />
              </svg>
            </div>
          </div>
          <div style={{ padding: "24px 20px 26px", flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 10, textAlign: dir === "rtl" ? "right" : "left" }}>
              {t("landing.pharmacyLoginTitle")}
            </div>
            <div
              style={{
                fontSize: 13.5,
                color: "#6b7a8d",
                lineHeight: 1.8,
                textAlign: dir === "rtl" ? "right" : "left",
                flex: 1,
              }}
            >
              {t("landing.pharmacyLoginDesc")}
            </div>
            <a
              href="/pharmacy-login"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                marginTop: 22,
                padding: "14px 20px",
                border: "none",
                borderRadius: 12,
                fontFamily: "var(--font-cairo), Cairo, sans-serif",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                color: "white",
                width: "100%",
                background: "#27ae60",
                direction: dir,
                textDecoration: "none",
              }}
            >
              {t("landing.pharmacyCta")}
              <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: "white", flexShrink: 0 }}>
                <path d="M4 12l8-8v5h8v6h-8v5l-8-8z" />
              </svg>
            </a>
          </div>
        </div>
        {/* Admin Card */}
        <div
          style={{
            background: "#fff",
            borderRadius: 28,
            width: 440,
            minHeight: 420,
            boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            margin: "20px 0",
          }}
        >
          <div
            style={{
              width: "100%",
              height: 260,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              background: "#607d8b",
            }}
          >
            <img
              src="/images/admin.png"
              alt={t("landing.adminAlt")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 0,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(30, 40, 60, 0.32)",
                zIndex: 1,
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 14,
                right: 14,
                width: 52,
                height: 52,
                background: "#fff",
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.18)",
                zIndex: 1,
              }}
            >
              <svg viewBox="0 0 24 24" fill="#1a2e4a" style={{ width: 28, height: 28 }}>
                <path d="M12 2L4 5v6c0 5.25 3.4 10.15 8 11.35C16.6 21.15 20 16.25 20 11V5l-8-3z" />
              </svg>
            </div>
          </div>
          <div style={{ padding: "24px 20px 26px", flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 10, textAlign: dir === "rtl" ? "right" : "left" }}>
              {t("landing.adminLoginTitle")}
            </div>
            <div
              style={{
                fontSize: 13.5,
                color: "#6b7a8d",
                lineHeight: 1.8,
                textAlign: dir === "rtl" ? "right" : "left",
                flex: 1,
              }}
            >
              {t("landing.adminLoginDesc")}
            </div>
            <a
              href="/admin-login"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                marginTop: 22,
                padding: "14px 20px",
                border: "none",
                borderRadius: 12,
                fontFamily: "var(--font-cairo), Cairo, sans-serif",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                color: "white",
                width: "100%",
                background: "#1a2e4a",
                direction: dir,
                textDecoration: "none",
              }}
            >
              {t("landing.adminCta")}
              <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: "white", flexShrink: 0 }}>
                <path d="M4 12l8-8v5h8v6h-8v5l-8-8z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      {/* FOOTER */}
      <footer
        style={{
          marginTop: "auto",
          background: "#fff",
          padding: "18px 40px",
          textAlign: "center",
          borderTop: "1px solid #e8edf2",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 32, marginBottom: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: "#1a2e4a" }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#e0f4f4",
              }}
            >
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#1a8a8a" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            {t("landing.footerSecure")}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: "#1a2e4a" }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#e0f4f4",
              }}
            >
              <svg width={16} height={16} viewBox="0 0 24 24" fill="#1a8a8a">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5c-2.49-1.24-4-3.53-4-6.5h2c0 2 1.01 3.75 2.5 4.77L8 14.5zm1.5-5.5c-.83 0-1.5-.67-1.5-1.5S10.67 8 11.5 8s1.5.67 1.5 1.5S12.33 9 11.5 9zm3 5.5l-2.5-.23C13.49 13.25 14.5 11.5 14.5 9.5h2c0 2.97-1.51 5.26-4 6.5zm-1-5.5c-.83 0-1.5-.67-1.5-1.5S12.67 8 13.5 8s1.5.67 1.5 1.5S14.33 9 13.5 9z" />
              </svg>
            </div>
            {t("landing.footerSupport")}
          </div>
        </div>
        <p style={{ fontSize: 12, color: "#6b7a8d" }}>
          {t("common.copyrightHealup", { year, brand: "Healup" })}
        </p>
      </footer>
    </div>
  );
}
