"use client";

import React from "react";
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
import { adminService, AdminOrder } from "@/services/adminService";
import { useLocale } from "@/contexts/LocaleContext";

function toLocaleDateTime(value: string | undefined, locale: "ar" | "en") {
  if (!value) return "-";
  const d = new Date(value);
  if (!Number.isFinite(d.getTime())) return "-";
  return d.toLocaleString(locale === "ar" ? "ar-EG" : "en-US", { dateStyle: "short", timeStyle: "short" });
}

function statusLabel(status: string, t: (key: string, fallback?: string) => string) {
  switch ((status || "").toLowerCase()) {
    case "pending_pharmacy_confirmation":
      return { text: t("admin.ordersView.statusPendingPharmacyConfirmation", "Waiting for pharmacy confirmation"), cls: "bg-[#FEF3C7] text-[#AB6D3E]" };
    case "confirmed":
      return { text: t("admin.ordersView.statusConfirmed", "Confirmed"), cls: "bg-[#DBEAFE] text-[#2244B8]" };
    case "preparing":
      return { text: t("admin.ordersView.statusPreparing", "Preparing"), cls: "bg-[#E0E7FF] text-[#3930A7]" };
    case "out_for_delivery":
      return { text: t("admin.ordersView.statusOutForDelivery", "Out for delivery"), cls: "bg-[#E0E7FF] text-[#3930A7]" };
    case "ready_for_pickup":
      return { text: t("admin.ordersView.statusReadyForPickup", "Ready for pickup"), cls: "bg-[#DBEAFE] text-[#2244B8]" };
    case "completed":
      return { text: t("admin.ordersView.statusCompleted", "Delivered"), cls: "bg-[#D1FAE5] text-[#107057]" };
    case "rejected":
      return { text: t("admin.ordersView.statusRejected", "Rejected"), cls: "bg-[#FFE4E6] text-[#A81F48]" };
    default:
      return { text: status || t("admin.ordersView.statusUnknown", "Unknown"), cls: "bg-slate-100 text-slate-600" };
  }
}

function locationText(order: AdminOrder, t: (key: string, fallback?: string) => string, locale: "ar" | "en") {
  const city = order.pharmacy?.city?.trim() || "";
  const district = order.pharmacy?.district?.trim() || "";
  if (city && district) return `${city}${locale === "ar" ? "، " : ", "}${district}`;
  if (city) return city;
  if (district) return district;
  return t("admin.ordersView.unknownLocation", "Not specified");
}

function isActiveStatus(status: string) {
  const s = (status || "").toLowerCase();
  return ["pending_pharmacy_confirmation", "confirmed", "preparing", "out_for_delivery", "ready_for_pickup"].includes(s);
}

export default function AdminOrdersView() {
  const { t, locale } = useLocale();
  const PAGE_SIZE = 10;
  const [rows, setRows] = React.useState<AdminOrder[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await adminService.listOrders();
        if (mounted) setRows(data);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    void load();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((o) => {
      const idText = `HE-${o.id}`.toLowerCase();
      const patient = (o.patient?.name || "").toLowerCase();
      const pharmacy = (o.pharmacy?.name || "").toLowerCase();
      return idText.includes(q) || patient.includes(q) || pharmacy.includes(q);
    });
  }, [rows, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  React.useEffect(() => {
    setPage(1);
  }, [query]);

  React.useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pagedRows = React.useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const visiblePages = React.useMemo(() => {
    if (totalPages <= 3) return Array.from({ length: totalPages }, (_, idx) => idx + 1);
    let start = Math.max(1, page - 1);
    let end = Math.min(totalPages, start + 2);
    start = Math.max(1, end - 2);
    return Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
  }, [page, totalPages]);

  const stats = React.useMemo(() => {
    const total = rows.length;
    const active = rows.filter((o) => isActiveStatus(o.status)).length;
    const completed = rows.filter((o) => (o.status || "").toLowerCase() === "completed").length;
    const cancelled = rows.filter((o) => (o.status || "").toLowerCase() === "rejected").length;
    return { total, active, completed, cancelled };
  }, [rows]);

  return (
    <div className="flex min-w-0 flex-1 flex-col bg-[#F8FAFC]">
      <main className="w-full min-w-0 px-6 py-8 sm:px-8 sm:py-10 lg:px-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[#0355AE]">{t("admin.ordersView.title", "Medicine orders management")}</h1>
          <p className="mt-2 text-slate-500">{t("admin.ordersView.subtitle", "Track and manage all purchase operations and medicine requests across Egypt")}</p>
        </div>

        <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: t("admin.ordersView.totalOrders", "Total orders"), value: String(stats.total), change: null, icon: ShoppingBag, bgColor: "#E5EEF7", textColor: "#0456AE" },
            { label: t("admin.ordersView.activeOrders", "Active orders"), value: String(stats.active), change: null, icon: Clock, bgColor: "#FEF5E6", textColor: "#AB6D3E" },
            { label: t("admin.ordersView.completedOrders", "Completed orders"), value: String(stats.completed), change: null, icon: CheckCircle2, bgColor: "#E7F8F2", textColor: "#107057" },
            { label: t("admin.ordersView.cancelledOrders", "Cancelled orders"), value: String(stats.cancelled), change: null, icon: XCircle, bgColor: "#FEEBEF", textColor: "#A81F48" },
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
                {stat.change ? (
                  <span className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600">{stat.change}</span>
                ) : null}
              </div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">{Number(stat.value).toLocaleString(locale === "ar" ? "ar-EG" : "en-US")}</p>
            </motion.div>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col items-center gap-4 border-b border-slate-100 p-6 lg:flex-row">
            <div className="relative w-full flex-1">
              <Search className="absolute end-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("admin.ordersView.searchPlaceholder", "Search by order number, patient name, or pharmacy...")}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 ps-4 pe-12 text-sm transition-all focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </div>
            <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto">
              <select className="min-w-[140px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20">
                <option>{t("admin.ordersView.allStatuses", "All statuses")}</option>
              </select>
              <select className="min-w-[140px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20">
                <option>{t("admin.ordersView.timeRange", "Time range")}</option>
              </select>
              <button
                type="button"
                className="flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-lg transition-colors hover:bg-brand/90"
              >
                <Filter className="h-4 w-4" />
                {t("admin.ordersView.applyFilters", "Apply filters")}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-start">
              <thead>
                <tr className="bg-slate-50/50 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">{t("admin.ordersView.orderNumber", "Order number")}</th>
                  <th className="px-6 py-4">{t("admin.ordersView.patientName", "Patient name")}</th>
                  <th className="px-6 py-4">{t("admin.ordersView.pharmacy", "Pharmacy")}</th>
                  <th className="px-6 py-4">{t("admin.ordersView.date", "Date")}</th>
                  <th className="px-6 py-4">{t("admin.home.location", "Location")}</th>
                  <th className="px-6 py-4">{t("admin.ordersView.totalPrice", "Total price")}</th>
                  <th className="px-6 py-4">{t("admin.home.status", "Status")}</th>
                  <th className="px-6 py-4 text-center">{t("admin.home.actions", "Actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-sm text-slate-500">
                      {t("admin.ordersView.loading", "Loading orders...")}
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-sm text-slate-500">
                      {t("admin.ordersView.noResults", "No matching orders found.")}
                    </td>
                  </tr>
                ) : (
                  pagedRows.map((order, idx) => {
                    const s = statusLabel(order.status, t);
                    return (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.03 }}
                        className="transition-colors hover:bg-slate-50/80"
                      >
                        <td className="px-6 py-5 font-bold text-brand">HE-{order.id}</td>
                        <td className="px-6 py-5 font-medium text-slate-900">{order.patient?.name || "-"}</td>
                        <td className="px-6 py-5 text-sm text-slate-600">{order.pharmacy?.name || "-"}</td>
                        <td className="px-6 py-5 text-sm text-slate-700">{toLocaleDateTime(order.created_at, locale)}</td>
                        <td className="px-6 py-5 text-sm text-slate-600">{locationText(order, t, locale)}</td>
                        <td className="px-6 py-5 font-bold text-slate-900">{Number(order.total_price || 0).toLocaleString(locale === "ar" ? "ar-EG" : "en-US")} {t("admin.ordersView.currencyShort", "EGP")}</td>
                        <td className="px-6 py-5">
                          <span className={`rounded-full px-3 py-1 text-xs font-medium ${s.cls}`}>{s.text}</span>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <button type="button" className="inline-flex items-center gap-2 text-xs font-bold text-brand">
                            <Eye className="h-4 w-4" />
                            {t("admin.ordersView.details", "Details")}
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
              {t("admin.ordersView.showing", "Showing")} <span className="font-bold text-slate-900">{filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}</span> {t("admin.ordersView.to", "to")}{" "}
              <span className="font-bold text-slate-900">{Math.min(page * PAGE_SIZE, filtered.length)}</span> {t("admin.ordersView.of", "of")}{" "}
              <span className="font-bold text-slate-900">{filtered.length.toLocaleString(locale === "ar" ? "ar-EG" : "en-US")}</span> {t("admin.ordersView.orders", "orders")}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-slate-200 p-2 text-slate-400 transition-all hover:bg-slate-50 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              {visiblePages.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={`h-10 min-w-10 rounded-lg px-3 text-sm font-bold ${p === page ? "bg-brand text-white shadow-md" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                >
                  {p}
                </button>
              ))}
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-lg border border-slate-200 p-2 text-slate-400 transition-all hover:bg-slate-50 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <footer className="mt-10 border-t border-slate-200/80 pt-8 text-center sm:mt-12">
          <p className="text-xs text-slate-400">© 2023 {t("admin.ordersView.footer", "Healup Egypt - All rights reserved")}</p>
        </footer>
      </main>
    </div>
  );
}
