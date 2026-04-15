import React, { useState } from 'react';
import { 
  Bell, 
  User, 
  LayoutDashboard, 
  Pill, 
  MapPin, 
  Clock, 
  ArrowLeft,
  ChevronDown,
  Search,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Types
type OrderStatus = 'all' | 'processing' | 'out-for-delivery' | 'completed';

interface Order {
  id: string;
  customer: string;
  status: 'processing' | 'out-for-delivery' | 'completed';
  medicine: string;
  time: string;
  driver?: string;
}

// Mock Data
const MOCK_ORDERS: Order[] = [
  {
    id: "HLP-12845",
    customer: "أحمد محمد عبد الله",
    status: "processing",
    medicine: "أوميبرازول (٤٠ ملجم) - ٢ علبة",
    time: "منذ ١٥ دقيقة",
  },
  {
    id: "HLP-12846",
    customer: "سارة أحمد علي",
    status: "out-for-delivery",
    medicine: "بانادول إكسترا - ١ علبة",
    time: "على بعد ٢.٥ كم - السائق: خالد",
  },
  {
    id: "HLP-12847",
    customer: "محمود ياسين",
    status: "processing",
    medicine: "أوجمنتين (١ جم) - ٣ علب",
    time: "منذ ٥ دقائق",
  },
  {
    id: "HLP-12848",
    customer: "ليلى إبراهيم",
    status: "out-for-delivery",
    medicine: "فولتارين جل - ٢ أنبوب",
    time: "على بعد ٠.٨ كم - السائق: سامي",
  }
];

const OrderCard = ({ order }: { order: Order; key?: string }) => {
  const isProcessing = order.status === 'processing';
  const isOutForDelivery = order.status === 'out-for-delivery';
  const isCompleted = order.status === 'completed';

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
    >
      <div className="p-6 flex-1">
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col gap-2">
            <div className="bg-[#E6EFF7] text-[#004BAB] px-2.5 py-1 rounded-lg w-fit">
              <span className="text-xs font-bold tracking-wider">{order.id}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800">{order.customer}</h3>
          </div>
          
          <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
            isProcessing ? 'bg-[#FEF3C7] text-amber-600' : 
            isOutForDelivery ? 'bg-[#DBEAFE] text-blue-600' : 
            'bg-emerald-50 text-emerald-600'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${
              isProcessing ? 'bg-amber-500' : 
              isOutForDelivery ? 'bg-blue-500' : 
              'bg-emerald-500'
            }`} />
            {isProcessing ? 'جاري التجهيز' : isOutForDelivery ? 'خرج للتوصيل' : 'مكتمل'}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-slate-600">
            <div className="p-2 bg-slate-50 rounded-lg">
              <Pill size={16} className="text-slate-400" />
            </div>
            <span className="text-sm font-medium">{order.medicine}</span>
          </div>
          
          <div className="flex items-center gap-3 text-slate-500">
            <div className="p-2 bg-slate-50 rounded-lg">
              {isOutForDelivery ? <MapPin size={16} className="text-slate-400" /> : <Clock size={16} className="text-slate-400" />}
            </div>
            <span className="text-sm">{order.time}</span>
          </div>
        </div>
      </div>

      <button className="w-full py-4 bg-[#0456AE] hover:bg-[#004494] text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 group">
        <span>عرض التفاصيل</span>
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
      </button>
    </motion.div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<OrderStatus>('all');

  const filteredOrders = MOCK_ORDERS.filter(order => 
    activeTab === 'all' ? true : order.status === activeTab
  );

  const stats = {
    all: MOCK_ORDERS.length,
    processing: MOCK_ORDERS.filter(o => o.status === 'processing').length,
    delivery: MOCK_ORDERS.filter(o => o.status === 'out-for-delivery').length,
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-bottom border-slate-100 sticky top-0 z-50 px-4 md:px-8 py-4">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-[#0456AE] tracking-tight">Healup</span>
              <div className="w-10 h-10 bg-[#0456AE] rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                <Pill size={24} />
              </div>
              <a href="#" className="text-[#0456AE] font-bold text-xs hover:underline">لوحة التحكم</a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-[#0456AE] hover:bg-blue-50 rounded-xl transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-[#0456AE] hover:bg-blue-50 rounded-xl transition-all">
              <User size={20} />
            </button>
            <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-slate-100">
              <img 
                src="https://picsum.photos/seed/pharmacist/100/100" 
                alt="Profile" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-8 md:py-12">
        <div className="mb-12 text-center md:text-right">
          <h1 className="text-4xl font-black text-slate-900 mb-3">الطلبات الحالية</h1>
          <p className="text-slate-500 text-lg">تابع حالة طلبات الأدوية الجارية وتفاصيل التوصيل</p>
        </div>

        {/* Tabs */}
        <div className="mb-10 flex flex-wrap justify-center md:justify-start items-center gap-2 border-b border-slate-100 pb-px">
          <button 
            onClick={() => setActiveTab('all')}
            className={`px-6 py-4 text-sm font-bold transition-all relative ${
              activeTab === 'all' ? 'text-[#0456AE]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            الكل ({stats.all})
            {activeTab === 'all' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-[#0456AE] rounded-t-full" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab('processing')}
            className={`px-6 py-4 text-sm font-bold transition-all relative ${
              activeTab === 'processing' ? 'text-[#0456AE]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            جاري التجهيز ({stats.processing})
            {activeTab === 'processing' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-[#0456AE] rounded-t-full" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab('out-for-delivery')}
            className={`px-6 py-4 text-sm font-bold transition-all relative ${
              activeTab === 'out-for-delivery' ? 'text-[#0456AE]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            خرج للتوصيل ({stats.delivery})
            {activeTab === 'out-for-delivery' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-[#0456AE] rounded-t-full" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab('completed')}
            className={`px-6 py-4 text-sm font-bold transition-all relative ${
              activeTab === 'completed' ? 'text-[#0456AE]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            المكتملة
            {activeTab === 'completed' && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-[#0456AE] rounded-t-full" />
            )}
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </AnimatePresence>
        </div>

        {/* Load More */}
        <div className="mt-12 flex justify-center">
          <button className="flex items-center gap-2 text-[#0456AE] font-bold hover:underline transition-all">
            <span>تحميل المزيد من الطلبات</span>
            <ChevronDown size={20} />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-8 px-4 md:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <CheckCircle2 size={18} className="text-blue-500" />
            <span>Healup - منصة إدارة الصيدليات والطلبات الطبية</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-[#0456AE] transition-colors">سياسة الخصوصية</a>
            <a href="#" className="hover:text-[#0456AE] transition-colors">الدعم الفني</a>
            <a href="#" className="hover:text-[#0456AE] transition-colors">اتصل بنا</a>
          </div>

          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <span>© 2024 Healup Platform</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
