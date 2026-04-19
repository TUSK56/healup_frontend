"use client";

import React from "react";
import { Users, UserCheck, UserPlus, Calendar, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { adminService, AdminUser } from "@/services/adminService";

function toArabicDate(value?: string) {
  if (!value) return "-";
  const d = new Date(value);
  if (!Number.isFinite(d.getTime())) return "-";
  return d.toLocaleDateString("ar-EG", { dateStyle: "medium" });
}

export default function AdminPatientsView() {
  const PAGE_SIZE = 10;
  const [rows, setRows] = React.useState<AdminUser[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await adminService.listUsers();
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
    return rows.filter((u) => {
      return (
        (u.name || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        (u.phone || "").toLowerCase().includes(q)
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

  const stats = React.useMemo(() => {
    const total = rows.length;
    const active = rows.length;
    const now = Date.now();
    const last30 = rows.filter((u) => {
      const d = new Date(u.created_at).getTime();
      return Number.isFinite(d) && now - d <= 30 * 24 * 60 * 60 * 1000;
    }).length;
    return { total, active, last30 };
  }, [rows]);

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-slate-50/50">
      <main className="flex-1 overflow-y-auto p-8">
        <section className="mb-8 text-right">
          <h2 className="mb-1 text-3xl font-bold text-[#0355AE]">إدارة المرضى</h2>
          <p className="text-sm text-slate-500">نظرة عامة على جميع المرضى المسجلين في المنصة</p>
        </section>

        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "إجمالي المرضى", value: stats.total.toLocaleString("ar-EG"), subValue: "بيانات حقيقية", icon: Users, color: "text-blue-600", bgColor: "bg-blue-50" },
            { title: "المرضى النشطون", value: stats.active.toLocaleString("ar-EG"), subValue: "100% من الإجمالي", icon: UserCheck, color: "text-green-600", bgColor: "bg-green-50" },
            { title: "مرضى جدد", value: stats.last30.toLocaleString("ar-EG"), subValue: "خلال آخر 30 يوم", icon: UserPlus, color: "text-purple-600", bgColor: "bg-purple-50" },
            { title: "معدل الانضمام", value: (stats.last30 / 30).toFixed(1), subValue: "مريض/يوم", icon: Calendar, color: "text-orange-600", bgColor: "bg-orange-50" },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative h-full overflow-hidden rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className={`absolute left-6 top-6 shrink-0 rounded-xl p-2.5 ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="text-right">
                <p className="mb-4 text-sm text-slate-500">{stat.title}</p>
                <h3 className="mb-1 text-2xl font-bold text-slate-900">{stat.value}</h3>
                <p className="text-xs text-slate-400">{stat.subValue}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-6">
            <div className="relative max-w-2xl">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="بحث عن مريض بالاسم، البريد الإلكتروني أو رقم الهاتف..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pr-10 pl-3 text-sm outline-none ring-blue-500/20 focus:ring-2"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-6 py-3 font-bold text-slate-900">المريض</th>
                  <th className="px-6 py-3 font-bold text-slate-900">البريد الإلكتروني</th>
                  <th className="px-6 py-3 font-bold text-slate-900">رقم الهاتف</th>
                  <th className="px-6 py-3 font-bold text-slate-900">تاريخ الانضمام</th>
                  <th className="px-6 py-3 font-bold text-slate-900">الحالة</th>
                  <th className="px-6 py-3 font-bold text-slate-900">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">جاري تحميل بيانات المرضى...</td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">لا توجد بيانات مطابقة.</td>
                  </tr>
                ) : (
                  pagedRows.map((patient) => (
                    <tr key={patient.id} className="transition-colors hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=patient-${patient.id}`}
                            alt=""
                            className="h-10 w-10 rounded-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{patient.name || "-"}</p>
                            <p className="text-xs text-slate-500">ID: PA-{patient.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{patient.email || "-"}</td>
                      <td className="px-6 py-4 text-slate-600">{patient.phone || "-"}</td>
                      <td className="px-6 py-4 text-slate-600">{toArabicDate(patient.created_at)}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700">نشط</span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">—</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 p-6 sm:flex-row">
            <p className="text-sm text-slate-500">
              عرض <span className="font-bold text-slate-900">{filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}</span> إلى{" "}
              <span className="font-bold text-slate-900">{Math.min(page * PAGE_SIZE, filtered.length)}</span> من أصل{" "}
              <span className="font-bold text-slate-900">{filtered.length.toLocaleString("ar-EG")}</span> مريض
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-slate-200 p-2 text-slate-400 transition-all hover:bg-slate-50 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
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
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <footer className="mt-12 text-center text-sm text-slate-400">
          <p>© 2024 Healup Admin. جميع الحقوق محفوظة.</p>
        </footer>
      </main>
    </div>
  );
}
