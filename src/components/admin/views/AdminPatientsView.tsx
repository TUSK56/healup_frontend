"use client";

import React from "react";
import {
  Users,
  UserCheck,
  UserPlus,
  Calendar,
  Search,
  Eye,
  Edit2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "motion/react";

const patients = [
  {
    id: "PA-1029",
    name: "أحمد محمود السيد",
    email: "ahmed.m@email.com",
    phone: "010 1234 5678",
    joinDate: "12 أكتوبر 2023",
    status: "نشط",
    image: "https://picsum.photos/seed/ahmed/100/100",
  },
  {
    id: "PA-1030",
    name: "سارة علي حسن",
    email: "sara.h@email.com",
    phone: "011 9876 5432",
    joinDate: "05 سبتمبر 2023",
    status: "نشط",
    image: "https://picsum.photos/seed/sara/100/100",
  },
  {
    id: "PA-1031",
    name: "محمد إبراهيم كمال",
    email: "faisal.k@email.com",
    phone: "012 4442 2211",
    joinDate: "20 أغسطس 2023",
    status: "غير نشط",
    image: "https://picsum.photos/seed/mohamed/100/100",
  },
  {
    id: "PA-1032",
    name: "منى عبد العزيز",
    email: "laila.m@email.com",
    phone: "015 1112 2233",
    joinDate: "15 يوليو 2023",
    status: "نشط",
    image: "https://picsum.photos/seed/mona/100/100",
  },
  {
    id: "PA-1033",
    name: "ياسين مصطفى",
    email: "youssef.g@email.com",
    phone: "010 7778 8999",
    joinDate: "02 يونيو 2023",
    status: "غير نشط",
    image: "https://picsum.photos/seed/yassin/100/100",
  },
];

const stats = [
  {
    title: "إجمالي المرضى",
    value: "1,240",
    subValue: "+12% من الشهر الماضي",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "المرضى النشطون",
    value: "850",
    subValue: "68.5% من الإجمالي",
    icon: UserCheck,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "مرضى جدد",
    value: "120",
    subValue: "خلال الـ 30 يوم الماضية",
    icon: UserPlus,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "معدل المواعيد",
    value: "45",
    subValue: "موعد/يوم كمتوسط",
    icon: Calendar,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
];

export default function AdminPatientsView() {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-slate-50/50">
      <main className="flex-1 overflow-y-auto p-8">
        <section className="mb-8 text-right">
          <h2 className="mb-1 text-3xl font-bold text-[#0355AE]">إدارة المرضى</h2>
          <p className="text-sm text-slate-500">نظرة عامة على جميع المرضى المسجلين في المنصة</p>
        </section>

        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
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
                <p
                  className={`text-xs ${
                    stat.title === "إجمالي المرضى" ? "text-green-600" : "text-slate-400"
                  }`}
                >
                  {stat.subValue}
                </p>
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
                {patients.map((patient, index) => (
                  <tr key={index} className="transition-colors hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={patient.image}
                          alt=""
                          className="h-10 w-10 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{patient.name}</p>
                          <p className="text-xs text-slate-500">ID: {patient.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{patient.email}</td>
                    <td className="px-6 py-4 text-slate-600">{patient.phone}</td>
                    <td className="px-6 py-4 text-slate-600">{patient.joinDate}</td>
                    <td className="px-6 py-4">
                      <span
                        className={
                          patient.status === "نشط"
                            ? "inline-flex rounded-md border-none bg-green-50 px-2 py-1 text-xs font-medium text-green-700"
                            : "inline-flex rounded-md border-none bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600"
                        }
                      >
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-blue-600"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-blue-600"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 p-6 sm:flex-row">
            <p className="order-2 text-sm text-slate-500 sm:order-1">عرض 1 إلى 5 من أصل 1,240 مريض</p>
            <div className="order-1 flex items-center gap-2 sm:order-2">
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white hover:bg-slate-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="h-9 w-9 rounded-md bg-blue-600 text-sm font-medium text-white hover:bg-blue-700"
              >
                1
              </button>
              <button
                type="button"
                className="h-9 w-9 rounded-md border border-slate-200 bg-white text-sm hover:bg-slate-50"
              >
                2
              </button>
              <button
                type="button"
                className="h-9 w-9 rounded-md border border-slate-200 bg-white text-sm hover:bg-slate-50"
              >
                3
              </button>
              <span className="px-2 text-slate-400">...</span>
              <button
                type="button"
                className="h-9 w-9 rounded-md border border-slate-200 bg-white text-sm hover:bg-slate-50"
              >
                24
              </button>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white hover:bg-slate-50"
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
