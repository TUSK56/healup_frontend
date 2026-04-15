/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  LayoutDashboard, 
  ShoppingBag, 
  Store, 
  Users, 
  BarChart3, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Package,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

type OrderStatus = 'pending' | 'preparing' | 'shipping' | 'delivered' | 'cancelled';

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

// --- Mock Data ---

const MOCK_ORDERS: Order[] = [
  {
    id: 'HE-5021#',
    patientName: 'محمد علي محمود',
    pharmacy: 'صيدلية العزبي - الدقي',
    date: '2023/10/25',
    time: '10:30 ص',
    location: 'الجيزة',
    totalPrice: 450.00,
    status: 'pending'
  },
  {
    id: 'HE-5022#',
    patientName: 'سارة إبراهيم خليل',
    pharmacy: 'صيدليات مصر - مدينة نصر',
    date: '2023/10/25',
    time: '09:15 ص',
    location: 'القاهرة',
    totalPrice: 1280.50,
    status: 'preparing'
  },
  {
    id: 'HE-5018#',
    patientName: 'ياسين فوزي',
    pharmacy: 'صيدلية رشدي - لوران',
    date: '2023/10/24',
    time: '04:45 م',
    location: 'الإسكندرية',
    totalPrice: 320.00,
    status: 'shipping'
  },
  {
    id: 'HE-5015#',
    patientName: 'ليلى يوسف',
    pharmacy: 'صيدلية 19011 - المهندسين',
    date: '2023/10/24',
    time: '12:00 م',
    location: 'الجيزة',
    totalPrice: 890.00,
    status: 'delivered'
  },
  {
    id: 'HE-5010#',
    patientName: 'كريم مجدي',
    pharmacy: 'صيدلية علي وعلي - المعادي',
    date: '2023/10/23',
    time: '08:30 م',
    location: 'القاهرة',
    totalPrice: 150.00,
    status: 'cancelled'
  }
];

// --- Components ---

const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const configs: Record<OrderStatus, { label: string; classes: string }> = {
    pending: { label: 'قيد الانتظار', classes: 'bg-[#FEF3C7] text-[#AB6D3E] border-[#FEF3C7]' },
    preparing: { label: 'جاري التحضير', classes: 'bg-[#DBEAFE] text-[#2244B8] border-[#DBEAFE]' },
    shipping: { label: 'قيد التوصيل', classes: 'bg-[#E0E7FF] text-[#3930A7] border-[#E0E7FF]' },
    delivered: { label: 'تم التسليم', classes: 'bg-[#D1FAE5] text-[#107057] border-[#D1FAE5]' },
    cancelled: { label: 'ملغى', classes: 'bg-[#FFE4E6] text-[#A81F48] border-[#FFE4E6]' },
  };

  const config = configs[status];

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${config.classes}`}>
      {config.label}
    </span>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('orders');

  const navItems = [
    { id: 'dashboard', label: 'لوحة القيادة', icon: LayoutDashboard },
    { id: 'pharmacies', label: 'إدارة الصيدليات', icon: Store },
    { id: 'patients', label: 'إدارة المرضى', icon: Users },
    { id: 'orders', label: 'الطلبات', icon: ShoppingBag },
    { id: 'reports', label: 'التقارير', icon: BarChart3 },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans" dir="rtl">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-l border-slate-200 flex flex-col sticky top-0 h-screen z-50">
        {/* Sidebar Logo */}
        <div className="p-8 flex items-center gap-3">
          <div className="bg-brand p-2.5 rounded-xl shadow-lg shadow-brand/20">
            <Package className="text-white w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-brand tracking-tight leading-none">Healup</h1>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">لوحة الإدارة</p>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-brand text-white shadow-lg shadow-brand/30 translate-x-1' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-slate-400'}`} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100">
          <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200">
            <Settings className="w-5 h-5 text-slate-400" />
            الإعدادات
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              {/* Left: User & Notifications */}
              <div className="flex items-center gap-4 mr-auto">
                <div className="flex items-center gap-3 pl-2">
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-semibold text-slate-900 leading-none">أحمد محمد</p>
                    <p className="text-[10px] text-slate-500 mt-1">مدير النظام</p>
                  </div>
                  <img 
                    src="https://picsum.photos/seed/admin/100/100" 
                    alt="User" 
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Page Title */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">إدارة طلبات الأدوية</h1>
          <p className="text-slate-500 mt-2">متابعة وإدارة كافة العمليات الشرائية والطلبات عبر محافظات مصر</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'إجمالي الطلبات', value: '1,250', change: '+12%', icon: ShoppingBag, bgColor: '#E5EEF7', textColor: '#0456AE' },
            { label: 'طلبات نشطة', value: '85', change: null, icon: Clock, bgColor: '#FEF5E6', textColor: '#AB6D3E' },
            { label: 'طلبات مكتملة', value: '1,120', change: null, icon: CheckCircle2, bgColor: '#E7F8F2', textColor: '#107057' },
            { label: 'طلبات ملغاة', value: '45', change: null, icon: XCircle, bgColor: '#FEEBEF', textColor: '#A81F48' },
          ].map((stat, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={stat.label}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div 
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: stat.bgColor, color: stat.textColor }}
                >
                  <stat.icon className="w-6 h-6" />
                </div>
                {stat.change && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                    {stat.change}
                  </span>
                )}
              </div>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters & Table Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Filters Bar */}
          <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="البحث برقم الطلب، اسم المريض أو الصيدلية..." 
                className="w-full pr-12 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-sm"
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <select className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 min-w-[140px]">
                <option>كل الحالات</option>
                <option>قيد الانتظار</option>
                <option>جاري التحضير</option>
                <option>تم التسليم</option>
              </select>
              
              <select className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 min-w-[140px]">
                <option>الفترة الزمنية</option>
                <option>اليوم</option>
                <option>آخر 7 أيام</option>
                <option>آخر 30 يوم</option>
              </select>
              
              <button className="flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-brand/90 transition-colors shadow-lg shadow-brand/20">
                <Filter className="w-4 h-4" />
                تطبيق الفلاتر
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
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
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + idx * 0.05 }}
                    key={order.id} 
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <span className="font-bold text-brand">{order.id}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="font-medium text-slate-900">{order.patientName}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-slate-600 text-sm">{order.pharmacy}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-slate-900 text-sm font-medium">{order.date}</span>
                        <span className="text-slate-400 text-[10px] mt-0.5">{order.time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-slate-600 text-sm">{order.location}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="font-bold text-slate-900">{order.totalPrice.toLocaleString()} ج.م</span>
                    </td>
                    <td className="px-6 py-5">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button className="inline-flex items-center gap-2 text-brand hover:text-brand/80 font-bold text-xs transition-colors">
                        <Eye className="w-4 h-4" />
                        التفاصيل
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              عرض <span className="font-bold text-slate-900">5</span> من أصل <span className="font-bold text-slate-900">1,250</span> طلب
            </p>
            
            <div className="flex items-center gap-2">
              <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all">
                <ChevronRight className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-1">
                <button className="w-10 h-10 rounded-lg bg-brand text-white font-bold text-sm shadow-md shadow-brand/20">1</button>
                <button className="w-10 h-10 rounded-lg hover:bg-slate-100 text-slate-600 font-medium text-sm transition-colors">2</button>
                <button className="w-10 h-10 rounded-lg hover:bg-slate-100 text-slate-600 font-medium text-sm transition-colors">3</button>
              </div>
              
              <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all">
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-10 text-center">
        <p className="text-slate-400 text-xs">© 2023 Healup مصر - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  </div>
  );
}
