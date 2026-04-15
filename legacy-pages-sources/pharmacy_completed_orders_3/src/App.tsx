import { useState } from 'react';
import { 
  Search, 
  Eye, 
  FileText, 
  CheckCircle2, 
  ChevronDown, 
  User,
  MapPin,
  Pill
} from 'lucide-react';
import { motion } from 'motion/react';

interface Order {
  id: string;
  patientName: string;
  amount: string;
  date: string;
  time: string;
  items: string[];
}

const orders: Order[] = [
  {
    id: 'HLP-12000',
    patientName: 'أحمد محمد عبد الله',
    amount: '145.50 ج.م',
    date: '24 مايو 2024',
    time: '10:30 صباحاً',
    items: ['بانادول نايت', 'فيتامين سي (1000mg)', 'أوميبرازول']
  },
  {
    id: 'HLP-11995',
    patientName: 'سارة علي الشهري',
    amount: '89.00 ج.م',
    date: '23 مايو 2024',
    time: '04:15 مساءً',
    items: ['أومنيسيف شراب', 'بروفين للأطفال']
  },
  {
    id: 'HLP-11880',
    patientName: 'خالد بن فهد',
    amount: '52.25 ج.م',
    date: '22 مايو 2024',
    time: '09:00 مساءً',
    items: ['كريم ميبو', 'شاش معقم', 'لاصق جروح']
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('الكل');

  return (
    <div className="min-h-screen bg-brand-bg pb-12" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-4 py-3 sticky top-0 z-50 shadow-sm">
        <div className="w-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-brand-blue font-bold text-xl">
              <span>Healup</span>
              <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center text-white">
                <Pill size={20} />
              </div>
            </div>
            <button className="text-brand-blue font-medium text-sm hover:opacity-80 transition-opacity">
              <span>لوحة التحكم</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-800">صيدلية الشفاء المركزية</h2>
              <div className="flex items-center gap-1 text-[10px] text-slate-500">
                <MapPin size={10} />
                <span>الفرع الرئيسي - الرياض</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
              <img 
                src="https://picsum.photos/seed/pharmacist/100/100" 
                alt="User" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">الطلبات المكتملة</h1>

        {/* Search Bar */}
        <div className="relative mb-6">
          <input 
            type="text" 
            placeholder="البحث برقم الطلب أو اسم المريض..."
            className="w-full bg-white border border-slate-200 rounded-xl py-3 px-12 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all shadow-sm"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        </div>

        {/* Filters */}
        <div className="bg-white p-1.5 rounded-xl border border-slate-200 flex mb-8 shadow-sm">
          {['الكل', 'اليوم', 'هذا الأسبوع', 'هذا الشهر'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab 
                ? 'bg-brand-blue text-white shadow-md' 
                : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Order List */}
        <div className="space-y-4">
          {orders.map((order, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={order.id}
              className="bg-white rounded-2xl border border-slate-100 p-5 flex items-stretch gap-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Right Section (Checkmark) */}
              <div className="flex items-center justify-center pr-2">
                <div className="w-16 h-16 rounded-full bg-brand-light-green flex items-center justify-center text-brand-green shadow-inner">
                  <CheckCircle2 size={32} />
                </div>
              </div>

              {/* Left Section (Content) */}
              <div className="flex-1 flex flex-col justify-between text-right">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-brand-blue font-bold text-lg">{order.id}</span>
                    <span className="bg-brand-light-green text-brand-green text-[10px] font-bold px-2 py-0.5 rounded-md">مكتمل</span>
                  </div>
                  <span className="text-slate-400 text-xs">{order.date} - {order.time}</span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-slate-700 font-bold">
                    <User size={16} className="text-slate-400" />
                    <span>{order.patientName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <Pill size={14} className="text-slate-300" />
                    <span>{order.items.join('، ')}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-400 text-xs">الإجمالي:</span>
                    <span className="text-slate-900 font-bold text-xl">{order.amount}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="bg-white border border-slate-100 text-slate-700 px-6 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm">
                      <FileText size={14} />
                      <span>عرض الفاتورة</span>
                    </button>
                    <button className="bg-brand-blue text-white px-6 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-brand-blue/90 transition-colors">
                      <Eye size={14} />
                      <span>التفاصيل</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-10 flex justify-center">
          <button className="border-2 border-brand-blue text-brand-blue px-8 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-brand-blue hover:text-white transition-all group">
            <span>تحميل المزيد من الطلبات</span>
            <ChevronDown size={18} className="group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 text-center text-slate-400 text-[10px]">
        <p>© 2024 منصة Healup الطبية - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
}
