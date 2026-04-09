"use client";
import React from "react";
import "./cart.css";

export default function PharmacyDashboardPage() {
  return (
    <div className="pharmacyDashboard">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <button className="logo-btn" type="button" aria-label="Healup logo">
            {/* Medical bag icon (matches other pages) */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
              <path d="M20 8h-4V6a2 2 0 00-2-2h-4a2 2 0 00-2 2v2H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V10a2 2 0 00-2-2z" />
              <path d="M12 8v8M8 12h8" />
            </svg>
          </button>
          <span className="logo-text">Healup</span>
        </div>

        <nav className="sidebar-nav">
          <a className="nav-item active" href="#">
            <div className="nav-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>
            <span>الرئيسية</span>
          </a>

          <a className="nav-item" style={{ justifyContent: "space-between" }} href="#">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div className="nav-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#94a3b8">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 7V3.5L18.5 9H13zm-4 5h6v1.5H9V14zm0 3h4v1.5H9V17z" />
                </svg>
              </div>
              <span>طلبات جديدة</span>
            </div>
            <span className="nav-badge">12</span>
          </a>

          <a className="nav-item" href="#">
            <div className="nav-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#94a3b8">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.5 5v5.25l4.5 2.67-.75 1.23L11 13V7h1.5z" />
              </svg>
            </div>
            <span>الطلبات الحالية</span>
          </a>

          <a className="nav-item" href="#">
            <div className="nav-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#94a3b8">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5l-4-4 1.41-1.41L10 13.67l6.59-6.59L18 8.5l-8 8z" />
              </svg>
            </div>
            <span>الطلبات المكتملة</span>
          </a>

          <a className="nav-item" href="#">
            <div className="nav-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#94a3b8">
                <path d="M5 20h2v-8H5v8zm4 0h2V4H9v16zm4 0h2v-5h-2v5zm4 0h2v-11h-2v11z" />
              </svg>
            </div>
            <span>التحليلات</span>
          </a>
        </nav>

        <div className="sidebar-footer">
          <div className="settings-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#94a3b8">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.49.49 0 00-.59-.22l-2.39.96a6.93 6.93 0 00-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
            </svg>
            <span>الإعدادات</span>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="main">
        {/* TOPBAR */}
        <header className="topbar">
          <div className="search-bar">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input type="text" placeholder="بحث عن مريض أو دواء..." />
          </div>

          <div className="topbar-right">
            <button className="topbar-icon-btn" type="button" style={{ position: "relative" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              <span className="bell-dot" />
            </button>

            <button className="topbar-icon-btn" type="button" title="تغيير اللغة">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 8l6 6" />
                <path d="M4 14l6-6 2-3" />
                <path d="M2 5h12" />
                <path d="M7 2h1" />
                <path d="M22 22l-5-10-5 10" />
                <path d="M14 18h6" />
              </svg>
            </button>

            <div style={{ width: 1, height: 32, background: "var(--border)", margin: "0 4px" }} />

            <div className="profile">
              <div className="profile-info">
                <div className="profile-name">صيدلية النهدي</div>
                <div className="profile-role">مدير الصيدلية</div>
              </div>
              <div className="profile-avatar">👨‍⚕️</div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="content">
          {/* STATS */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-top">
                <div className="stat-icon icon-light">
                  <span style={{ fontSize: 11, fontWeight: 900, color: "#1a56db", letterSpacing: "-0.5px" }}>NEW</span>
                </div>
                <span className="stat-badge badge-green">12%+</span>
              </div>
              <div className="stat-label">طلبات جديدة</div>
              <div className="stat-value">12</div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <div className="stat-icon icon-orange">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 019-9 9.75 9.75 0 016.74 2.74L21 8" />
                    <path d="M21 3v5h-5" />
                    <path d="M21 12a9 9 0 01-9 9 9.75 9.75 0 01-6.74-2.74L3 16" />
                    <path d="M8 16H3v5" />
                  </svg>
                </div>
                <span className="stat-badge badge-orange">نشط</span>
              </div>
              <div className="stat-label">طلبات قيد التنفيذ</div>
              <div className="stat-value">25</div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <div className="stat-icon icon-green">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <span className="stat-badge badge-green">48 اليوم</span>
              </div>
              <div className="stat-label">مكتمل اليوم</div>
              <div className="stat-value">48</div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <div className="stat-icon icon-blue">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="6" y="3" width="16" height="11" rx="2" />
                    <path d="M2 9v7a2 2 0 002 2h14" />
                    <circle cx="14" cy="8.5" r="2" />
                    <path d="M9 8.5h.01M19 8.5h.01" />
                  </svg>
                </div>
                <span className="stat-badge badge-green">5%+</span>
              </div>
              <div className="stat-label">إجمالي الإيرادات</div>
              <div className="stat-value">
                3,500 <span>ج.م</span>
              </div>
            </div>
          </div>

          {/* BOTTOM GRID */}
          <div className="bottom-grid">
            {/* NEW ORDERS TABLE */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 8l10 7 10-7" />
                    <rect x="2" y="6" width="20" height="14" rx="2" />
                  </svg>
                  <span className="section-title">طلبات جديدة</span>
                </div>
                <a href="#" style={{ fontSize: 12, color: "var(--blue)", textDecoration: "none", fontWeight: 600 }}>
                  عرض الكل
                </a>
              </div>

              <div className="section-card" style={{ paddingTop: 12 }}>
                <table className="orders-table" style={{ tableLayout: "fixed", width: "100%" }}>
                  <thead>
                    <tr>
                      <th style={{ width: "25%", textAlign: "center" }}>المريض</th>
                      <th style={{ width: "25%", textAlign: "center" }}>الدواء / الوصفة</th>
                      <th style={{ width: "20%", textAlign: "center" }}>الوقت</th>
                      <th style={{ width: "30%", textAlign: "center" }}>الإجراء</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ textAlign: "center" }}>
                        <div className="patient-row" style={{ justifyContent: "center" }}>
                          <div className="patient-avatar" style={{ background: "#fde68a" }}>
                            👤
                          </div>
                          <span>أحمد محمد</span>
                        </div>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <div className="med-row" style={{ justifyContent: "center" }}>
                          <div className="med-thumb">📋</div>
                          <span>وصفة طبية #442</span>
                        </div>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span className="time-text">منذ 5 دقائق</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                          <button className="pill pill-green" style={{ padding: "5px 12px", borderRadius: 8, border: "none", background: "#dcfce7", color: "#16a34a" }} type="button">
                            متوفر
                          </button>
                          <button className="pill pill-red" style={{ padding: "5px 12px", borderRadius: 8, border: "none", background: "#fee2e2", color: "#dc2626" }} type="button">
                            غير متوفر
                          </button>
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td style={{ textAlign: "center" }}>
                        <div className="patient-row" style={{ justifyContent: "center" }}>
                          <div className="patient-avatar" style={{ background: "#fca5a5" }}>
                            👤
                          </div>
                          <span>سارة أحمد</span>
                        </div>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <div className="med-row" style={{ justifyContent: "center" }}>
                          <div className="med-thumb">💊</div>
                          <span>بانادول اكسترا</span>
                        </div>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span className="time-text">منذ 12 دقيقة</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                          <button className="pill pill-green" style={{ padding: "5px 12px", borderRadius: 8, border: "none", background: "#dcfce7", color: "#16a34a" }} type="button">
                            متوفر
                          </button>
                          <button className="pill pill-red" style={{ padding: "5px 12px", borderRadius: 8, border: "none", background: "#fee2e2", color: "#dc2626" }} type="button">
                            غير متوفر
                          </button>
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td style={{ textAlign: "center" }}>
                        <div className="patient-row" style={{ justifyContent: "center" }}>
                          <div className="patient-avatar" style={{ background: "#d9f99d" }}>
                            👤
                          </div>
                          <span>خالد علي</span>
                        </div>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <div className="med-row" style={{ justifyContent: "center" }}>
                          <div className="med-thumb">🧴</div>
                          <span>أوجمنتين أجم</span>
                        </div>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span className="time-text">منذ 20 دقيقة</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                          <button className="pill pill-green" style={{ padding: "5px 12px", borderRadius: 8, border: "none", background: "#dcfce7", color: "#16a34a" }} type="button">
                            متوفر
                          </button>
                          <button className="pill pill-red" style={{ padding: "5px 12px", borderRadius: 8, border: "none", background: "#fee2e2", color: "#dc2626" }} type="button">
                            غير متوفر
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* ACTIVITY + BUTTONS */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="3" width="15" height="13" rx="2" />
                      <path d="M16 8h4l3 3v5h-7V8z" />
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                    <span className="section-title">نشاط حالي</span>
                  </div>
                </div>

                <div className="activity-card">
                  <div className="activity-list">
                    <div className="activity-item" style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <div className="activity-icon icon-delivery" style={{ marginTop: 18 }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 5H9L6 10H2l1 5h1" />
                            <path d="M6 10h8l2-5" />
                            <path d="M16 10l2 5h1" />
                            <circle cx="6" cy="17" r="2" />
                            <circle cx="18" cy="17" r="2" />
                            <path d="M8 17h8" />
                          </svg>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4, flex: 1 }}>
                          <span className="activity-title" style={{ margin: 0 }}>
                            طلب #9021 - خرج للتوصيل
                          </span>
                          <div className="activity-desc">المندوب: محمد فواد • متبقي 15 دقيقة</div>
                          <button className="activity-btn btn-track" type="button">
                            تتبع المسار
                          </button>
                        </div>

                        <span className="activity-time" style={{ alignSelf: "flex-start" }}>
                          10:45 ص
                        </span>
                      </div>
                    </div>

                    <div className="activity-item" style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <div className="activity-icon icon-ready" style={{ marginTop: 18 }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 8V21H3V8" />
                            <path d="M23 3H1l2 5h18l2-5z" />
                            <path d="M10 12h4" />
                          </svg>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4, flex: 1 }}>
                          <span className="activity-title" style={{ margin: 0 }}>
                            طلب #9018 - جاهز للاستلام
                          </span>
                          <div className="activity-desc">المريض: سحر إبراهيم • صيدلية فرع العليا</div>
                          <button className="activity-btn btn-confirm" type="button">
                            تأكيد الاستلام
                          </button>
                        </div>

                        <span className="activity-time" style={{ alignSelf: "flex-start" }}>
                          10:20 ص
                        </span>
                      </div>
                    </div>

                    <div className="activity-item" style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <div className="activity-icon icon-payment" style={{ marginTop: 10 }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0369a1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 2h16v20l-2-2-2 2-2-2-2 2-2-2V2z" />
                            <line x1="8" y1="8" x2="16" y2="8" />
                            <line x1="8" y1="12" x2="16" y2="12" />
                            <line x1="8" y1="16" x2="12" y2="16" />
                          </svg>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4, flex: 1 }}>
                          <span className="activity-title" style={{ margin: 0 }}>
                            دفع إلكتروني ناجح
                          </span>
                          <div className="activity-desc">تم سداد 120.00 ر.س للطلب #8990</div>
                        </div>

                        <span className="activity-time" style={{ alignSelf: "flex-start" }}>
                          09:55 ص
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bottom-btns">
                <button className="bottom-btn btn-add-stock" type="button">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span>إضافة مخزون</span>
                </button>

                <button className="bottom-btn btn-support" type="button">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 11C3 6.03 7.03 2 12 2s9 4.03 9 9" />
                    <rect x="2" y="11" width="3" height="6" rx="1.5" />
                    <rect x="19" y="11" width="3" height="6" rx="1.5" />
                    <path d="M21 17c0 2.21-1.79 4-4 4h-2" />
                    <circle cx="12" cy="21" r="1" fill="#1a56db" />
                  </svg>
                  <span>الدعم الفني</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

