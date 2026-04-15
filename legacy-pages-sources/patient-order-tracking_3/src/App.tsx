/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  MapPin, 
  Phone, 
  User, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Package, 
  Home, 
  MessageSquare, 
  XCircle, 
  ChevronLeft,
  Bell,
  HelpCircle,
  Apple,
  Smartphone,
  Search,
  Store,
} from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans rtl" dir="rtl">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Right side: Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Store className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-primary">Healup</span>
            </div>

            {/* Left side: Icons & Links */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-8">
                <Link href="/patient-profile" className="text-slate-500 hover:text-primary font-medium transition-colors">الملف الشخصي</Link>
                <Link href="/patient-review-orders" className="text-primary border-b-2 border-primary pb-1 font-bold">طلباتي</Link>
                <Link href="/patient-home" className="text-slate-500 hover:text-primary font-medium transition-colors">الرئيسية</Link>
              </div>

              <div className="flex items-center gap-3">
                <button className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 relative">
                  <Bell className="w-5 h-5 text-slate-700" />
                  <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-danger rounded-full"></span>
                </button>
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100">
                  <Store className="w-5 h-5 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Order Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">تتبع الطلب</h1>
            <p className="text-slate-500">رقم الطلب: <span className="font-mono text-slate-700">HP-9872541#</span></p>
          </div>
          <div className="bg-primary-light border border-primary/20 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Clock className="text-white w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-primary font-medium">الوقت المتوقع للتوصيل</p>
              <p className="text-2xl font-bold text-primary">20 - 30 دقيقة</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content - Tracking & Map */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-8 space-y-6"
          >
            {/* Timeline */}
            <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <div className="relative">
                {/* Vertical Line Segments */}
                <div className="absolute right-6 top-6 h-24 w-0.5 bg-[#00B87E]"></div>
                <div className="absolute right-6 top-[120px] h-24 w-0.5 bg-[#0456AE]"></div>
                <div className="absolute right-6 top-[216px] h-24 w-0.5 bg-slate-100"></div>

                <div className="space-y-12">
                  {/* Step 1 */}
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative flex items-start gap-8"
                  >
                    <div className="absolute right-0 w-12 h-12 bg-[#00B87E] rounded-full flex items-center justify-center z-10 border-4 border-white">
                      <CheckCircle2 className="text-white w-6 h-6" />
                    </div>
                    <div className="mr-16">
                      <h3 className="font-bold text-slate-900">تم استلام الطلب</h3>
                      <p className="text-sm text-slate-500">تم تأكيد طلبك من قبل الصيدلية</p>
                      <p className="text-xs text-slate-400 mt-1">10:00 ص</p>
                    </div>
                  </motion.div>

                  {/* Step 2 */}
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="relative flex items-start gap-8"
                  >
                    <div className="absolute right-0 w-12 h-12 bg-[#00B87E] rounded-full flex items-center justify-center z-10 border-4 border-white">
                      <CheckCircle2 className="text-white w-6 h-6" />
                    </div>
                    <div className="mr-16">
                      <h3 className="font-bold text-slate-900">جاري التجهيز</h3>
                      <p className="text-sm text-slate-500">يتم تحضير الأدوية وتغليفها</p>
                      <p className="text-xs text-slate-400 mt-1">10:15 ص</p>
                    </div>
                  </motion.div>

                  {/* Step 3 */}
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="relative flex items-start gap-8"
                  >
                    <div className="absolute right-0 w-12 h-12 bg-[#0456AE] rounded-full flex items-center justify-center z-10 border-4 border-white shadow-lg shadow-primary/20">
                      <Truck className="text-white w-6 h-6" />
                    </div>
                    <div className="mr-16">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-primary">خارج للتوصيل</h3>
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">جاري الآن</span>
                      </div>
                      <p className="text-sm text-slate-500">السائق في طريقه إليك الآن</p>
                    </div>
                  </motion.div>

                  {/* Step 4 */}
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="relative flex items-start gap-8 opacity-40"
                  >
                    <div className="absolute right-0 w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center z-10 border-4 border-white">
                      <Home className="text-slate-400 w-6 h-6" />
                    </div>
                    <div className="mr-16">
                      <h3 className="font-bold text-slate-900">تم التسليم</h3>
                      <p className="text-sm text-slate-500">متوقع خلال 15 دقيقة</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Map Placeholder */}
            <section className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 relative">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-sm absolute top-0 left-0 right-0 z-10">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <h2 className="font-bold text-slate-900">موقع المندوب</h2>
                </div>
                <button className="text-xs font-bold text-primary flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  تتبع مباشر
                </button>
              </div>
              <div className="h-[400px] bg-slate-200 relative">
                {/* Mock Map Background */}
                <img 
                  src="https://picsum.photos/seed/riyadh-map/1200/800" 
                  alt="Map" 
                  className="w-full h-full object-cover opacity-50 grayscale"
                  referrerPolicy="no-referrer"
                />
                {/* Map UI Elements */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-12 h-12 bg-primary/20 rounded-full animate-ping absolute -inset-0"></div>
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center relative border-4 border-white shadow-xl">
                      <Truck className="text-white w-6 h-6" />
                    </div>
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white px-3 py-1.5 rounded-lg shadow-lg border border-slate-100 whitespace-nowrap">
                      <p className="text-[10px] text-slate-400">المندوب: أحمد علي</p>
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45 border-r border-b border-slate-100"></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Support Section */}
            <section className="bg-primary-light rounded-2xl p-6 border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <HelpCircle className="text-white w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">تحتاج مساعدة بخصوص طلبك؟</h3>
                  <p className="text-sm text-slate-500">فريق الدعم متوفر 24/7 لمساعدتك</p>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button className="flex-1 md:flex-none px-6 py-3 bg-white border border-danger/20 text-danger font-bold rounded-xl hover:bg-danger/5 transition-colors flex items-center justify-center gap-2">
                  <XCircle className="w-5 h-5" />
                  إلغاء الطلب
                </button>
                <button className="flex-1 md:flex-none px-6 py-3 bg-white border border-primary/20 text-primary font-bold rounded-xl hover:bg-primary/5 transition-colors flex items-center justify-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  محادثة
                </button>
                <button className="flex-1 md:flex-none px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                  <Phone className="w-5 h-5" />
                  اتصال
                </button>
              </div>
            </section>
          </motion.div>

          {/* Left Sidebar - Order Details */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4 space-y-6"
          >
            {/* Delivery Details */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold mb-6">تفاصيل التوصيل</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">عنوان التوصيل</p>
                    <p className="font-medium text-slate-900">حي المعادي، شارع 9، مبنى 12، شقة 4</p>
                    <p className="text-sm text-slate-500">القاهرة، جمهورية مصر العربية</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">المستلم</p>
                    <p className="font-medium text-slate-900">عبدالله محمد</p>
                    <p className="text-sm text-slate-500 text-left" dir="ltr">+966 50 XXXX XXX</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Pharmacy & Items */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                    <Home className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <h2 className="font-bold">صيدلية الدواء الجديدة</h2>
                    <p className="text-xs text-slate-400">فرع حي الصحافة</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-4">
                  <img 
                    src="https://picsum.photos/seed/medicine1/100/100" 
                    alt="Panadol" 
                    className="w-16 h-16 rounded-xl object-cover bg-slate-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">بانادول أدفانس (24 قرص)</p>
                    <p className="text-sm text-slate-400">الكمية: 2</p>
                  </div>
                  <p className="font-bold text-slate-900">24.50 ج.م</p>
                </div>
                <div className="flex items-center gap-4">
                  <img 
                    src="https://picsum.photos/seed/medicine2/100/100" 
                    alt="Vitamin C" 
                    className="w-16 h-16 rounded-xl object-cover bg-slate-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">فيتامين سي 1000 ملجم</p>
                    <p className="text-sm text-slate-400">الكمية: 1</p>
                  </div>
                  <p className="font-bold text-slate-900">45.00 ج.م</p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">المجموع الفرعي</span>
                  <span className="text-slate-700">69.50 ج.م</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">رسوم التوصيل</span>
                  <span className="text-slate-700">15.00 ج.م</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold text-primary">الإجمالي</span>
                  <span className="text-2xl font-bold text-primary">84.50 ج.م</span>
                </div>
              </div>

              <div className="mt-6 bg-slate-50 rounded-xl p-3 flex items-center justify-center gap-2 text-sm text-slate-500">
                <span>الدفع عند الاستلام</span>
              </div>
            </section>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Package className="text-white w-5 h-5" />
                </div>
                <span className="text-2xl font-bold text-primary">Healup</span>
              </div>
              <p className="text-slate-500 leading-relaxed">
                منصتك الصحية الشاملة للوصول إلى الأدوية والرعاية الصحية في أسرع وقت ممكن وبأعلى جودة.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-6">روابط سريعة</h4>
              <ul className="space-y-4 text-slate-500">
                <li><a href="#" className="hover:text-primary transition-colors">عن هيل اب</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">الصيدليات الشريكة</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">انضم كمندوب</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">المدونة الطبية</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-6">الدعم</h4>
              <ul className="space-y-4 text-slate-500">
                <li><a href="#" className="hover:text-primary transition-colors">مركز المساعدة</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">الأسئلة الشائعة</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">سياسة الاسترجاع</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">اتصل بنا</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-6">تطبيقاتنا</h4>
              <div className="space-y-3">
                <button className="w-full bg-[#0F172A] text-white p-4 rounded-2xl flex items-center justify-between hover:bg-slate-800 transition-colors group">
                  <Apple className="w-7 h-7 opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="text-right">
                    <p className="text-[10px] opacity-60 leading-tight">حمل من</p>
                    <p className="text-lg font-bold leading-tight">App Store</p>
                  </div>
                </button>
                <button className="w-full bg-[#0F172A] text-white p-4 rounded-2xl flex items-center justify-between hover:bg-slate-800 transition-colors group">
                  <Smartphone className="w-7 h-7 opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="text-right">
                    <p className="text-[10px] opacity-60 leading-tight">حمل من</p>
                    <p className="text-lg font-bold leading-tight">Google Play</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-8 text-center text-slate-400 text-sm">
            <p>© 2024 Healup. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
