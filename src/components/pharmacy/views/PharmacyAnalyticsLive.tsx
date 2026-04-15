"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { pharmacyAnalyticsService, type PharmacyAnalytics } from "@/services/pharmacyAnalyticsService";

function formatEgp(n: number) {
  return `${n.toLocaleString("ar-EG", { maximumFractionDigits: 0 })} ج.م`;
}

export default function PharmacyAnalyticsLive() {
  const [data, setData] = useState<PharmacyAnalytics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    pharmacyAnalyticsService
      .get()
      .then(setData)
      .catch(() => setError("تعذر تحميل التحليلات. تأكد من تسجيل الدخول كصيدلية."));
  }, []);

  if (error) {
    return (
      <div dir="rtl" className="pharmacy-analytics-page">
        <p style={{ color: "#b91c1c", fontWeight: 700 }}>{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div dir="rtl" className="pharmacy-analytics-page">
        <p className="pharmacy-analytics-muted">جاري التحميل...</p>
      </div>
    );
  }

  const chartData = data.revenue_last_7_days.map((d) => ({
    name: d.name,
    value: Number(d.value),
  }));

  return (
    <div dir="rtl" className="pharmacy-analytics-page">
      <header className="pharmacy-subpage-header">
        <h1 className="pharmacy-subpage-title">تحليلات الطلبات</h1>
        <p className="pharmacy-subpage-desc">بيانات مباشرة من طلبات صيدليتك</p>
      </header>

      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon icon-blue">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
              </svg>
            </div>
          </div>
          <div className="stat-label">إجمالي الإيرادات</div>
          <div className="stat-value">{formatEgp(data.total_revenue)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon icon-green">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
          </div>
          <div className="stat-label">مكتمل اليوم</div>
          <div className="stat-value">{data.completed_today}</div>
        </div>
        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon icon-orange">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
          </div>
          <div className="stat-label">قيد التنفيذ</div>
          <div className="stat-value">{data.orders_in_progress}</div>
        </div>
        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon icon-light">
              <span style={{ fontSize: 11, fontWeight: 900, color: "#1a56db" }}>NEW</span>
            </div>
          </div>
          <div className="stat-label">طلبات جديدة (بانتظارك)</div>
          <div className="stat-value" style={{ color: "#0151ad" }}>
            {data.new_orders}
          </div>
        </div>
      </div>

      <div className="pharmacy-analytics-grid-split">
        <div className="pharmacy-analytics-chart-card">
          <h2 className="pharmacy-analytics-section-title">إيرادات آخر 7 أيام</h2>
          <div style={{ height: 300, width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="pharmacyRevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0151ad" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#0151ad" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis hide />
                <Tooltip
                  formatter={(v) => [formatEgp(Number(v ?? 0)), "الإيرادات"]}
                  contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", textAlign: "right" }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#0151ad"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#pharmacyRevGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="pharmacy-analytics-chart-card">
          <h2 className="pharmacy-analytics-section-title">أعلى الأدوية</h2>
          <ul className="pharmacy-analytics-top-list" style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {data.top_medicines.length === 0 ? (
              <li className="pharmacy-analytics-muted">لا توجد بيانات بعد.</li>
            ) : (
              data.top_medicines.map((m) => (
                <li key={m.medicine_name} className="pharmacy-analytics-top-row">
                  <span style={{ fontWeight: 600, color: "var(--text)" }}>{m.medicine_name}</span>
                  <span className="pharmacy-analytics-muted">{formatEgp(m.revenue)}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      <div className="pharmacy-analytics-chart-card">
        <h2 className="pharmacy-analytics-section-title">تفاصيل حسب الصنف</h2>
        <div style={{ overflowX: "auto" }}>
          <table className="pharmacy-analytics-table">
            <thead>
              <tr>
                <th>الصنف</th>
                <th>عدد الطلبات</th>
                <th>الإيرادات</th>
              </tr>
            </thead>
            <tbody>
              {data.category_breakdown.map((row) => (
                <tr key={row.name}>
                  <td style={{ fontWeight: 700, color: "#0151ad" }}>{row.name}</td>
                  <td>{row.orders}</td>
                  <td>{formatEgp(row.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
