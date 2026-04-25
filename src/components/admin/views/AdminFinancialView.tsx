"use client";

import React from "react";
import { Download } from "lucide-react";
import StatsGrid from "@/components/admin/financial/StatsGrid";
import Filters from "@/components/admin/financial/Filters";
import SalesChart from "@/components/admin/financial/SalesChart";
import RevenueByCity from "@/components/admin/financial/RevenueByCity";
import TransactionsTable, { TransactionRow } from "@/components/admin/financial/TransactionsTable";
import TopPharmacies, { TopPharmacyRow } from "@/components/admin/financial/TopPharmacies";
import { adminService } from "@/services/adminService";
import { useLocale } from "@/contexts/LocaleContext";

export default function AdminFinancialView() {
  const { dir } = useLocale();
  const [topPharmacies, setTopPharmacies] = React.useState<TopPharmacyRow[]>([]);
  const [transactions, setTransactions] = React.useState<TransactionRow[]>([]);

  React.useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const orders = await adminService.listOrders();

        const tx = orders.slice(0, 8).map((o) => ({
          id: o.id,
          date: o.created_at,
          pharmacy: o.pharmacy?.name || "-",
          amount: Number(o.total_price || 0),
          status: o.status,
        }));

        const totals = new Map<string, { name: string; branch: string; total: number }>();
        for (const o of orders) {
          const key = String(o.pharmacy?.id || 0);
          const name = o.pharmacy?.name || "غير محدد";
          const city = o.pharmacy?.city || "غير محدد";
          const district = o.pharmacy?.district || "";
          const branch = district ? `${city}، ${district}` : city;
          const current = totals.get(key) || { name, branch, total: 0 };
          current.total += Number(o.total_price || 0);
          totals.set(key, current);
        }

        const top = Array.from(totals.values())
          .sort((a, b) => b.total - a.total)
          .slice(0, 5)
          .map((x, idx) => ({
            name: x.name,
            branch: x.branch,
            sales: x.total,
            rank: idx + 1,
          }));

        if (mounted) {
          setTransactions(tx);
          setTopPharmacies(top);
        }
      } catch {
        if (mounted) {
          setTransactions([]);
          setTopPharmacies([]);
        }
      }
    };

    void load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-0 min-w-0 flex-1 bg-[#F8FAFC] pb-12 font-sans" dir={dir}>
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
            <TopPharmacies items={topPharmacies} />
          </div>
          <div className="lg:col-span-2">
            <TransactionsTable items={transactions} />
          </div>
        </section>

        <footer className="mt-16 border-t border-gray-100 pt-8 text-center text-sm text-gray-400">
          <p>© ٢٠٢٤ Healup Health Platform. جميع الحقوق محفوظة لوزارة الصحة المصرية.</p>
        </footer>
      </main>
    </div>
  );
}
