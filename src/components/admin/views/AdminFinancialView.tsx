"use client";

import { Download } from "lucide-react";
import StatsGrid from "@/components/admin/financial/StatsGrid";
import Filters from "@/components/admin/financial/Filters";
import SalesChart from "@/components/admin/financial/SalesChart";
import RevenueByCity from "@/components/admin/financial/RevenueByCity";
import TransactionsTable from "@/components/admin/financial/TransactionsTable";
import TopPharmacies from "@/components/admin/financial/TopPharmacies";

export default function AdminFinancialView() {
  return (
    <div className="min-h-0 min-w-0 flex-1 bg-[#F8FAFC] pb-12 font-sans rtl">
      <main className="w-full min-w-0 px-6 py-8 sm:px-8 lg:px-10">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="mb-2 text-3xl font-black text-[#0254AD]">التقارير المالية</h1>
            <p className="text-gray-500">نظرة عامة على الأداء المالي للعمليات في محافظات مصر</p>
          </div>
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#0456AE] px-6 py-3 font-bold text-white shadow-lg shadow-blue-200 transition-all hover:opacity-90 active:scale-95"
          >
            <Download className="h-5 w-5" />
            <span>تصدير التقرير</span>
          </button>
        </div>

        <section className="mb-8">
          <StatsGrid />
        </section>

        <section className="mb-8">
          <Filters />
        </section>

        <section className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SalesChart />
          </div>
          <div className="lg:col-span-1">
            <RevenueByCity />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <TopPharmacies />
          </div>
          <div className="lg:col-span-2">
            <TransactionsTable />
          </div>
        </section>

        <footer className="mt-16 border-t border-gray-100 pt-8 text-center text-sm text-gray-400">
          <p>© ٢٠٢٤ Healup Health Platform. جميع الحقوق محفوظة لوزارة الصحة المصرية.</p>
        </footer>
      </main>
    </div>
  );
}
