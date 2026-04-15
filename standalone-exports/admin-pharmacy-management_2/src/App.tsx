/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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
  MoreHorizontal,
  Plus,
  LayoutDashboard,
  Users,
  ShoppingCart,
  BarChart3,
  Settings,
  Bell,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

interface Pharmacy {
  id: string;
  name: string;
  subtitle: string;
  licenseNumber: string;
  region: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'pending';
  initials: string;
}

// --- Mock Data ---

const MOCK_PHARMACIES: Pharmacy[] = [
  {
    id: '1',
    name: 'صيدلية العزبي',
    subtitle: 'فرع المعادي، القاهرة',
    licenseNumber: 'LIC-88291#',
    region: 'القاهرة',
    joinDate: '12 مايو 2023',
    status: 'active',
    initials: 'ع'
  },
  {
    id: '2',
    name: 'صيدلية مصر',
    subtitle: 'شارع التحرير، الدقي',
    licenseNumber: 'LIC-44512#',
    region: 'الجيزة',
    joinDate: '05 يونيو 2023',
    status: 'inactive',
    initials: 'م'
  },
  {
    id: '3',
    name: 'صيدلية 19011',
    subtitle: 'حي سموحة، الإسكندرية',
    licenseNumber: 'LIC-11902#',
    region: 'الإسكندرية',
    joinDate: '21 أغسطس 2023',
    status: 'pending',
    initials: 'ص'
  }
];

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
  <button className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
    active 
      ? 'bg-brand text-white shadow-lg shadow-brand/20' 
      : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
  }`}>
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </button>
);

const Sidebar = () => (
  <aside className="w-72 bg-white border-l border-slate-100 flex flex-col h-screen sticky top-0 z-50">
    <div className="px-8 py-10 flex items-center gap-3 border-b border-slate-50">
      <div className="bg-brand w-11 h-11 rounded-xl flex items-center justify-center shadow-lg shadow-brand/20">
        <Plus className="text-white w-7 h-7" />
      </div>
      <div className="text-right">
        <h2 className="text-2xl font-bold text-brand tracking-tight">Healup</h2>
        <p className="text-[10px] text-slate-400 font-bold">لوحة الإدارة</p>
      </div>
    </div>

    <nav className="flex-1 px-6 py-8 space-y-2">
      <SidebarItem icon={LayoutDashboard} label="لوحة القيادة" />
      <SidebarItem icon={Store} label="إدارة الصيدليات" active />
      <SidebarItem icon={Users} label="إدارة المرضى" />
      <SidebarItem icon={ShoppingCart} label="الطلبات" />
      <SidebarItem icon={BarChart3} label="التقارير" />
    </nav>

    <div className="px-6 py-8 border-t border-slate-50">
      <SidebarItem icon={Settings} label="الإعدادات" />
    </div>
  </aside>
);

const StatCard = ({ title, value, change, icon: Icon, colorClass, iconBgClass }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-6 flex-1"
  >
    <div className="flex justify-between items-start">
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <div className={`p-3 rounded-xl ${iconBgClass}`}>
        <Icon className={`w-6 h-6 ${colorClass}`} />
      </div>
    </div>
    <div className="flex flex-col items-start text-left">
      <h3 className="text-3xl font-bold text-slate-800 mb-1">{value}</h3>
      <div className="flex items-center gap-1">
        <span className={`text-xs font-bold ${change.startsWith('+') ? 'text-success' : 'text-rose-500'}`}>
          {change}
        </span>
        <span className="text-[10px] text-slate-400 font-medium">هذا الشهر</span>
      </div>
    </div>
  </motion.div>
);

const StatusBadge = ({ status }: { status: Pharmacy['status'] }) => {
  const configs = {
    active: { label: 'نشط', bg: 'bg-success-light', text: 'text-success', dot: 'bg-success' },
    inactive: { label: 'غير نشط', bg: 'bg-slate-50', text: 'text-slate-500', dot: 'bg-slate-300' },
    pending: { label: 'قيد المراجعة', bg: 'bg-warning-light', text: 'text-warning', dot: 'bg-warning' }
  };

  const config = configs[status];

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${config.bg} ${config.text} text-xs font-semibold`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </div>
  );
};

const Toggle = ({ active }: { active: boolean }) => (
  <div className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${active ? 'bg-success' : 'bg-slate-200'}`}>
    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${active ? 'left-1' : 'left-6'}`} />
  </div>
);

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen font-sans flex bg-[#F8FAFC]" dir="rtl">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-slate-100 px-10 py-4 flex justify-between items-center sticky top-0 z-40 shadow-sm">
          <div className="relative w-96">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="البحث عن طلبات، مرضى، أو صيدليات..."
              className="w-full pr-10 pl-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand/10 focus:border-brand transition-all"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:text-brand transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 left-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-3 pl-2 border-l border-slate-100">
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800">أحمد علي</p>
                <p className="text-[10px] text-slate-400 font-medium">مدير النظام</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                <img src="https://picsum.photos/seed/avatar/100/100" alt="Avatar" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </header>

        <main className="p-10 space-y-8">
          {/* Page Title */}
          <section className="space-y-1">
            <h1 className="text-3xl font-bold text-slate-900">إدارة الصيدليات</h1>
            <p className="text-slate-500 font-medium">متابعة وإدارة كافة الصيدليات المسجلة في منصة Healup</p>
          </section>

          {/* Stats Grid */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

          {/* Filters & Table Section */}
          <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            {/* Filter Bar */}
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="ابحث باسم الصيدلية، رقم الترخيص، أو المنطقة..."
                  className="w-full pr-12 pl-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors">
                  <span>كل المناطق</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors">
                  <span>كل الحالات</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-2xl text-sm font-bold hover:bg-brand/90 transition-colors shadow-lg shadow-brand/20">
                  <Filter className="w-4 h-4" />
                  <span>تصفية</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
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
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand font-bold text-lg">
                            {pharmacy.initials}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{pharmacy.name}</p>
                            <p className="text-slate-400 text-[10px] font-medium">{pharmacy.subtitle}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm font-mono text-slate-500">{pharmacy.licenseNumber}</td>
                      <td className="px-6 py-5 text-sm font-medium text-slate-600">{pharmacy.region}</td>
                      <td className="px-6 py-5 text-sm text-slate-500">{pharmacy.joinDate}</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-4">
                          {pharmacy.status !== 'pending' && <Toggle active={pharmacy.status === 'active'} />}
                          <StatusBadge status={pharmacy.status} />
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-slate-400 hover:text-brand hover:bg-brand-light rounded-lg transition-all">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-brand hover:bg-brand-light rounded-lg transition-all">
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-6 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-slate-400 font-medium">
                عرض <span className="text-slate-800 font-bold">1-10</span> من أصل <span className="text-slate-800 font-bold">1,250</span> صيدلية
              </p>
              <div className="flex items-center gap-2">
                <button className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50">
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, '...', 125].map((page, i) => (
                    <button 
                      key={i}
                      className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                        page === 1 
                          ? 'bg-brand text-white shadow-lg shadow-brand/20' 
                          : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                      } ${page === '...' ? 'cursor-default' : ''}`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="w-full px-10 py-8 text-center border-t border-slate-100 mt-auto">
          <p className="text-slate-400 text-xs font-medium">
            © 2024 Healup. جميع الحقوق محفوظة لنظام إدارة الخدمات الطبية.
          </p>
        </footer>
      </div>
    </div>
  );
}
