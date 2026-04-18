"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import { adminService, AdminPharmacy } from "@/services/adminService";

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

const chartData = [
  { name: "السبت", value: 40 },
  { name: "الأحد", value: 65 },
  { name: "الاثنين", value: 50 },
  { name: "الثلاثاء", value: 80 },
  { name: "الأربعاء", value: 112 },
  { name: "الخميس", value: 75 },
  { name: "الجمعة", value: 60 },
];

export default function AdminHomeView() {
  const [pharmacyRequests, setPharmacyRequests] = useState<AdminPharmacy[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [requestsError, setRequestsError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const pendingPharmacyRequests = useMemo(
    () => pharmacyRequests.filter((p) => p.status === "pending"),
    [pharmacyRequests]
  );

  useEffect(() => {
    let isMounted = true;

    const loadPharmacyRequests = async () => {
      setLoadingRequests(true);
      setRequestsError(null);
      try {
        const data = await adminService.listPharmacies();
        if (isMounted) {
          setPharmacyRequests(data);
        }
      } catch {
        if (isMounted) {
          setRequestsError("تعذر تحميل طلبات الصيدليات الجديدة.");
        }
      } finally {
        if (isMounted) {
          setLoadingRequests(false);
        }
      }
    };

    loadPharmacyRequests();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleApprove = async (id: number) => {
    setActionLoadingId(id);
    try {
      await adminService.approvePharmacy(id);
      setPharmacyRequests((prev) => prev.map((p) => (p.id === id ? { ...p, status: "approved" } : p)));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id: number) => {
    setActionLoadingId(id);
    try {
      await adminService.disablePharmacy(id);
      setPharmacyRequests((prev) => prev.map((p) => (p.id === id ? { ...p, status: "disabled" } : p)));
    } finally {
      setActionLoadingId(null);
    }
  };

  const formatLocation = (pharmacy: AdminPharmacy) => {
    const city = (pharmacy.city || "").trim();
    const district = (pharmacy.district || "").trim();
    if (city && district) return `${city}، ${district}`;
    if (city) return city;
    if (district) return district;
    return "غير محدد";
  };

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
                <span className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600">
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
              <button type="button" className="text-sm font-bold text-blue-600 hover:underline">
                عرض الكل
              </button>
            </div>
            <div className="flex flex-1 flex-col space-y-4">
              {recentOrders.map((order, i) => (
                <div
                  key={order.id}
                  className="flex items-center gap-4 rounded-xl border border-slate-50 p-4 transition-colors hover:bg-slate-50"
                >
                  <div className="rounded-xl bg-blue-50 p-2.5">
                    <order.icon className="text-blue-600" size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900">{order.id}</p>
                    <p className="text-xs text-slate-400">{order.time}</p>
                  </div>
                  <span className={cn("rounded-lg px-2.5 py-1 text-[10px] font-bold", order.statusColor)}>
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="mt-6 w-full rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50"
            >
              عرض كافة الطلبات
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-6">
            <h3 className="font-bold text-slate-900">طلبات الصيدليات الجديدة</h3>
            <button type="button" className="text-sm font-bold text-blue-600 hover:underline">
              عرض الكل
            </button>
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
                {loadingRequests ? (
                  <tr>
                    <td className="px-6 py-8 text-center text-sm text-slate-500" colSpan={5}>
                      جاري تحميل طلبات الصيدليات...
                    </td>
                  </tr>
                ) : requestsError ? (
                  <tr>
                    <td className="px-6 py-8 text-center text-sm text-red-600" colSpan={5}>
                      {requestsError}
                    </td>
                  </tr>
                ) : pendingPharmacyRequests.length === 0 ? (
                  <tr>
                    <td className="px-6 py-8 text-center text-sm text-slate-500" colSpan={5}>
                      لا توجد طلبات صيدليات جديدة حالياً.
                    </td>
                  </tr>
                ) : (
                  pendingPharmacyRequests.map((req) => (
                    <tr key={req.id} className="transition-colors hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-700">
                            {req.name.slice(0, 1)}
                          </div>
                          <span className="font-bold text-slate-900">{req.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{formatLocation(req)}</td>
                      <td className="px-6 py-4 font-mono text-sm text-slate-500">{req.license_number || "-"}</td>
                      <td className="px-6 py-4">
                        <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-600">
                          بانتظار المراجعة
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            disabled={actionLoadingId === req.id}
                            onClick={() => handleApprove(req.id)}
                            className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {actionLoadingId === req.id ? "..." : "قبول"}
                          </button>
                          <button
                            type="button"
                            disabled={actionLoadingId === req.id}
                            onClick={() => handleReject(req.id)}
                            className="rounded-lg bg-red-50 px-4 py-1.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
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
