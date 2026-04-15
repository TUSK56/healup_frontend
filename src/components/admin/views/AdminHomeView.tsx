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
import { adminService, type AdminPharmacyRow } from "@/services/adminService";

/** KPIs, chart, and recent orders are static (demo). Only «طلبات الصيدليات الجديدة» is live. */
const stats = [
  {
    title: "إجمالي المرضى",
    value: "١٢,٤٥٠",
    change: "+١٢٪",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "الصيدليات المسجلة",
    value: "٨٤٢",
    change: "+٥٪",
    icon: Store,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    title: "طلبات اليوم",
    value: "١٥٦",
    change: "+٨٪",
    icon: ClipboardList,
    color: "text-sky-600",
    bg: "bg-sky-50",
  },
  {
    title: "إجمالي الإيرادات",
    value: "٤٥,٠٠٠ ج.م",
    change: "+١٥٪",
    icon: Wallet,
    color: "text-blue-700",
    bg: "bg-blue-100",
  },
];

const chartData = [
  { name: "السبت", value: 40 },
  { name: "الأحد", value: 65 },
  { name: "الاثنين", value: 50 },
  { name: "الثلاثاء", value: 80 },
  { name: "الأربعاء", value: 112 },
  { name: "الخميس", value: 75 },
  { name: "الجمعة", value: 60 },
];

const recentOrders = [
  {
    id: "ORD-1245#",
    time: "منذ ٥ دقائق",
    status: "قيد التوصيل",
    statusColor: "bg-amber-100 text-amber-700",
    icon: ShoppingBag,
    iconColor: "text-blue-600",
  },
  {
    id: "ORD-1244#",
    time: "منذ ١٢ دقيقة",
    status: "مكتمل",
    statusColor: "bg-emerald-100 text-emerald-700",
    icon: CheckCircle,
    iconColor: "text-emerald-600",
  },
  {
    id: "ORD-1243#",
    time: "منذ ١٨ دقيقة",
    status: "قيد المعالجة",
    statusColor: "bg-orange-100 text-orange-700",
    icon: Clock,
    iconColor: "text-orange-600",
  },
];

export default function AdminHomeView() {
  const [pharmacies, setPharmacies] = useState<AdminPharmacyRow[]>([]);
  const [loadingPending, setLoadingPending] = useState(true);
  const [tableError, setTableError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const loadPharmacies = useCallback(async () => {
    setLoadingPending(true);
    setTableError(null);
    try {
      const data = await adminService.listPharmacies();
      setPharmacies(data.data);
    } catch {
      setTableError("تعذر تحميل طلبات الصيدليات. تحقق من الاتصال أو تسجيل الدخول.");
      setPharmacies([]);
    } finally {
      setLoadingPending(false);
    }
  }, []);

  useEffect(() => {
    void loadPharmacies();
  }, [loadPharmacies]);

  const pendingPharmacies = useMemo(
    () => pharmacies.filter((p) => p.status.toLowerCase() === "pending"),
    [pharmacies]
  );

  const approve = async (id: number) => {
    setBusyId(id);
    try {
      await adminService.approvePharmacy(id);
      await loadPharmacies();
      window.dispatchEvent(new Event("healup:notification"));
    } finally {
      setBusyId(null);
    }
  };

  const reject = async (id: number) => {
    setBusyId(id);
    try {
      await adminService.disablePharmacy(id);
      await loadPharmacies();
      window.dispatchEvent(new Event("healup:notification"));
    } finally {
      setBusyId(null);
    }
  };

  const chartMax = Math.max(...chartData.map((d) => d.value));

  return (
    <main className="flex min-w-0 flex-1 flex-col">
      <div className="space-y-8 p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
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
                <span className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600">{stat.change}</span>
              </div>
              <p className="mb-1 text-sm font-medium text-slate-500">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3">
            <div className="mb-8 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">اتجاهات الطلبات الأسبوعية</h3>
              <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-1">
                <button
                  type="button"
                  className="rounded-md bg-white px-3 py-1 text-xs font-bold text-slate-600 shadow-sm"
                >
                  آخر ٧ أيام
                </button>
                <button
                  type="button"
                  className="rounded-md px-3 py-1 text-xs font-bold text-slate-400 hover:text-slate-600"
                >
                  آخر ٣٠ يوم
                </button>
              </div>
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
                      <Cell key={`cell-${index}`} fill={entry.value > 100 ? "#0055B3" : "#E2E8F0"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">أحدث الطلبات النشطة</h3>
              <Link href="/admin/orders" className="text-sm font-bold text-blue-600 hover:underline">
                عرض الكل
              </Link>
            </div>
            <div className="flex flex-1 flex-col space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center gap-4 rounded-xl border border-slate-50 p-4 transition-colors hover:bg-slate-50"
                >
                  <div className="rounded-xl bg-blue-50 p-2.5">
                    <order.icon className={order.iconColor} size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900">{order.id}</p>
                    <p className="text-xs text-slate-400">{order.time}</p>
                  </div>
                  <span className={cn("rounded-lg px-2.5 py-1 text-[10px] font-bold", order.statusColor)}>{order.status}</span>
                </div>
              ))}
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
          {tableError ? <p className="px-6 pt-2 text-sm font-medium text-red-600">{tableError}</p> : null}
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
                {loadingPending ? (
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
                  pendingPharmacies.map((req) => (
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
