"use client";

import React from "react";

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = React.useState("Healup");
  const [supportEmail, setSupportEmail] = React.useState("support@healup.test");
  const [saved, setSaved] = React.useState(false);

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-w-0 flex-1 bg-[#F8FAFC] p-8" dir="rtl">
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold text-[#0355AE]">إعدادات النظام</h1>
        <p className="mb-6 text-sm text-slate-500">صفحة إعدادات الإدارة</p>

        <form className="space-y-4" onSubmit={onSave}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">اسم المنصة</label>
            <input
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">بريد الدعم</label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <button type="submit" className="rounded-lg bg-[#0456AE] px-5 py-2 text-sm font-bold text-white">
            حفظ التغييرات
          </button>

          {saved ? <p className="text-sm text-green-600">تم حفظ الإعدادات بنجاح.</p> : null}
        </form>
      </div>
    </div>
  );
}
