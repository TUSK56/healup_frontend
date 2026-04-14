"use client";

import React from "react";
import {
  User,
  Bell,
  MapPin,
  Shield,
  Trash2,
  Home,
  Briefcase,
  Plus,
  Lock,
  CheckCircle2,
  Camera,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={cn("bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden", className)}
  >
    {children}
  </motion.div>
);

const SectionHeader = ({
  icon: Icon,
  title,
  action,
}: {
  icon: LucideIcon;
  title: string;
  action?: React.ReactNode;
}) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-healup-light-blue rounded-xl text-healup-blue">
        <Icon size={20} />
      </div>
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
    </div>
    {action}
  </div>
);

const InputField = ({
  label,
  value,
  icon: Icon,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  icon?: LucideIcon;
  type?: string;
  placeholder?: string;
}) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-slate-500 mr-1">{label}</label>
    <div className="relative">
      <input
        type={type}
        defaultValue={value}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-healup-blue/20 focus:border-healup-blue transition-all text-slate-700"
      />
      {Icon ? (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <Icon size={18} />
        </div>
      ) : null}
    </div>
  </div>
);

export default function PatientProfileContent() {
  return (
    <div className="min-h-screen flex flex-col rtl font-sans">
      <header className="bg-white border-bottom border-slate-100 sticky top-0 z-50 px-4 py-3 sm:px-8 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-healup-blue p-1.5 rounded-lg text-white">
            <Plus size={20} strokeWidth={3} />
          </div>
          <span className="text-2xl font-extrabold text-healup-blue tracking-tight">Healup</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </div>
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer">
            <User size={20} />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        <Card className="p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-right">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-slate-50 overflow-hidden shadow-lg">
                  <img
                    src="https://picsum.photos/seed/profile/200/200"
                    alt="Profile"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <button
                  type="button"
                  className="absolute bottom-1 right-1 p-2 bg-healup-blue text-white rounded-full shadow-md hover:scale-110 transition-transform"
                >
                  <Camera size={16} />
                </button>
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl font-extrabold text-slate-800">أحمد محمد</h1>
                <p className="text-slate-500 font-medium">مريض رقم: #HEAL-98231</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
                  <span className="px-3 py-1 bg-healup-light-blue text-healup-blue text-xs font-bold rounded-full">
                    فصيلة الدم: A+
                  </span>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    حساب موثق
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div
            className="lg:col-span-12 w-full space-y-8"
            style={{ maxWidth: 1120, marginRight: 0, marginLeft: "auto" }}
          >
            <Card className="p-8 min-h-[300px]">
              <SectionHeader icon={User} title="البيانات الأساسية" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="الاسم بالكامل" value="أحمد محمد" />
                <InputField label="البريد الإلكتروني" value="ahmed.mohamed@example.com" />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500 mr-1">رقم الهاتف</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      defaultValue="01012345678"
                      className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-healup-blue/20 focus:border-healup-blue transition-all text-slate-700 text-left"
                      dir="ltr"
                    />
                    <div className="w-20 px-3 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 text-center font-bold">
                      +20
                    </div>
                  </div>
                </div>
                <InputField label="تاريخ الميلاد" value="1990-05-15" type="date" />
              </div>
            </Card>

            <Card className="p-8 min-h-[250px]">
              <SectionHeader
                icon={MapPin}
                title="العناوين المسجلة"
                action={
                  <button
                    type="button"
                    className="text-healup-blue font-bold flex items-center gap-1 hover:underline"
                  >
                    <Plus size={18} />
                    <span>إضافة عنوان جديد</span>
                  </button>
                }
              />
              <div className="space-y-4">
                {[
                  { id: 1, type: "المنزل", address: "المعادي، القاهرة، شارع 9", icon: Home },
                  { id: 2, type: "العمل", address: "مدينة نصر، القاهرة، الحي السابع", icon: Briefcase },
                ].map((addr) => (
                  <div
                    key={addr.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-healup-blue/30 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-xl text-healup-blue shadow-sm">
                        <addr.icon size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{addr.type}</h4>
                        <p className="text-sm text-slate-500">{addr.address}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-8">
              <SectionHeader icon={Shield} title="الأمان" />
              <div className="p-6 border-2 border-dashed border-slate-100 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-healup-light-blue rounded-xl text-healup-blue">
                    <Lock size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">كلمة المرور</h4>
                    <p className="text-sm text-slate-500">آخر تغيير منذ 3 أشهر</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="px-6 py-2.5 bg-healup-light-blue text-healup-blue font-bold rounded-xl hover:bg-healup-blue hover:text-white transition-all"
                >
                  تغيير كلمة المرور
                </button>
              </div>
            </Card>

            <div className="flex items-center justify-end gap-4 pt-4">
              <button
                type="button"
                className="flex-1 sm:flex-none px-10 py-4 bg-white text-slate-500 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all"
              >
                إلغاء
              </button>
              <button
                type="button"
                className="flex-1 sm:flex-none px-10 py-4 bg-healup-blue text-white font-bold rounded-2xl shadow-lg shadow-healup-blue/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={20} />
                <span>حفظ التغييرات</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-12 py-8 border-t border-slate-100 text-center text-slate-400 text-sm">
        <p>© 2024 هيل أب للخدمات الطبية. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}
