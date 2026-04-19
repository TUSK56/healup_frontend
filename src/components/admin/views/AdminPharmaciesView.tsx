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

function toArabicDate(value?: string) {
  if (!value) return "-";
  const d = new Date(value);
  if (!Number.isFinite(d.getTime())) return "-";
  return d.toLocaleDateString("ar-EG", { dateStyle: "medium" });
}

function toRegion(p: AdminPharmacy) {
  const city = (p.city || "").trim();
  const district = (p.district || "").trim();
  if (city && district) return `${city}، ${district}`;
  return city || district || "غير محدد";
}

function statusInfo(status: string) {
  const s = (status || "").toLowerCase();
  if (s === "approved") return { text: "نشط", cls: "bg-green-50 text-green-700" };
  if (s === "pending") return { text: "قيد المراجعة", cls: "bg-amber-50 text-amber-700" };
  if (s === "disabled") return { text: "غير نشط", cls: "bg-slate-100 text-slate-600" };
  return { text: status || "غير معروف", cls: "bg-slate-100 text-slate-600" };
}

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  colorClass,
  iconBgClass,
}: {
  title: string;
  value: string;
  change: string;
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
          <span className="text-[10px] font-medium text-slate-400">هذا الشهر</span>
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
          <h1 className="text-3xl font-bold text-[#0355AE]">إدارة الصيدليات</h1>
          <p className="font-medium text-slate-500">متابعة وإدارة كافة الصيدليات المسجلة في منصة Healup</p>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <StatCard
            title="إجمالي الصيدليات"
            value={stats.total.toLocaleString("ar-EG")}
            change="+0%"
            icon={Store}
            colorClass="text-brand"
            iconBgClass="bg-brand-light"
          />
          <StatCard
            title="صيدليات نشطة"
            value={stats.active.toLocaleString("ar-EG")}
            change="+0%"
            icon={CheckCircle}
            colorClass="text-emerald-600"
            iconBgClass="bg-emerald-50"
          />
          <StatCard
            title="طلبات انضمام جديدة"
            value={stats.pending.toLocaleString("ar-EG")}
            change="+0%"
            icon={Clock}
            colorClass="text-amber-600"
            iconBgClass="bg-amber-50"
          />
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
          <div className="flex flex-col items-center gap-4 border-b border-slate-100 p-6 md:flex-row">
            <div className="relative w-full flex-1">
              <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="ابحث باسم الصيدلية، رقم الترخيص، أو المنطقة..."
                className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-3 pl-4 pr-12 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="flex w-full gap-3 md:w-auto">
              <button type="button" className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 md:flex-none">
                <span>كل المناطق</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <button type="button" className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 md:flex-none">
                <span>كل الحالات</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <button type="button" className="flex items-center gap-2 rounded-2xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-lg transition-colors hover:bg-brand/90">
                <Filter className="h-4 w-4" />
                <span>تصفية</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-slate-50/50 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4">اسم الصيدلية</th>
                  <th className="px-6 py-4">رقم الترخيص</th>
                  <th className="px-6 py-4">المنطقة</th>
                  <th className="px-6 py-4">تاريخ الانضمام</th>
                  <th className="px-6 py-4 text-center">الحالة</th>
                  <th className="px-6 py-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-slate-500">جاري تحميل الصيدليات...</td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-slate-500">لا توجد بيانات مطابقة.</td>
                  </tr>
                ) : (
                  pagedRows.map((pharmacy) => {
                    const status = statusInfo(pharmacy.status);
                    return (
                      <tr key={pharmacy.id} className="transition-colors hover:bg-slate-50/50">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light text-lg font-bold text-brand">
                              {(pharmacy.name || "ص").slice(0, 1)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800">{pharmacy.name}</p>
                              <p className="text-[10px] font-medium text-slate-400">{toRegion(pharmacy)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 font-mono text-sm text-slate-500">{pharmacy.license_number || "-"}</td>
                        <td className="px-6 py-5 text-sm text-slate-600">{toRegion(pharmacy)}</td>
                        <td className="px-6 py-5 text-sm text-slate-500">{toArabicDate(pharmacy.created_at)}</td>
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
                                ? "تعطيل"
                                : "تفعيل"}
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
              عرض <span className="font-bold text-slate-800">{filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}</span> إلى <span className="font-bold text-slate-800">{Math.min(page * PAGE_SIZE, filtered.length)}</span> من أصل <span className="font-bold text-slate-800">{filtered.length.toLocaleString("ar-EG")}</span> صيدلية
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
        <p className="text-xs font-medium text-slate-400">© 2024 Healup. جميع الحقوق محفوظة لنظام إدارة الخدمات الطبية.</p>
      </footer>
    </div>
  );
}
