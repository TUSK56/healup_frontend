"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/services/apiService";
import PharmacySidebar from "@/components/pharmacy/PharmacySidebar";
import PharmacyTopNavbar from "@/components/pharmacy/PharmacyTopNavbar";
import "./cart.css";

export default function PharmacyDashboardPage() {
  const router = useRouter();
  const [nowTick, setNowTick] = React.useState(0);
  const parseServerDate = React.useCallback((value: string) => {
    const v = (value || "").trim();
    if (!v) return new Date(0);
    if (/[zZ]$/.test(v) || /[+-]\d\d:\d\d$/.test(v)) return new Date(v);
    return new Date(`${v}Z`);
  }, []);
  const [newRequests, setNewRequests] = React.useState<
    Array<{
      id: number;
      patient_name: string;
      medicine_title: string;
      created_at: string;
    }>
  >([]);
  const [incomingTotal, setIncomingTotal] = React.useState(0);

  const loadIncoming = React.useCallback(async () => {
    try {
      const res = await api.get<{
        data: Array<{
          request: {
            id: number;
            created_at: string;
            patient: { name: string };
            medicines: Array<{ medicine_name: string }>;
            prescription_url: string | null;
          };
        }>;
      }>("/pharmacy/requests");

      const sorted = [...(res.data.data || [])].sort(
        (a, b) =>
          parseServerDate(b.request.created_at).getTime() -
          parseServerDate(a.request.created_at).getTime(),
      );
      setIncomingTotal(sorted.length);
      const rows = sorted.slice(0, 8).map((entry) => {
        const request = entry.request;
        const firstMedicine = request.medicines?.[0]?.medicine_name;
        return {
          id: request.id,
          patient_name: request.patient?.name || "مريض",
          medicine_title: firstMedicine || (request.prescription_url ? "وصفة طبية" : "طلب دواء"),
          created_at: request.created_at,
        };
      });
      setNewRequests(rows);
    } catch {
      setNewRequests([]);
      setIncomingTotal(0);
    }
  }, [parseServerDate]);

  React.useEffect(() => {
    void loadIncoming();
    const timer = window.setInterval(() => setNowTick((x) => x + 1), 30000);
    return () => window.clearInterval(timer);
  }, [loadIncoming]);

  return (
    <div className="pharmacyDashboard">
      <PharmacySidebar active="home" />

      <div className="main" style={{ padding: 0 }}>
        <PharmacyTopNavbar />

        <div className="pharmacy-content-shell">
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
              <div className="stat-value">{incomingTotal}</div>
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
                <Link href="/pharmacy-dashboard/new-orders" style={{ fontSize: 12, color: "var(--blue)", textDecoration: "none", fontWeight: 600 }}>
                  عرض الكل
                </Link>
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
                    {newRequests.map((row, idx) => (
                      <tr key={row.id}>
                        <td style={{ textAlign: "center" }}>
                          <div className="patient-row" style={{ justifyContent: "center" }}>
                            <div className="patient-avatar" style={{ background: idx % 2 === 0 ? "#fde68a" : "#d9f99d" }}>👤</div>
                            <span>{row.patient_name}</span>
                          </div>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <div className="med-row" style={{ justifyContent: "center" }}>
                            <div className="med-thumb">📋</div>
                            <span>{row.medicine_title}</span>
                          </div>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <span className="time-text">
                            {(() => {
                              // reference nowTick so it updates live
                              void nowTick;
                              const created = parseServerDate(row.created_at).getTime();
                              const diffMs = Math.max(0, Date.now() - created);
                              const sec = Math.floor(diffMs / 1000);
                              if (sec < 60) return "الآن";
                              const minutes = Math.floor(sec / 60);
                              if (minutes < 60) return minutes === 1 ? "منذ دقيقة" : `منذ ${minutes} دقيقة`;
                              const hours = Math.floor(minutes / 60);
                              if (hours < 24) return hours === 1 ? "منذ ساعة" : `منذ ${hours} ساعة`;
                              const days = Math.floor(hours / 24);
                              return days === 1 ? "منذ يوم" : `منذ ${days} يوم`;
                            })()}
                          </span>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                            <button
                              className="pill pill-green"
                              style={{ padding: "5px 12px", borderRadius: 8, border: "none", background: "#dcfce7", color: "#16a34a" }}
                              type="button"
                              onClick={() => router.push(`/pharmacy-dashboard/new-orders?openRequestId=${row.id}`)}
                            >
                              متوفر
                            </button>
                            <button
                              className="pill pill-red"
                              style={{ padding: "5px 12px", borderRadius: 8, border: "none", background: "#fee2e2", color: "#dc2626" }}
                              type="button"
                              onClick={() => {
                                void (async () => {
                                  try {
                                    await api.post(`/pharmacy/requests/${row.id}/decline`);
                                    await loadIncoming();
                                  } catch {
                                    // no-op
                                  }
                                })();
                              }}
                            >
                              غير متوفر
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {newRequests.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ textAlign: "center", color: "#64748b", padding: "14px" }}>
                          لا توجد طلبات جديدة حالياً.
                        </td>
                      </tr>
                    ) : null}
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
    </div>
  );
}

