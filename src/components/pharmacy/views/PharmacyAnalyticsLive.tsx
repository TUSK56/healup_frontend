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
      <div className="min-h-screen bg-slate-50 p-8" dir="rtl">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 p-8" dir="rtl">
        <p className="text-slate-500">جاري التحميل...</p>
      </div>
    );
  }

  const chartData = data.revenue_last_7_days.map((d) => ({
    name: d.name,
    value: Number(d.value),
  }));

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans" dir="rtl">
      <main className="mx-auto max-w-7xl space-y-8 p-4 md:p-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">تحليلات الطلبات</h1>
          <p className="text-slate-500">بيانات مباشرة من طلبات صيدليتك</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">إجمالي الإيرادات</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{formatEgp(data.total_revenue)}</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">مكتمل اليوم</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{data.completed_today}</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">قيد التنفيذ</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{data.orders_in_progress}</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">طلبات جديدة (بانتظارك)</p>
            <p className="mt-2 text-2xl font-bold text-[#0456AE]">{data.new_orders}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-900">إيرادات آخر 7 أيام</h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0456AE" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#0456AE" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <YAxis hide />
                  <Tooltip
                    formatter={(v) => [formatEgp(Number(v ?? 0)), "الإيرادات"]}
                    contentStyle={{ borderRadius: 12, border: "none", textAlign: "right" }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#0456AE" strokeWidth={2} fillOpacity={1} fill="url(#revGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-900">أعلى الأدوية</h2>
            <ul className="space-y-4">
              {data.top_medicines.length === 0 ? (
                <li className="text-sm text-slate-500">لا توجد بيانات بعد.</li>
              ) : (
                data.top_medicines.map((m) => (
                  <li key={m.medicine_name} className="flex justify-between gap-2 text-sm">
                    <span className="font-medium text-slate-800">{m.medicine_name}</span>
                    <span className="text-slate-500">{formatEgp(m.revenue)}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-slate-900">تفاصيل حسب الصنف</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500">
                  <th className="pb-2">الصنف</th>
                  <th className="pb-2">عدد الطلبات</th>
                  <th className="pb-2">الإيرادات</th>
                </tr>
              </thead>
              <tbody>
                {data.category_breakdown.map((row) => (
                  <tr key={row.name} className="border-b border-slate-50">
                    <td className="py-3 font-medium text-[#0456AE]">{row.name}</td>
                    <td className="py-3">{row.orders}</td>
                    <td className="py-3">{formatEgp(row.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
