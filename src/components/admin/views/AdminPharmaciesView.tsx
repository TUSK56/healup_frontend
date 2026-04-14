"use client";

import React, { useState } from "react";
import {
  Store,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Eye,
  Edit2,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
} from "lucide-react";
import { motion } from "motion/react";

interface Pharmacy {
  id: string;
  name: string;
  subtitle: string;
  licenseNumber: string;
  region: string;
  joinDate: string;
  status: "active" | "inactive" | "pending";
  initials: string;
}

const MOCK_PHARMACIES: Pharmacy[] = [
  {
    id: "1",
    name: "صيدلية العزبي",
    subtitle: "فرع المعادي، القاهرة",
    licenseNumber: "LIC-88291#",
    region: "القاهرة",
    joinDate: "12 مايو 2023",
    status: "active",
    initials: "ع",
  },
  {
    id: "2",
    name: "صيدلية مصر",
    subtitle: "شارع التحرير، الدقي",
    licenseNumber: "LIC-44512#",
    region: "الجيزة",
    joinDate: "05 يونيو 2023",
    status: "inactive",
    initials: "م",
  },
  {
    id: "3",
    name: "صيدلية 19011",
    subtitle: "حي سموحة، الإسكندرية",
    licenseNumber: "LIC-11902#",
    region: "الإسكندرية",
    joinDate: "21 أغسطس 2023",
    status: "pending",
    initials: "ص",
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
          <span
            className={`text-xs font-bold ${change.startsWith("+") ? "text-emerald-600" : "text-rose-500"}`}
          >
            {change}
          </span>
          <span className="text-[10px] font-medium text-slate-400">هذا الشهر</span>
        </div>
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: Pharmacy["status"] }) {
  const configs = {
    active: { label: "نشط", bg: "bg-success-light", text: "text-success", dot: "bg-success" },
    inactive: { label: "غير نشط", bg: "bg-slate-50", text: "text-slate-500", dot: "bg-slate-300" },
    pending: { label: "قيد المراجعة", bg: "bg-warning-light", text: "text-warning", dot: "bg-warning" },
  };
  const config = configs[status];
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${config.bg} ${config.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </div>
  );
}

function Toggle({ active }: { active: boolean }) {
  return (
    <div
      className={`relative h-5 w-10 cursor-pointer rounded-full transition-colors ${active ? "bg-success" : "bg-slate-200"}`}
    >
      <div
        className={`absolute top-1 h-3 w-3 rounded-full bg-white transition-all ${active ? "left-1" : "left-6"}`}
      />
    </div>
  );
}

export default function AdminPharmaciesView() {
  const [searchQuery, setSearchQuery] = useState("");

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
            value="1,250"
            change="+5%"
            icon={Store}
            colorClass="text-brand"
            iconBgClass="bg-brand-light"
          />
          <StatCard
            title="صيدليات نشطة"
            value="1,180"
            change="+2%"
            icon={CheckCircle}
            colorClass="text-emerald-600"
            iconBgClass="bg-emerald-50"
          />
          <StatCard
            title="طلبات انضمام جديدة"
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
                placeholder="ابحث باسم الصيدلية، رقم الترخيص، أو المنطقة..."
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
                <span>كل المناطق</span>
                <ChevronDown className="h-4 w-4" />
              </button>
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
                  <th className="px-6 py-4">المنطقة</th>
                  <th className="px-6 py-4">تاريخ الانضمام</th>
                  <th className="px-6 py-4 text-center">الحالة</th>
                  <th className="px-6 py-4 text-left">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {MOCK_PHARMACIES.map((pharmacy, idx) => (
                  <motion.tr
                    key={pharmacy.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group transition-colors hover:bg-slate-50/50"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light text-lg font-bold text-brand">
                          {pharmacy.initials}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{pharmacy.name}</p>
                          <p className="text-[10px] font-medium text-slate-400">{pharmacy.subtitle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-mono text-sm text-slate-500">{pharmacy.licenseNumber}</td>
                    <td className="px-6 py-5 text-sm font-medium text-slate-600">{pharmacy.region}</td>
                    <td className="px-6 py-5 text-sm text-slate-500">{pharmacy.joinDate}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-4">
                        {pharmacy.status !== "pending" && <Toggle active={pharmacy.status === "active"} />}
                        <StatusBadge status={pharmacy.status} />
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          className="rounded-lg p-2 text-slate-400 transition-all hover:bg-brand-light hover:text-brand"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="rounded-lg p-2 text-slate-400 transition-all hover:bg-brand-light hover:text-brand"
                        >
                          <Edit2 className="h-4 w-4" />
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
              عرض <span className="font-bold text-slate-800">1-10</span> من أصل{" "}
              <span className="font-bold text-slate-800">1,250</span> صيدلية
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-xl border border-slate-200 p-2 transition-colors hover:bg-slate-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-1">
                {[1, 2, 3, "...", 125].map((page, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`h-10 w-10 rounded-xl text-sm font-bold transition-all ${
                      page === 1
                        ? "bg-brand text-white shadow-lg"
                        : page === "..."
                          ? "cursor-default text-slate-400"
                          : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="rounded-xl border border-slate-200 p-2 transition-colors hover:bg-slate-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-auto w-full border-t border-slate-100 px-10 py-8 text-center">
        <p className="text-xs font-medium text-slate-400">
          © 2024 Healup. جميع الحقوق محفوظة لنظام إدارة الخدمات الطبية.
        </p>
      </footer>
    </div>
  );
}
