/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Header from './components/Header';
import StatsGrid from './components/StatsGrid';
import Filters from './components/Filters';
import SalesChart from './components/SalesChart';
import RevenueByCity from './components/RevenueByCity';
import TransactionsTable from './components/TransactionsTable';
import TopPharmacies from './components/TopPharmacies';
import { Download } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen rtl font-sans pb-12">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#0254AD] mb-2">التقارير المالية</h1>
            <p className="text-gray-500">نظرة عامة على الأداء المالي للعمليات في محافظات مصر</p>
          </div>
          <button className="flex items-center justify-center gap-2 bg-[#0456AE] hover:opacity-90 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-95">
            <Download className="w-5 h-5" />
            <span>تصدير التقرير</span>
          </button>
        </div>

        {/* Stats Grid */}
        <section className="mb-8">
          <StatsGrid />
        </section>

        {/* Filters */}
        <section className="mb-8">
          <Filters />
        </section>

        {/* Charts Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <SalesChart />
          </div>
          <div className="lg:col-span-1">
            <RevenueByCity />
          </div>
        </section>

        {/* Table & Sidebar Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <TopPharmacies />
          </div>
          <div className="lg:col-span-2">
            <TransactionsTable />
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-100 text-center text-gray-400 text-sm">
          <p>© ٢٠٢٤ Healup Health Platform. جميع الحقوق محفوظة لوزارة الصحة المصرية.</p>
        </footer>
      </main>
    </div>
  );
}
