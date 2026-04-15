/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Bell, 
  ChevronLeft, 
  CreditCard, 
  Download, 
  MapPin, 
  MessageCircle, 
  Package, 
  Phone, 
  RefreshCcw, 
  Search, 
  ShoppingCart, 
  User,
  Pill,
  Stethoscope,
  ShieldCheck,
  Truck,
  Store
} from 'lucide-react';
import { motion } from 'motion/react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans" dir="rtl">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="flex h-16 w-full items-center px-4 sm:px-6 lg:px-8">
          {/* Logo Section (Right in RTL) */}
          <div className="flex flex-1 justify-start">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
                <Stethoscope size={24} />
              </div>
              <span className="text-2xl font-bold tracking-tight text-primary">Healup</span>
            </div>
          </div>

          {/* Navigation Section (Center) */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">الرئيسية</a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">الأدوية</a>
            <a href="#" className="text-sm font-medium text-primary border-b-2 border-primary pb-1">طلباتي</a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">الصيدليات</a>
          </nav>

          {/* Icons Section (Left in RTL) */}
          <div className="flex flex-1 justify-end">
            <div className="flex items-center gap-3">
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                <Bell size={20} />
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                <ShoppingCart size={20} />
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                <User size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <a href="#" className="hover:text-primary">طلباتي</a>
          <ChevronLeft size={16} />
          <span className="text-slate-900 font-medium">تفاصيل الطلب</span>
        </nav>

        {/* Order Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">طلب رقم #HLP-98234</h1>
            <p className="mt-1 text-slate-500">تم الطلب في 24 أكتوبر 2023 • 10:30 صباحاً</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all active:scale-95">
              <Download size={18} />
              تحميل الفاتورة
            </button>
            <button className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all active:scale-95">
              <RefreshCcw size={18} />
              إعادة الطلب
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <motion.div 
            className="lg:col-span-2 space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Order Status */}
            <motion.section variants={itemVariants} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">حالة الطلب</h2>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-bold text-success">
                  <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  تم التوصيل
                </span>
              </div>
              
              <div className="relative flex items-center justify-between px-4">
                {/* Progress Line */}
                <div className="absolute left-12 right-12 top-5 h-1 bg-slate-100">
                  <div className="h-full w-full bg-primary" />
                </div>
                
                {[
                  { label: 'تم التأكيد', step: 1, active: true },
                  { label: 'قيد التحضير', step: 2, active: true },
                  { label: 'خرج للتوصيل', step: 3, active: true },
                  { label: 'تم التسليم', step: 4, active: true },
                ].map((item) => (
                  <div key={item.step} className="relative flex flex-col items-center gap-3">
                    <div className={`z-10 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white shadow-sm transition-colors ${item.active ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                      {item.active && item.step === 4 ? <ShieldCheck size={20} /> : <span className="text-sm font-bold">{item.step}</span>}
                    </div>
                    <span className={`text-xs font-bold ${item.active ? 'text-slate-900' : 'text-slate-400'}`}>{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Medicines List */}
            <motion.section variants={itemVariants} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-lg font-bold text-slate-900">الأدوية المطلوبة</h2>
              <div className="space-y-4">
                {[
                  { name: 'بانادول أدفانس (500 ملجم)', desc: 'علبة 24 قرص', price: '15.00 ج.م', qty: 2, icon: Pill },
                  { name: 'فيتامين سي 1000 ملجم', desc: 'فوار 20 قرص', price: '45.00 ج.م', qty: 1, icon: Stethoscope },
                  { name: 'كمامات طبية 3 طبقات', desc: 'علبة 50 حبة', price: '25.50 ج.م', qty: 1, icon: Package },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-2xl border border-slate-50 bg-slate-50/30 p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
                        <item.icon size={28} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{item.name}</h3>
                        <p className="text-sm text-slate-500">{item.desc}</p>
                        <p className="mt-1 text-xs font-medium text-slate-400">الكمية: {item.qty}</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <span className="text-lg font-bold text-slate-900">{item.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Pharmacy Info */}
            <motion.section variants={itemVariants} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-lg font-bold text-slate-900 text-right">معلومات الصيدلية</h2>
              <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                {/* Info on the right (first child in RTL) */}
                <div className="flex flex-col items-end text-right">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-primary">
                      <Store size={32} />
                    </div>
                    <div className="flex flex-col items-end">
                      <h3 className="text-xl font-bold text-slate-900">صيدلية الشفاء الكبرى</h3>
                      <p className="text-slate-500">فرع شارع الملك فهد، الرياض</p>
                    </div>
                  </div>
                  
                  {/* Action Links */}
                  <div className="mt-4 flex items-center gap-6">
                    <button className="flex items-center gap-2 font-bold text-primary hover:text-primary-hover transition-colors">
                      <span className="text-sm">اتصال بالصيدلية</span>
                      <Phone size={18} />
                    </button>
                    <button className="flex items-center gap-2 font-bold text-primary hover:text-primary-hover transition-colors">
                      <span className="text-sm">دردشة</span>
                      <MessageCircle size={18} />
                    </button>
                  </div>
                </div>

                {/* Map on the left (second child in RTL) */}
                <div className="h-32 w-full overflow-hidden rounded-2xl border border-slate-100 sm:w-64">
                  <img 
                    src="https://picsum.photos/seed/map/400/300" 
                    alt="Map" 
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </motion.section>
          </motion.div>

          {/* Sidebar */}
          <motion.aside 
            className="space-y-6"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {/* Order Summary */}
            <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-lg font-bold text-slate-900">ملخص الطلب</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-slate-600">
                  <span>المجموع الفرعي</span>
                  <span className="font-medium">100.50 ج.م</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>رسوم التوصيل</span>
                  <span className="font-medium">15.00 ج.م</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>ضريبة القيمة المضافة (15%)</span>
                  <span className="font-medium">17.32 ج.م</span>
                </div>
                <div className="my-4 border-t border-dashed border-slate-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-slate-900">الإجمالي</span>
                    <span className="text-2xl font-black text-primary">132.82 ج.م</span>
                  </div>
                </div>
                <div className="rounded-2xl bg-primary/5 p-3 text-center">
                  <p className="text-sm font-bold text-primary">لقد وفرت 5.00 ج.م في هذا الطلب!</p>
                </div>
              </div>
            </section>

            {/* Delivery & Payment */}
            <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-lg font-bold text-slate-900">التوصيل والدفع</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <Truck size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">طريقة الاستلام</h4>
                    <p className="text-sm text-slate-500">توصيل للمنزل</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">عنوان التوصيل</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">حي الصحافة، شارع العليا، فيلا 45</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">طريقة الدفع</h4>
                    <div className="mt-1 flex items-center gap-2 rounded-lg bg-slate-50 px-2 py-1">
                      <span className="text-xs font-bold text-slate-400">مدى •••• 4582</span>
                      <div className="flex h-4 w-6 items-center justify-center rounded bg-slate-200 text-slate-500">
                        <CreditCard size={12} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Need Help */}
            <section className="overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-xl shadow-slate-900/20">
              <h3 className="text-xl font-bold">تحتاج مساعدة؟</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">إذا كان لديك أي استفسار حول طلبك، فريق الدعم متاح على مدار الساعة.</p>
              <button className="mt-6 w-full rounded-xl bg-white py-3 text-sm font-bold text-slate-900 hover:bg-slate-100 transition-colors">
                تحدث معنا
              </button>
            </section>
          </motion.aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                  <Stethoscope size={20} />
                </div>
                <span className="text-xl font-bold text-primary">Healup</span>
              </div>
              <p className="text-sm text-slate-400">© 2023 هيل أب. جميع الحقوق محفوظة.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-slate-500">
              <a href="#" className="hover:text-primary transition-colors">الشروط والأحكام</a>
              <a href="#" className="hover:text-primary transition-colors">سياسة الخصوصية</a>
              <a href="#" className="hover:text-primary transition-colors">مركز المساعدة</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
