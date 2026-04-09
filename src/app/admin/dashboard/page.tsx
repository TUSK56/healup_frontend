"use client";
import React from "react";

export default function AdminDashboardPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f4f7", fontFamily: "Cairo, sans-serif" }}>
      <div style={{ background: "#fff", borderRadius: 24, boxShadow: "0 8px 32px rgba(0,0,0,0.10)", padding: "60px 48px", textAlign: "center" }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: "#1a2e4a", marginBottom: 18 }}>لوحة تحكم الإدارة</h1>
        <p style={{ fontSize: 16, color: "#6b7a8d" }}>مرحباً بك في لوحة تحكم الإدارة. يمكنك الآن مراقبة الأداء، إدارة المستخدمين، وضمان جودة الخدمة.</p>
      </div>
    </div>
  );
}
