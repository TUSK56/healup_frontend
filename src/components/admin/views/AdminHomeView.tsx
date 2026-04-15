"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  CheckCircle,
  Clock,
  Users,
  Store,
  ClipboardList,
  Wallet,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { formatRelativeTimeAr } from "@/lib/formatRelativeAr";
import {
  adminService,
  type AdminOrderRow,
  type AdminPharmacyRow,
  type AdminUserRow,
} from "@/services/adminService";

function orderStatusLabelAr(status: string): string {
  const s = status.trim().toLowerCase();
  if (s === "pending_pharmacy_confirmation" || s === "confirmed") return "قيد الانتظار";
  if (s === "preparing") return "قيد المعالجة";
  if (s === "out_for_delivery") return "قيد التوصيل";
  if (s === "ready_for_pickup") return "جاهز للاستلام";
  if (s === "completed") return "مكتمل";
  if (s === "rejected") return "مرفوض";
  return status || "—";
}

function orderStatusStyle(status: string): string {
  const s = status.trim().toLowerCase();
  if (s === "completed") return "bg-emerald-100 text-emerald-700";
  if (s === "out_for_delivery" || s === "ready_for_pickup") return "bg-amber-100 text-amber-700";
  if (s === "rejected") return "bg-rose-100 text-rose-700";
  if (s === "preparing") return "bg-orange-100 text-orange-700";
  return "bg-slate-100 text-slate-600";
}

function recentOrderIcon(status: string) {
  const s = status.trim().toLowerCase();
  if (s === "completed") return CheckCircle;
  if (s === "preparing" || s === "pending_pharmacy_confirmation" || s === "confirmed") return Clock;
  return ShoppingBag;
}

function last7DaysChart(orders: AdminOrderRow[]) {
  const result: { name: string; value: number }[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    const count = orders.filter((o) => {
      const t = new Date(o.created_at).getTime();
      return t >= d.getTime() && t < next.getTime();
    }).length;
    result.push({
      name: d.toLocaleDateString("ar-EG", { weekday: "short" }),
      value: count,
    });
  }
  return result;
}

export default function AdminHomeView() {
  const [patients, setPatients] = useState<AdminUserRow[]>([]);
  const [pharmacies, setPharmacies] = useState<AdminPharmacyRow[]>([]);
  const [orders, setOrders] = useState<AdminOrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [u, p, o] = await Promise.all([
        adminService.listUsers(),
        adminService.listPharmacies(),
        adminService.listOrders(),
      ]);
      setPatients(u.data);
      setPharmacies(p.data);
      setOrders(o.data);
    } catch {
      setError("تعذر تحميل لوحة التحكم. تأكد من تسجيل الدخول كمسؤول.");
      setPatients([]);
      setPharmacies([]);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const approvedPharmacies = useMemo(
    () => pharmacies.filter((p) => p.status.toLowerCase() === "approved").length,
    [pharmacies]
  );

  const stats = useMemo(() => {
    const patientCount = patients.length;
    const startToday = new Date();
    startToday.setHours(0, 0, 0, 0);
    const ordersToday = orders.filter((o) => new Date(o.created_at) >= startToday).length;
    const revenue = orders
      .filter((o) => o.status.trim().toLowerCase() === "completed")
      .reduce((sum, o) => sum + o.total_price, 0);
    return { patientCount, ordersToday, revenue };
  }, [patients, orders]);

  const chartData = useMemo(() => last7DaysChart(orders), [orders]);

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 3);
  }, [orders]);

  const pendingPharmacies = useMemo(
    () => pharmacies.filter((p) => p.status.toLowerCase() === "pending"),
    [pharmacies]
  );

  const approve = async (id: number) => {
    setBusyId(id);
    try {
      await adminService.approvePharmacy(id);
      await load();
      window.dispatchEvent(new Event("healup:notification"));
    } finally {
      setBusyId(null);
    }
  };

  const reject = async (id: number) => {
    setBusyId(id);
    try {
      await adminService.disablePharmacy(id);
      await load();
      window.dispatchEvent(new Event("healup:notification"));
    } finally {
      setBusyId(null);
    }
  };

  const fmt = (n: number) => n.toLocaleString("ar-EG", { maximumFractionDigits: 0 });

  const chartMax = useMemo(() => Math.max(0, ...chartData.map((d) => d.value)), [chartData]);

  return (
    <main className="flex min-w-0 flex-1 flex-col">
      <div className="space-y-8 p-8">
        {error ? <p className="font-bold text-red-600">{error}</p> : null}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "إجمالي المرضى",
              value: loading ? "…" : fmt(stats.patientCount),
              change: "من قاعدة البيانات",
              icon: Users,
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              title: "الصيدليات المعتمدة",
              value: loading ? "…" : fmt(approvedPharmacies),
              change: `إجمالي السجلات: ${loading ? "…" : fmt(pharmacies.length)}`,
              icon: Store,
              color: "text-indigo-600",
              bg: "bg-indigo-50",
            },
            {
              title: "طلبات اليوم",
              value: loading ? "…" : fmt(stats.ordersToday),
              change: "منذ منتصف الليل (التوقيت المحلي)",
              icon: ClipboardList,
              color: "text-sky-600",
              bg: "bg-sky-50",
            },
            {
              title: "إيرادات مكتملة",
              value: loading ? "…" : `${fmt(stats.revenue)} ج.م`,
              change: "مجموع الطلبات المكتملة",
              icon: Wallet,
              color: "text-blue-700",
              bg: "bg-blue-100",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className={cn("rounded-xl p-3", stat.bg)}>
                  <stat.icon className={stat.color} size={24} />
                </div>
                <span className="max-w-[140px] rounded-lg bg-slate-50 px-2 py-1 text-[10px] font-bold text-slate-500">
                  {stat.change}
                </span>
              </div>
              <p className="mb-1 text-sm font-medium text-slate-500">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3">
            <div className="mb-8 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">اتجاهات الطلبات (آخر ٧ أيام)</h3>
            </div>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 500 }}
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white shadow-xl">
                            {String(payload[0].value)} طلب
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={chartMax > 0 && entry.value === chartMax ? "#0055B3" : "#E2E8F0"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">أحدث الطلبات</h3>
              <Link href="/admin/orders" className="text-sm font-bold text-blue-600 hover:underline">
                عرض الكل
              </Link>
            </div>
            <div className="flex flex-1 flex-col space-y-4">
              {loading ? (
                <p className="text-sm text-slate-500">جاري التحميل…</p>
              ) : recentOrders.length === 0 ? (
                <p className="text-sm text-slate-500">لا توجد طلبات بعد.</p>
              ) : (
                recentOrders.map((order) => {
                  const Icon = recentOrderIcon(order.status);
                  return (
                    <div
                      key={order.id}
                      className="flex items-center gap-4 rounded-xl border border-slate-50 p-4 transition-colors hover:bg-slate-50"
                    >
                      <div className="rounded-xl bg-blue-50 p-2.5">
                        <Icon className="text-blue-600" size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900">#{order.id}</p>
                        <p className="text-xs text-slate-400">{formatRelativeTimeAr(order.created_at)}</p>
                      </div>
                      <span className={cn("rounded-lg px-2.5 py-1 text-[10px] font-bold", orderStatusStyle(order.status))}>
                        {orderStatusLabelAr(order.status)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
            <Link
              href="/admin/orders"
              className="mt-6 block w-full rounded-xl border border-slate-200 py-3 text-center text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50"
            >
              عرض كافة الطلبات
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-6">
            <h3 className="font-bold text-slate-900">طلبات الصيدليات الجديدة</h3>
            <Link href="/admin/pharmacies" className="text-sm font-bold text-blue-600 hover:underline">
              عرض الكل
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-slate-50/50 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4">اسم الصيدلية</th>
                  <th className="px-6 py-4">الموقع</th>
                  <th className="px-6 py-4">رقم الترخيص</th>
                  <th className="px-6 py-4">الحالة</th>
                  <th className="px-6 py-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      جاري التحميل…
                    </td>
                  </tr>
                ) : pendingPharmacies.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      لا توجد صيدليات بانتظار المراجعة.
                    </td>
                  </tr>
                ) : (
                  pendingPharmacies.slice(0, 8).map((req) => (
                    <tr key={req.id} className="transition-colors hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-700">
                            {req.name.trim().charAt(0) || "؟"}
                          </div>
                          <span className="font-bold text-slate-900">{req.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">—</td>
                      <td className="px-6 py-4 font-mono text-sm text-slate-500">{req.license_number ?? "—"}</td>
                      <td className="px-6 py-4">
                        <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-600">
                          بانتظار المراجعة
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            disabled={busyId === req.id}
                            className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                            onClick={() => void approve(req.id)}
                          >
                            قبول
                          </button>
                          <button
                            type="button"
                            disabled={busyId === req.id}
                            className="rounded-lg bg-red-50 px-4 py-1.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
                            onClick={() => void reject(req.id)}
                          >
                            رفض
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
