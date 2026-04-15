import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Pill, 
  Users, 
  ShoppingCart, 
  FileText, 
  Settings, 
  Bell, 
  Search, 
  ShoppingBag, 
  CheckCircle, 
  Clock,
  MoreHorizontal,
  ChevronLeft,
  Plus,
  Hospital,
  ClipboardList,
  Wallet,
  Check,
  X
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { cn } from './lib/utils';
import { motion } from 'motion/react';

// --- Mock Data ---

const stats = [
  {
    title: 'إجمالي المرضى',
    value: '١٢,٤٥٠',
    change: '+١٢٪',
    icon: Users,
    color: 'text-blue-600',
    bg: 'bg-blue-50'
  },
  {
    title: 'الصيدليات المسجلة',
    value: '٨٤٢',
    change: '+٥٪',
    icon: Hospital,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50'
  },
  {
    title: 'طلبات اليوم',
    value: '١٥٦',
    change: '+٨٪',
    icon: ClipboardList,
    color: 'text-sky-600',
    bg: 'bg-sky-50'
  },
  {
    title: 'إجمالي الإيرادات',
    value: '٤٥,٠٠٠ ج.م',
    change: '+١٥٪',
    icon: Wallet,
    color: 'text-blue-700',
    bg: 'bg-blue-100'
  }
];

const recentOrders = [
  {
    id: 'ORD-1245#',
    time: 'منذ ٥ دقائق',
    status: 'قيد التوصيل',
    statusColor: 'bg-amber-100 text-amber-700',
    icon: ShoppingBag,
    iconColor: 'text-blue-600'
  },
  {
    id: 'ORD-1244#',
    time: 'منذ ١٢ دقيقة',
    status: 'مكتمل',
    statusColor: 'bg-emerald-100 text-emerald-700',
    icon: CheckCircle,
    iconColor: 'text-emerald-600'
  },
  {
    id: 'ORD-1243#',
    time: 'منذ ١٨ دقيقة',
    status: 'قيد المعالجة',
    statusColor: 'bg-orange-100 text-orange-700',
    icon: Clock,
    iconColor: 'text-orange-600'
  }
];

const chartData = [
  { name: 'السبت', value: 40 },
  { name: 'الأحد', value: 65 },
  { name: 'الاثنين', value: 50 },
  { name: 'الثلاثاء', value: 80 },
  { name: 'الأربعاء', value: 112 },
  { name: 'الخميس', value: 75 },
  { name: 'الجمعة', value: 60 },
];

const pharmacyRequests = [
  {
    name: 'صيدلية الشفاء',
    location: 'القاهرة، حي المعادي',
    license: '#99283741',
    status: 'بانتظار المراجعة',
    avatar: 'https://picsum.photos/seed/pharm1/40/40'
  },
  {
    name: 'صيدلية الدواء بلس',
    location: 'الجيزة، شارع الهرم',
    license: '#88273645',
    status: 'بانتظار المراجعة',
    avatar: 'https://picsum.photos/seed/pharm2/40/40'
  },
  {
    name: 'مركز العناية الطبية',
    location: 'الإسكندرية، حي سموحة',
    license: '#77364512',
    status: 'بانتظار المراجعة',
    avatar: 'https://picsum.photos/seed/pharm3/40/40'
  }
];

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
  <div className={cn(
    "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200",
    active ? "bg-[#0055B3] text-white shadow-lg shadow-blue-900/20" : "text-slate-500 hover:bg-slate-100"
  )}>
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans" dir="rtl">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-l border-slate-200 flex flex-col p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-[#0055B3] rounded-xl flex items-center justify-center text-white">
            <Plus size={24} strokeWidth={3} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#0055B3] leading-tight">Healup</h1>
            <p className="text-xs text-slate-400 font-medium">لوحة الإدارة</p>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          <SidebarItem icon={LayoutDashboard} label="لوحة القيادة" active={activeTab === 'dashboard'} />
          <SidebarItem icon={Hospital} label="إدارة الصيدليات" />
          <SidebarItem icon={Users} label="إدارة المرضى" />
          <SidebarItem icon={ShoppingCart} label="الطلبات" />
          <SidebarItem icon={FileText} label="التقارير" />
        </nav>

        <div className="pt-6 border-t border-slate-100">
          <SidebarItem icon={Settings} label="الإعدادات" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="relative w-96">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="البحث عن طلبات، مرضى، أو صيدليات..." 
              className="w-full bg-slate-50 border-none rounded-xl py-2.5 pr-11 pl-4 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 pr-6 border-r border-slate-200">
              <div className="text-left">
                <p className="text-sm font-bold text-slate-900">أحمد علي</p>
                <p className="text-[10px] text-slate-400 font-medium">مدير النظام</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-orange-100 border-2 border-white shadow-sm overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed" alt="User" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={cn("p-3 rounded-xl", stat.bg)}>
                    <stat.icon className={stat.color} size={24} />
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                    {stat.change}
                  </span>
                </div>
                <p className="text-slate-500 text-sm font-medium mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
              </motion.div>
            ))}
          </div>

          {/* Middle Section: Orders & Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Weekly Trends Chart */}
            <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-slate-900">اتجاهات الطلبات الأسبوعية</h3>
                <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg">
                  <button className="px-3 py-1 text-xs font-bold text-slate-600 bg-white shadow-sm rounded-md">آخر ٧ أيام</button>
                  <button className="px-3 py-1 text-xs font-bold text-slate-400 hover:text-slate-600">آخر ٣٠ يوم</button>
                </div>
              </div>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                      dy={10}
                    />
                    <YAxis hide />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-slate-900 text-white px-3 py-2 rounded-lg text-xs font-bold shadow-xl">
                              {payload[0].value} طلب
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.value > 100 ? '#0055B3' : '#E2E8F0'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-900">أحدث الطلبات النشطة</h3>
                <button className="text-blue-600 text-sm font-bold hover:underline">عرض الكل</button>
              </div>
              <div className="space-y-4 flex-1">
                {recentOrders.map((order, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors">
                    <div className="p-2.5 bg-blue-50 rounded-xl">
                      <order.icon className="text-blue-600" size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900">{order.id}</p>
                      <p className="text-xs text-slate-400">{order.time}</p>
                    </div>
                    <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-lg", order.statusColor)}>
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
              <button className="mt-6 w-full py-3 border border-slate-200 rounded-xl text-slate-600 text-sm font-bold hover:bg-slate-50 transition-colors">
                عرض كافة الطلبات
              </button>
            </div>
          </div>

          {/* Bottom Section: Pharmacy Requests */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">طلبات الصيدليات الجديدة</h3>
              <button className="text-blue-600 text-sm font-bold hover:underline">عرض الكل</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">اسم الصيدلية</th>
                    <th className="px-6 py-4">الموقع</th>
                    <th className="px-6 py-4">رقم الترخيص</th>
                    <th className="px-6 py-4">الحالة</th>
                    <th className="px-6 py-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pharmacyRequests.map((req, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={req.avatar} alt={req.name} className="w-10 h-10 rounded-xl object-cover" referrerPolicy="no-referrer" />
                          <span className="font-bold text-slate-900">{req.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{req.location}</td>
                      <td className="px-6 py-4 text-sm font-mono text-slate-500">{req.license}</td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg">
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
                            قبول
                          </button>
                          <button className="px-4 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100 transition-colors">
                            رفض
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
