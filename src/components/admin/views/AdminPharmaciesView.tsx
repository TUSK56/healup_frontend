"use client";

import React, { useMemo, useState } from "react";
import { Store, CheckCircle, Clock, Search, Filter, Eye, ChevronRight, ChevronLeft, ChevronDown } from "lucide-react";
import { motion } from "motion/react";

type UiStatus = "active" | "inactive" | "pending";

interface MockPharmacy {
  id: number;
  name: string;
  email: string;
  phone: string;
  license: string;
  region: string;
  joinLabel: string;
  status: UiStatus;
}

const MOCK_PHARMACIES: MockPharmacy[] = [
  {
    id: 1,
    name: "صيدلية العزبي",
    email: "ezaby@example.com",
    phone: "01000000001",
    license: "LIC-88291#",
    region: "القاهرة",
    joinLabel: "2024/03/01",
    status: "active",
  },
  {
    id: 2,
    name: "صيدليات مصر",
    email: "misr@example.com",
    phone: "01000000002",
    license: "LIC-44512#",
    region: "الجيزة",
    joinLabel: "2024/02/15",
    status: "inactive",
  },
  {
    id: 3,
    name: "صيدلية 19011",
    email: "19011@example.com",
    phone: "01000000003",
    license: "LIC-11982#",
    region: "الإسكندرية",
    joinLabel: "2024/01/20",
    status: "pending",
  },
];

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
          <span className={`text-xs font-bold ${change.startsWith("+") ? "text-emerald-600" : "text-slate-400"}`}>{change}</span>
          <span className="text-[10px] font-medium text-slate-400">عرض توضيحي</span>
        </div>
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: UiStatus }) {
  const configs = {
    active: { label: "معتمد", bg: "bg-success-light", text: "text-success", dot: "bg-success" },
    inactive: { label: "موقوف", bg: "bg-slate-50", text: "text-slate-500", dot: "bg-slate-300" },
    pending: { label: "قيد المراجعة", bg: "bg-warning-light", text: "text-warning", dot: "bg-warning" },
  };
  const config = configs[status];
  return (
    <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${config.bg} ${config.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </div>
  );
}

export default function AdminPharmaciesView() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return MOCK_PHARMACIES;
    return MOCK_PHARMACIES.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.license.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const initials = (name: string) => {
    const t = name.trim();
    return t ? t.charAt(0) : "?";
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col bg-[#F8FAFC]">
      <main className="space-y-8 p-10">
        <section className="space-y-1">
          <h1 className="text-3xl font-bold text-[#0355AE]">إدارة الصيدليات</h1>
          <p className="font-medium text-slate-500">عرض توضيحي — الموافقة على الطلبات الجديدة تتم من لوحة القيادة</p>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <StatCard
            title="إجمالي الصيدليات"
            value="1,250"
            change="+5%"
            icon={Store}
            colorClass="text-brand"
            iconBgClass="bg-brand-light"
          />
          <StatCard
            title="صيدليات معتمدة"
            value="1,180"
            change="+2%"
            icon={CheckCircle}
            colorClass="text-emerald-600"
            iconBgClass="bg-emerald-50"
          />
          <StatCard
            title="بانتظار الموافقة"
            value="45"
            change="+12%"
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
                placeholder="ابحث باسم الصيدلية، البريد، أو رقم الترخيص..."
                className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-3 pl-4 pr-12 text-sm transition-all focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex w-full gap-3 md:w-auto">
              <button
                type="button"
                className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 md:flex-none"
              >
                <span>كل الحالات</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="flex items-center gap-2 rounded-2xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-lg transition-colors hover:bg-brand/90"
              >
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
                  <th className="px-6 py-4">البريد</th>
                  <th className="px-6 py-4">المنطقة</th>
                  <th className="px-6 py-4">تاريخ التسجيل</th>
                  <th className="px-6 py-4 text-center">الحالة</th>
                  <th className="px-6 py-4 text-left">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((pharmacy, idx) => (
                  <motion.tr
                    key={pharmacy.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(idx * 0.03, 0.4) }}
                    className="group transition-colors hover:bg-slate-50/50"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light text-lg font-bold text-brand">
                          {initials(pharmacy.name)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{pharmacy.name}</p>
                          <p className="text-[10px] font-medium text-slate-400">{pharmacy.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-mono text-sm text-slate-500">{pharmacy.license}</td>
                    <td className="px-6 py-5 text-sm text-slate-600">{pharmacy.email}</td>
                    <td className="px-6 py-5 text-sm text-slate-600">{pharmacy.region}</td>
                    <td className="px-6 py-5 text-sm text-slate-500">{pharmacy.joinLabel}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center">
                        <StatusBadge status={pharmacy.status} />
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <span className="text-xs text-slate-400">—</span>
                        <button type="button" className="rounded-lg p-2 text-slate-400 hover:bg-brand-light hover:text-brand" title="عرض">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 p-6 md:flex-row">
            <p className="text-sm font-medium text-slate-400">
              عرض <span className="font-bold text-slate-800">{filtered.length}</span> صفوف (عرض توضيحي)
            </p>
            <div className="flex items-center gap-2 opacity-40">
              <ChevronRight className="h-4 w-4" />
              <ChevronLeft className="h-4 w-4" />
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-auto w-full border-t border-slate-100 px-10 py-8 text-center">
        <p className="text-xs font-medium text-slate-400">© Healup — إدارة الصيدليات (بيانات تجريبية)</p>
      </footer>
    </div>
  );
}
