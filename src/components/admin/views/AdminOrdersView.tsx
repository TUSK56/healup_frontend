"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  ShoppingBag,
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { adminService, type AdminOrderRow } from "@/services/adminService";

type UiStatusKey =
  | "pending"
  | "preparing"
  | "shipping"
  | "delivered"
  | "cancelled"
  | "other";

function mapOrderStatus(status: string): UiStatusKey {
  const s = status.trim().toLowerCase();
  if (s === "pending_pharmacy_confirmation" || s === "confirmed") return "pending";
  if (s === "preparing") return "preparing";
  if (s === "out_for_delivery" || s === "ready_for_pickup") return "shipping";
  if (s === "completed") return "delivered";
  if (s === "rejected") return "cancelled";
  return "other";
}

function StatusBadge({ status }: { status: string }) {
  const key = mapOrderStatus(status);
  const configs: Record<UiStatusKey, { label: string; classes: string }> = {
    pending: { label: "قيد الانتظار", classes: "bg-[#FEF3C7] text-[#AB6D3E] border-[#FEF3C7]" },
    preparing: { label: "جاري التحضير", classes: "bg-[#DBEAFE] text-[#2244B8] border-[#DBEAFE]" },
    shipping: { label: "قيد التوصيل / استلام", classes: "bg-[#E0E7FF] text-[#3930A7] border-[#E0E7FF]" },
    delivered: { label: "تم التسليم", classes: "bg-[#D1FAE5] text-[#107057] border-[#D1FAE5]" },
    cancelled: { label: "مرفوض / ملغى", classes: "bg-[#FFE4E6] text-[#A81F48] border-[#FFE4E6]" },
    other: { label: status || "—", classes: "bg-slate-100 text-slate-600 border-slate-100" },
  };
  const config = configs[key];
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${config.classes}`}>{config.label}</span>
  );
}

function inTimeRange(iso: string, range: string): boolean {
  if (range === "all") return true;
  const t = new Date(iso).getTime();
  const now = Date.now();
  if (range === "today") {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return t >= start.getTime();
  }
  if (range === "7d") return t >= now - 7 * 24 * 60 * 60 * 1000;
  if (range === "30d") return t >= now - 30 * 24 * 60 * 60 * 1000;
  return true;
}

export default function AdminOrdersView() {
  const [orders, setOrders] = useState<AdminOrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.listOrders();
      setOrders(data.data);
    } catch {
      setError("تعذر تحميل الطلبات. تأكد من تسجيل الدخول كمسؤول.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const stats = useMemo(() => {
    const total = orders.length;
    const active = orders.filter((o) => {
      const k = mapOrderStatus(o.status);
      return k !== "delivered" && k !== "cancelled";
    }).length;
    const completed = orders.filter((o) => mapOrderStatus(o.status) === "delivered").length;
    const cancelled = orders.filter((o) => mapOrderStatus(o.status) === "cancelled").length;
    return { total, active, completed, cancelled };
  }, [orders]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return orders.filter((o) => {
      if (!inTimeRange(o.created_at, timeRange)) return false;
      if (statusFilter !== "all") {
        const k = mapOrderStatus(o.status);
        if (statusFilter === "pending" && k !== "pending") return false;
        if (statusFilter === "preparing" && k !== "preparing") return false;
        if (statusFilter === "shipping" && k !== "shipping") return false;
        if (statusFilter === "delivered" && k !== "delivered") return false;
        if (statusFilter === "cancelled" && k !== "cancelled") return false;
      }
      if (!q) return true;
      const idStr = String(o.id);
      const patient = o.patient?.name?.toLowerCase() ?? "";
      const pharmacy = o.pharmacy?.name?.toLowerCase() ?? "";
      return idStr.includes(q) || patient.includes(q) || pharmacy.includes(q);
    });
  }, [orders, searchQuery, statusFilter, timeRange]);

  return (
    <div className="flex min-w-0 flex-1 flex-col bg-[#F8FAFC]">
      <main className="w-full min-w-0 px-6 py-8 sm:px-8 sm:py-10 lg:px-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[#0355AE]">إدارة طلبات الأدوية</h1>
          <p className="mt-2 text-slate-500">بيانات مباشرة من قاعدة البيانات</p>
        </div>

        {error ? <p className="mb-6 font-bold text-red-600">{error}</p> : null}

        <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "إجمالي الطلبات", value: loading ? "…" : String(stats.total), change: null as string | null, icon: ShoppingBag, bgColor: "#E5EEF7", textColor: "#0456AE" },
            { label: "طلبات نشطة", value: loading ? "…" : String(stats.active), change: null, icon: Clock, bgColor: "#FEF5E6", textColor: "#AB6D3E" },
            { label: "طلبات مكتملة", value: loading ? "…" : String(stats.completed), change: null, icon: CheckCircle2, bgColor: "#E7F8F2", textColor: "#107057" },
            { label: "طلبات مرفوضة", value: loading ? "…" : String(stats.cancelled), change: null, icon: XCircle, bgColor: "#FEEBEF", textColor: "#A81F48" },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="rounded-xl p-3" style={{ backgroundColor: stat.bgColor, color: stat.textColor }}>
                  <stat.icon className="h-6 w-6" />
                </div>
                {stat.change && (
                  <span className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600">{stat.change}</span>
                )}
              </div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col items-center gap-4 border-b border-slate-100 p-6 lg:flex-row">
            <div className="relative w-full flex-1">
              <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="البحث برقم الطلب، اسم المريض أو الصيدلية..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-12 text-sm transition-all focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto">
              <select
                className="min-w-[140px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">كل الحالات</option>
                <option value="pending">قيد الانتظار</option>
                <option value="preparing">جاري التحضير</option>
                <option value="shipping">قيد التوصيل</option>
                <option value="delivered">تم التسليم</option>
                <option value="cancelled">مرفوض / ملغى</option>
              </select>
              <select
                className="min-w-[140px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="all">كل الفترات</option>
                <option value="today">اليوم</option>
                <option value="7d">آخر 7 أيام</option>
                <option value="30d">آخر 30 يوم</option>
              </select>
              <button
                type="button"
                className="flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-lg transition-colors hover:bg-brand/90"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setTimeRange("all");
                }}
              >
                <Filter className="h-4 w-4" />
                إعادة الضبط
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-slate-50/50 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">رقم الطلب</th>
                  <th className="px-6 py-4">اسم المريض</th>
                  <th className="px-6 py-4">الصيدلية</th>
                  <th className="px-6 py-4">التاريخ</th>
                  <th className="px-6 py-4">الموقع</th>
                  <th className="px-6 py-4">السعر الإجمالي</th>
                  <th className="px-6 py-4">الحالة</th>
                  <th className="px-6 py-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-slate-500">
                      جاري التحميل…
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-slate-500">
                      لا توجد طلبات مطابقة.
                    </td>
                  </tr>
                ) : (
                  filtered.map((order, idx) => {
                    const created = new Date(order.created_at);
                    return (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: Math.min(idx * 0.03, 0.4) }}
                        className="group transition-colors hover:bg-slate-50/80"
                      >
                        <td className="px-6 py-5">
                          <span className="font-bold text-brand">#{order.id}</span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="font-medium text-slate-900">{order.patient?.name ?? "—"}</span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-sm text-slate-600">{order.pharmacy?.name ?? "—"}</span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-900">
                              {created.toLocaleDateString("ar-EG")}
                            </span>
                            <span className="mt-0.5 text-[10px] text-slate-400">
                              {created.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-sm text-slate-400">—</span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="font-bold text-slate-900">
                            {order.total_price.toLocaleString("ar-EG", { maximumFractionDigits: 2 })} ج.م
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-6 py-5 text-center">
                          <button
                            type="button"
                            className="inline-flex items-center gap-2 text-xs font-bold text-brand transition-colors hover:text-brand/80"
                          >
                            <Eye className="h-4 w-4" />
                            التفاصيل
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 p-6 sm:flex-row">
            <p className="text-sm text-slate-500">
              عرض <span className="font-bold text-slate-900">{filtered.length}</span> من أصل{" "}
              <span className="font-bold text-slate-900">{orders.length}</span> طلب
            </p>
            <div className="flex items-center gap-2 opacity-30">
              <ChevronRight className="h-5 w-5" />
              <ChevronLeft className="h-5 w-5" />
            </div>
          </div>
        </div>
        <footer className="mt-10 border-t border-slate-200/80 pt-8 text-center sm:mt-12">
          <p className="text-xs text-slate-400">© Healup — إدارة الطلبات</p>
        </footer>
      </main>
    </div>
  );
}
