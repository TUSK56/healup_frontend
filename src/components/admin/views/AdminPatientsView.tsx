"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Users, UserCheck, UserPlus, Calendar, Search, Eye, Edit2 } from "lucide-react";
import { motion } from "motion/react";
import { adminService, type AdminUserRow } from "@/services/adminService";

export default function AdminPatientsView() {
  const [rows, setRows] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.listUsers();
      setRows(data.data);
    } catch {
      setError("تعذر تحميل المرضى. تأكد من تسجيل الدخول كمسؤول.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone && u.phone.toLowerCase().includes(q))
    );
  }, [rows, searchQuery]);

  const stats = useMemo(() => {
    const total = rows.length;
    const thirtyAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const newLast30 = rows.filter((u) => new Date(u.created_at).getTime() >= thirtyAgo).length;
    const latest = rows.reduce<Date | null>((acc, u) => {
      const d = new Date(u.created_at);
      if (!acc || d > acc) return d;
      return acc;
    }, null);
    return { total, newLast30, latest };
  }, [rows]);

  const statCards = [
    {
      title: "إجمالي المرضى",
      value: loading ? "…" : String(stats.total),
      subValue: "من قاعدة البيانات",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "المرضى النشطون",
      value: loading ? "…" : String(stats.total),
      subValue: "جميع الحسابات المسجلة",
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "مرضى جدد",
      value: loading ? "…" : String(stats.newLast30),
      subValue: "خلال آخر ٣٠ يومًا",
      icon: UserPlus,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "آخر تسجيل",
      value: loading ? "…" : stats.latest ? stats.latest.toLocaleDateString("ar-EG") : "—",
      subValue: "أحدث حساب مريض",
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-slate-50/50">
      <main className="flex-1 overflow-y-auto p-8">
        <section className="mb-8 text-right">
          <h2 className="mb-1 text-3xl font-bold text-[#0355AE]">إدارة المرضى</h2>
          <p className="text-sm text-slate-500">بيانات مباشرة من الخادم</p>
        </section>

        {error ? <p className="mb-4 font-bold text-red-600">{error}</p> : null}

        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => (
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
                placeholder="بحث عن مريض بالاسم، البريد الإلكتروني أو رقم الهاتف..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pr-10 pl-3 text-sm outline-none ring-blue-500/20 focus:ring-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                    <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                      جاري التحميل…
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                      لا يوجد مرضى مطابقون للبحث.
                    </td>
                  </tr>
                ) : (
                  filtered.map((patient) => (
                    <tr key={patient.id} className="transition-colors hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700">
                            {patient.name.trim().charAt(0) || "؟"}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{patient.name}</p>
                            <p className="text-xs text-slate-500">ID: {patient.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{patient.email}</td>
                      <td className="px-6 py-4 text-slate-600">{patient.phone ?? "—"}</td>
                      <td className="px-6 py-4 text-slate-600">
                        {new Date(patient.created_at).toLocaleDateString("ar-EG", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-md border-none bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                          نشط
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-blue-600"
                            title="تعديل"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-blue-600"
                            title="عرض"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 p-6 sm:flex-row">
            <p className="text-sm text-slate-500">
              عرض <span className="font-bold text-slate-900">{filtered.length}</span> من أصل{" "}
              <span className="font-bold text-slate-900">{rows.length}</span> مريضًا
            </p>
          </div>
        </div>

        <footer className="mt-12 text-center text-sm text-slate-400">
          <p>© Healup Admin</p>
        </footer>
      </main>
    </div>
  );
}
