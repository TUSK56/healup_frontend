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

type OrderStatus = "pending" | "preparing" | "shipping" | "delivered" | "cancelled";

interface Order {
  id: string;
  patientName: string;
  pharmacy: string;
  date: string;
  time: string;
  location: string;
  totalPrice: number;
  status: OrderStatus;
}

const MOCK_ORDERS: Order[] = [
  {
    id: "HE-5021#",
    patientName: "محمد علي محمود",
    pharmacy: "صيدلية العزبي - الدقي",
    date: "2023/10/25",
    time: "10:30 ص",
    location: "الجيزة",
    totalPrice: 450.0,
    status: "pending",
  },
  {
    id: "HE-5022#",
    patientName: "سارة إبراهيم خليل",
    pharmacy: "صيدليات مصر - مدينة نصر",
    date: "2023/10/25",
    time: "09:15 ص",
    location: "القاهرة",
    totalPrice: 1280.5,
    status: "preparing",
  },
  {
    id: "HE-5018#",
    patientName: "ياسين فوزي",
    pharmacy: "صيدلية رشدي - لوران",
    date: "2023/10/24",
    time: "04:45 م",
    location: "الإسكندرية",
    totalPrice: 320.0,
    status: "shipping",
  },
  {
    id: "HE-5015#",
    patientName: "ليلى يوسف",
    pharmacy: "صيدلية 19011 - المهندسين",
    date: "2023/10/24",
    time: "12:00 م",
    location: "الجيزة",
    totalPrice: 890.0,
    status: "delivered",
  },
  {
    id: "HE-5010#",
    patientName: "كريم مجدي",
    pharmacy: "صيدلية علي وعلي - المعادي",
    date: "2023/10/23",
    time: "08:30 م",
    location: "القاهرة",
    totalPrice: 150.0,
    status: "cancelled",
  },
];

function StatusBadge({ status }: { status: OrderStatus }) {
  const configs: Record<OrderStatus, { label: string; classes: string }> = {
    pending: { label: "قيد الانتظار", classes: "bg-[#FEF3C7] text-[#AB6D3E] border-[#FEF3C7]" },
    preparing: { label: "جاري التحضير", classes: "bg-[#DBEAFE] text-[#2244B8] border-[#DBEAFE]" },
    shipping: { label: "قيد التوصيل", classes: "bg-[#E0E7FF] text-[#3930A7] border-[#E0E7FF]" },
    delivered: { label: "تم التسليم", classes: "bg-[#D1FAE5] text-[#107057] border-[#D1FAE5]" },
    cancelled: { label: "ملغى", classes: "bg-[#FFE4E6] text-[#A81F48] border-[#FFE4E6]" },
  };
  const config = configs[status];
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${config.classes}`}>
      {config.label}
    </span>
  );
}

export default function AdminOrdersView() {
  return (
    <div className="flex min-w-0 flex-1 flex-col bg-[#F8FAFC]">
      <main className="w-full min-w-0 px-6 py-8 sm:px-8 sm:py-10 lg:px-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[#0355AE]">إدارة طلبات الأدوية</h1>
          <p className="mt-2 text-slate-500">متابعة وإدارة كافة العمليات الشرائية والطلبات عبر محافظات مصر</p>
        </div>

        <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "إجمالي الطلبات", value: "1,250", change: "+12%", icon: ShoppingBag, bgColor: "#E5EEF7", textColor: "#0456AE" },
            { label: "طلبات نشطة", value: "85", change: null, icon: Clock, bgColor: "#FEF5E6", textColor: "#AB6D3E" },
            { label: "طلبات مكتملة", value: "1,120", change: null, icon: CheckCircle2, bgColor: "#E7F8F2", textColor: "#107057" },
            { label: "طلبات ملغاة", value: "45", change: null, icon: XCircle, bgColor: "#FEEBEF", textColor: "#A81F48" },
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
                  <span className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600">
                    {stat.change}
                  </span>
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
              />
            </div>
            <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto">
              <select className="min-w-[140px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20">
                <option>كل الحالات</option>
                <option>قيد الانتظار</option>
                <option>جاري التحضير</option>
                <option>تم التسليم</option>
              </select>
              <select className="min-w-[140px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20">
                <option>الفترة الزمنية</option>
                <option>اليوم</option>
                <option>آخر 7 أيام</option>
                <option>آخر 30 يوم</option>
              </select>
              <button
                type="button"
                className="flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-lg transition-colors hover:bg-brand/90"
              >
                <Filter className="h-4 w-4" />
                تطبيق الفلاتر
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
                {MOCK_ORDERS.map((order, idx) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + idx * 0.05 }}
                    className="group transition-colors hover:bg-slate-50/80"
                  >
                    <td className="px-6 py-5">
                      <span className="font-bold text-brand">{order.id}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="font-medium text-slate-900">{order.patientName}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm text-slate-600">{order.pharmacy}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-900">{order.date}</span>
                        <span className="mt-0.5 text-[10px] text-slate-400">{order.time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm text-slate-600">{order.location}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="font-bold text-slate-900">{order.totalPrice.toLocaleString()} ج.م</span>
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
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 p-6 sm:flex-row">
            <p className="text-sm text-slate-500">
              عرض <span className="font-bold text-slate-900">5</span> من أصل{" "}
              <span className="font-bold text-slate-900">1,250</span> طلب
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-lg border border-slate-200 p-2 text-slate-400 transition-all hover:bg-slate-50 hover:text-slate-600"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="h-10 w-10 rounded-lg bg-brand text-sm font-bold text-white shadow-md"
                >
                  1
                </button>
                <button
                  type="button"
                  className="h-10 w-10 rounded-lg text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
                >
                  2
                </button>
                <button
                  type="button"
                  className="h-10 w-10 rounded-lg text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
                >
                  3
                </button>
              </div>
              <button
                type="button"
                className="rounded-lg border border-slate-200 p-2 text-slate-400 transition-all hover:bg-slate-50 hover:text-slate-600"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        <footer className="mt-10 border-t border-slate-200/80 pt-8 text-center sm:mt-12">
          <p className="text-xs text-slate-400">© 2023 Healup مصر - جميع الحقوق محفوظة</p>
        </footer>
      </main>
    </div>
  );
}
