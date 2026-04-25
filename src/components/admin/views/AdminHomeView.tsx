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
import Link from "next/link";
import { cn } from "@/lib/utils";
import { adminService, AdminOrder, AdminPharmacy } from "@/services/adminService";
import { useLocale } from "@/contexts/LocaleContext";

type DashboardOrder = {
  id: number;
  created_at: string;
  statusText: string;
  statusColor: string;
  icon: typeof ShoppingBag;
  iconColor: string;
};

function toRelativeText(value: string, t: (key: string, fallback?: string) => string): string {
  const d = new Date(value);
  if (!Number.isFinite(d.getTime())) return t("admin.home.justNow", "Just now");
  const mins = Math.max(0, Math.floor((Date.now() - d.getTime()) / 60000));
  if (mins < 1) return t("admin.home.justNow", "Just now");
  if (mins < 60) {
    const template = t("admin.home.minutesAgo", "{count} min ago");
    return template.replace("{count}", String(mins));
  }
  const h = Math.floor(mins / 60);
  if (h < 24) {
    const template = t("admin.home.hoursAgo", "{count} h ago");
    return template.replace("{count}", String(h));
  }
  const days = Math.floor(h / 24);
  const template = t("admin.home.daysAgo", "{count} d ago");
  return template.replace("{count}", String(days));
}

function mapStatus(status: string, t: (key: string, fallback?: string) => string): { text: string; color: string; icon: typeof ShoppingBag; iconColor: string } {
  switch ((status || "").toLowerCase()) {
    case "pending_pharmacy_confirmation":
      return {
        text: t("admin.home.statusPendingPharmacyConfirmation", "Waiting for pharmacy confirmation"),
        color: "bg-amber-100 text-amber-700",
        icon: Clock,
        iconColor: "text-orange-600",
      };
    case "confirmed":
      return {
        text: t("admin.home.statusConfirmed", "Confirmed"),
        color: "bg-blue-100 text-blue-700",
        icon: ShoppingBag,
        iconColor: "text-blue-600",
      };
    case "preparing":
      return {
        text: t("admin.home.statusPreparing", "Preparing"),
        color: "bg-orange-100 text-orange-700",
        icon: Clock,
        iconColor: "text-orange-600",
      };
    case "out_for_delivery":
      return {
        text: t("admin.home.statusOutForDelivery", "Out for delivery"),
        color: "bg-amber-100 text-amber-700",
        icon: ShoppingBag,
        iconColor: "text-blue-600",
      };
    case "ready_for_pickup":
      return {
        text: t("admin.home.statusReadyForPickup", "Ready for pickup"),
        color: "bg-blue-100 text-blue-700",
        icon: CheckCircle,
        iconColor: "text-emerald-600",
      };
    case "completed":
      return {
        text: t("admin.home.statusCompleted", "Completed"),
        color: "bg-emerald-100 text-emerald-700",
        icon: CheckCircle,
        iconColor: "text-emerald-600",
      };
    default:
      return {
        text: status || t("admin.home.statusUnknown", "Unknown"),
        color: "bg-slate-100 text-slate-600",
        icon: ShoppingBag,
        iconColor: "text-blue-600",
      };
  }
}

export default function AdminHomeView() {
  const { t, locale } = useLocale();
  const [pharmacyRequests, setPharmacyRequests] = useState<AdminPharmacy[]>([]);
  const stats = [
    {
      title: t("admin.home.totalPatients", "Total patients"),
      value: locale === "ar" ? "١٢,٤٥٠" : "12,450",
      change: locale === "ar" ? "+١٢٪" : "+12%",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: t("admin.home.registeredPharmacies", "Registered pharmacies"),
      value: locale === "ar" ? "٨٤٢" : "842",
      change: locale === "ar" ? "+٥٪" : "+5%",
      icon: Store,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: t("admin.home.todayOrders", "Today's orders"),
      value: locale === "ar" ? "١٥٦" : "156",
      change: locale === "ar" ? "+٨٪" : "+8%",
      icon: ClipboardList,
      color: "text-sky-600",
      bg: "bg-sky-50",
    },
    {
      title: t("admin.home.totalRevenue", "Total revenue"),
      value: locale === "ar" ? "٤٥,٠٠٠ ج.م" : "45,000 EGP",
      change: locale === "ar" ? "+١٥٪" : "+15%",
      icon: Wallet,
      color: "text-blue-700",
      bg: "bg-blue-100",
    },
  ];

  const chartData = [
    { name: locale === "ar" ? "السبت" : "Sat", value: 40 },
    { name: locale === "ar" ? "الأحد" : "Sun", value: 65 },
    { name: locale === "ar" ? "الاثنين" : "Mon", value: 50 },
    { name: locale === "ar" ? "الثلاثاء" : "Tue", value: 80 },
    { name: locale === "ar" ? "الأربعاء" : "Wed", value: 112 },
    { name: locale === "ar" ? "الخميس" : "Thu", value: 75 },
    { name: locale === "ar" ? "الجمعة" : "Fri", value: 60 },
  ];

  const [loadingRequests, setLoadingRequests] = useState(true);
  const [requestsError, setRequestsError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [recentOrders, setRecentOrders] = useState<DashboardOrder[]>([]);

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
          setRequestsError(t("admin.home.loadRequestsError", "Unable to load new pharmacy requests."));
        }
      } finally {
        if (isMounted) {
          setLoadingRequests(false);
        }
      }
    };

    loadPharmacyRequests();

    const loadRecentOrders = async () => {
      try {
        const data = await adminService.listOrders();
        const active = data
          .filter((o: AdminOrder) => !["completed", "rejected"].includes((o.status || "").toLowerCase()))
          .slice(0, 5)
          .map((o: AdminOrder) => {
            const mapped = mapStatus(o.status, t);
            return {
              id: o.id,
              created_at: o.created_at,
              statusText: mapped.text,
              statusColor: mapped.color,
              icon: mapped.icon,
              iconColor: mapped.iconColor,
            };
          });
        if (isMounted) setRecentOrders(active);
      } catch {
        if (isMounted) setRecentOrders([]);
      }
    };

    void loadRecentOrders();
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
    if (city && district) return `${city}${locale === "ar" ? "، " : ", "}${district}`;
    if (city) return city;
    if (district) return district;
    return t("admin.home.unknownLocation", "Not specified");
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
              <h3 className="font-bold text-slate-900">{t("admin.home.weeklyOrderTrends", "Weekly order trends")}</h3>
              <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-1">
                <button
                  type="button"
                  className="rounded-md bg-white px-3 py-1 text-xs font-bold text-slate-600 shadow-sm"
                >
                  {t("admin.home.last7Days", "Last 7 days")}
                </button>
                <button
                  type="button"
                  className="rounded-md px-3 py-1 text-xs font-bold text-slate-400 hover:text-slate-600"
                >
                  {t("admin.home.last30Days", "Last 30 days")}
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
                            {String(payload[0].value)} {t("admin.home.ordersUnit", "orders")}
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
              <h3 className="font-bold text-slate-900">{t("admin.home.latestActiveOrders", "Latest active orders")}</h3>
              <Link href="/admin/orders" className="text-sm font-bold text-blue-600 hover:underline">
                {t("admin.home.viewAll", "View all")}
              </Link>
            </div>
            <div className="flex flex-1 flex-col space-y-4">
              {recentOrders.length === 0 ? (
                <div className="rounded-xl border border-slate-100 p-4 text-sm text-slate-500">{t("admin.home.noActiveOrders", "There are no active orders currently.")}</div>
              ) : recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center gap-4 rounded-xl border border-slate-50 p-4 transition-colors hover:bg-slate-50"
                >
                  <div className="rounded-xl bg-blue-50 p-2.5">
                    <order.icon className={order.iconColor} size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900">ORD-{order.id}#</p>
                    <p className="text-xs text-slate-400">{toRelativeText(order.created_at, t)}</p>
                  </div>
                  <span className={cn("rounded-lg px-2.5 py-1 text-[10px] font-bold", order.statusColor)}>
                    {order.statusText}
                  </span>
                </div>
              ))}
            </div>
            <Link
              href="/admin/orders"
              className="mt-6 block w-full rounded-xl border border-slate-200 py-3 text-center text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50"
            >
              {t("admin.home.allOrders", "View all orders")}
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-6">
            <h3 className="font-bold text-slate-900">{t("admin.home.newPharmacyRequests", "New pharmacy requests")}</h3>
            <button type="button" className="text-sm font-bold text-blue-600 hover:underline">
              {t("admin.home.viewAll", "View all")}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-start">
              <thead>
                <tr className="bg-slate-50/50 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4">{t("admin.home.pharmacyName", "Pharmacy name")}</th>
                  <th className="px-6 py-4">{t("admin.home.location", "Location")}</th>
                  <th className="px-6 py-4">{t("admin.home.licenseNumber", "License number")}</th>
                  <th className="px-6 py-4">{t("admin.home.status", "Status")}</th>
                  <th className="px-6 py-4 text-center">{t("admin.home.actions", "Actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loadingRequests ? (
                  <tr>
                    <td className="px-6 py-8 text-center text-sm text-slate-500" colSpan={5}>
                      {t("admin.home.loadingRequests", "Loading pharmacy requests...")}
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
                      {t("admin.home.noRequests", "There are no new pharmacy requests currently.")}
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
                          {t("admin.home.pendingReview", "Pending review")}
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
                            {actionLoadingId === req.id ? "..." : t("admin.home.approve", "Approve")}
                          </button>
                          <button
                            type="button"
                            disabled={actionLoadingId === req.id}
                            onClick={() => handleReject(req.id)}
                            className="rounded-lg bg-red-50 px-4 py-1.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {t("admin.home.reject", "Reject")}
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
