"use client";

import React from "react";
import {
  Store,
  CheckCircle,
  Clock,
  Search,
  Filter,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
} from "lucide-react";
import { motion } from "motion/react";
import { adminService, AdminPharmacy } from "@/services/adminService";
import { useLocale } from "@/contexts/LocaleContext";

function toLocaleDate(value: string | undefined, locale: "ar" | "en") {
  if (!value) return "-";
  const d = new Date(value);
  if (!Number.isFinite(d.getTime())) return "-";
  return d.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", { dateStyle: "medium" });
}

function toRegion(p: AdminPharmacy, locale: "ar" | "en", t: (key: string, fallback?: string) => string) {
  const city = (p.city || "").trim();
  const district = (p.district || "").trim();
  if (city && district) return `${city}${locale === "ar" ? "، " : ", "}${district}`;
  return city || district || t("admin.pharmaciesView.unknownLocation", "Not specified");
}

function statusInfo(status: string, t: (key: string, fallback?: string) => string) {
  const s = (status || "").toLowerCase();
  if (s === "approved") return { text: t("admin.pharmaciesView.statusActive", "Active"), cls: "bg-green-50 text-green-700" };
  if (s === "pending") return { text: t("admin.pharmaciesView.statusPending", "Under review"), cls: "bg-amber-50 text-amber-700" };
  if (s === "disabled") return { text: t("admin.pharmaciesView.statusDisabled", "Inactive"), cls: "bg-slate-100 text-slate-600" };
  return { text: status || t("admin.pharmaciesView.statusUnknown", "Unknown"), cls: "bg-slate-100 text-slate-600" };
}

function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  colorClass,
  iconBgClass,
}: {
  title: string;
  value: string;
  change: string;
  changeLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  iconBgClass: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-1 flex-col gap-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
    >
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className={`rounded-xl p-3 ${iconBgClass}`}>
          <Icon className={`h-6 w-6 ${colorClass}`} />
        </div>
      </div>
      <div className="flex flex-col items-start text-left">
        <h3 className="mb-1 text-3xl font-bold text-slate-800">{value}</h3>
        <div className="flex items-center gap-1">
          <span className={`text-xs font-bold ${change.startsWith("+") ? "text-emerald-600" : "text-rose-500"}`}>{change}</span>
          <span className="text-[10px] font-medium text-slate-400">{changeLabel}</span>
        </div>
      </div>
    </motion.div>
  );
}

function Toggle({ active }: { active: boolean }) {
  return (
    <div className={`relative h-5 w-10 rounded-full transition-colors ${active ? "bg-success" : "bg-slate-200"}`}>
      <div className={`absolute top-1 h-3 w-3 rounded-full bg-white transition-all ${active ? "left-1" : "left-6"}`} />
    </div>
  );
}

export default function AdminPharmaciesView() {
  const { t, locale } = useLocale();
  const PAGE_SIZE = 10;
  const [rows, setRows] = React.useState<AdminPharmacy[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [actionId, setActionId] = React.useState<number | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.listPharmacies();
      setRows(data);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((p) => {
      return (
        (p.name || "").toLowerCase().includes(q) ||
        (p.license_number || "").toLowerCase().includes(q) ||
        (p.city || "").toLowerCase().includes(q) ||
        (p.district || "").toLowerCase().includes(q)
      );
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

  const toggleStatus = async (p: AdminPharmacy) => {
    setActionId(p.id);
    try {
      if ((p.status || "").toLowerCase() === "approved") {
        await adminService.disablePharmacy(p.id);
      } else {
        await adminService.approvePharmacy(p.id);
      }
      await load();
    } finally {
      setActionId(null);
    }
  };

  const stats = React.useMemo(() => {
    const total = rows.length;
    const active = rows.filter((x) => (x.status || "").toLowerCase() === "approved").length;
    const pending = rows.filter((x) => (x.status || "").toLowerCase() === "pending").length;
    return { total, active, pending };
  }, [rows]);

  return (
    <div className="flex min-w-0 flex-1 flex-col bg-[#F8FAFC]">
      <main className="space-y-8 p-10">
        <section className="space-y-1">
          <h1 className="text-3xl font-bold text-[#0355AE]">{t("admin.pharmaciesView.title", "Pharmacy management")}</h1>
          <p className="font-medium text-slate-500">{t("admin.pharmaciesView.subtitle", "Track and manage all pharmacies registered on Healup")}</p>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <StatCard
            title={t("admin.pharmaciesView.totalPharmacies", "Total pharmacies")}
            value={stats.total.toLocaleString(locale === "ar" ? "ar-EG" : "en-US")}
            change="+0%"
            changeLabel={t("admin.pharmaciesView.thisMonth", "This month")}
            icon={Store}
            colorClass="text-brand"
            iconBgClass="bg-brand-light"
          />
          <StatCard
            title={t("admin.pharmaciesView.activePharmacies", "Active pharmacies")}
            value={stats.active.toLocaleString(locale === "ar" ? "ar-EG" : "en-US")}
            change="+0%"
            changeLabel={t("admin.pharmaciesView.thisMonth", "This month")}
            icon={CheckCircle}
            colorClass="text-emerald-600"
            iconBgClass="bg-emerald-50"
          />
          <StatCard
            title={t("admin.pharmaciesView.newJoinRequests", "New join requests")}
            value={stats.pending.toLocaleString(locale === "ar" ? "ar-EG" : "en-US")}
            change="+0%"
            changeLabel={t("admin.pharmaciesView.thisMonth", "This month")}
            icon={Clock}
            colorClass="text-amber-600"
            iconBgClass="bg-amber-50"
          />
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
          <div className="flex flex-col items-center gap-4 border-b border-slate-100 p-6 md:flex-row">
            <div className="relative w-full flex-1">
              <Search className="absolute end-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={t("admin.pharmaciesView.searchPlaceholder", "Search by pharmacy name, license number, or area...")}
                className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-3 ps-4 pe-12 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="flex w-full gap-3 md:w-auto">
              <button type="button" className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 md:flex-none">
                <span>{t("admin.pharmaciesView.allAreas", "All areas")}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <button type="button" className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 md:flex-none">
                <span>{t("admin.pharmaciesView.allStatuses", "All statuses")}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <button type="button" className="flex items-center gap-2 rounded-2xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-lg transition-colors hover:bg-brand/90">
                <Filter className="h-4 w-4" />
                <span>{t("admin.pharmaciesView.filter", "Filter")}</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-start">
              <thead>
                <tr className="bg-slate-50/50 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4">{t("admin.pharmaciesView.pharmacyName", "Pharmacy name")}</th>
                  <th className="px-6 py-4">{t("admin.pharmaciesView.licenseNumber", "License number")}</th>
                  <th className="px-6 py-4">{t("admin.pharmaciesView.area", "Area")}</th>
                  <th className="px-6 py-4">{t("admin.pharmaciesView.joinDate", "Join date")}</th>
                  <th className="px-6 py-4 text-center">{t("admin.pharmaciesView.status", "Status")}</th>
                  <th className="px-6 py-4 text-center">{t("admin.pharmaciesView.actions", "Actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-slate-500">{t("admin.pharmaciesView.loading", "Loading pharmacies...")}</td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-slate-500">{t("admin.pharmaciesView.noResults", "No matching data found.")}</td>
                  </tr>
                ) : (
                  pagedRows.map((pharmacy) => {
                    const status = statusInfo(pharmacy.status, t);
                    return (
                      <tr key={pharmacy.id} className="transition-colors hover:bg-slate-50/50">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light text-lg font-bold text-brand">
                              {(pharmacy.name || t("admin.pharmaciesView.fallbackInitial", "P")).slice(0, 1)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800">{pharmacy.name}</p>
                              <p className="text-[10px] font-medium text-slate-400">{toRegion(pharmacy, locale, t)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 font-mono text-sm text-slate-500">{pharmacy.license_number || "-"}</td>
                        <td className="px-6 py-5 text-sm text-slate-600">{toRegion(pharmacy, locale, t)}</td>
                        <td className="px-6 py-5 text-sm text-slate-500">{toLocaleDate(pharmacy.created_at, locale)}</td>
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-center gap-4">
                            {(pharmacy.status || "").toLowerCase() !== "pending" ? <Toggle active={(pharmacy.status || "").toLowerCase() === "approved"} /> : null}
                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status.cls}`}>{status.text}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <button
                            type="button"
                            disabled={actionId === pharmacy.id}
                            onClick={() => void toggleStatus(pharmacy)}
                            className="rounded-lg bg-brand px-4 py-1.5 text-xs font-bold text-white disabled:opacity-60"
                          >
                            {actionId === pharmacy.id
                              ? "..."
                              : (pharmacy.status || "").toLowerCase() === "approved"
                                ? t("admin.pharmaciesView.disable", "Disable")
                                : t("admin.pharmaciesView.activate", "Activate")}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 p-6 md:flex-row">
            <p className="text-sm font-medium text-slate-400">
              {t("admin.pharmaciesView.showing", "Showing")} <span className="font-bold text-slate-800">{filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}</span> {t("admin.pharmaciesView.to", "to")} <span className="font-bold text-slate-800">{Math.min(page * PAGE_SIZE, filtered.length)}</span> {t("admin.pharmaciesView.of", "of")} <span className="font-bold text-slate-800">{filtered.length.toLocaleString(locale === "ar" ? "ar-EG" : "en-US")}</span> {t("admin.pharmaciesView.pharmacies", "pharmacies")}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-xl border border-slate-200 p-2 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              {visiblePages.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={`h-10 min-w-10 rounded-xl px-3 text-sm font-bold ${p === page ? "bg-brand text-white shadow-lg" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                >
                  {p}
                </button>
              ))}
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-xl border border-slate-200 p-2 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-auto w-full border-t border-slate-100 px-10 py-8 text-center">
        <p className="text-xs font-medium text-slate-400">© 2024 {t("admin.pharmaciesView.footer", "Healup. All rights reserved for the medical services management system.")}</p>
      </footer>
    </div>
  );
}
