import React from 'react';
import { 
  CheckCircle2, 
  Truck, 
  Clock, 
  CreditCard, 
  MapPin, 
  Home, 
  Mail, 
  Phone, 
  MessageCircle, 
  Bell, 
  PlusSquare,
  ChevronLeft
} from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

export default function OrderConfirmation() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] rtl font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#0456AE]">
            <PlusSquare className="w-7 h-7 fill-current" />
            <span className="font-bold text-xl">Healup</span>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
              <img 
                src="https://picsum.photos/seed/user/100/100" 
                alt="User" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Success Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-sm"
        >
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-[#ECFDF5] rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-[#10B981]" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-3">تم تأكيد طلبك بنجاح!</h1>
          <p className="text-gray-500 mb-6 max-w-md mx-auto leading-relaxed">
            شكراً لثقتك بـ Healup. نحن نقوم بمعالجة طلبك الآن.
          </p>
          <div className="inline-flex items-center bg-[#F1F5F9] px-6 py-2 rounded-full text-[#0456AE] font-bold text-sm">
            رقم الطلب #9021
          </div>
        </motion.div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between"
          >
            <div className="text-right">
              <p className="text-gray-400 text-sm mb-1">وقت التوصيل المتوقع</p>
              <h3 className="text-xl font-bold text-gray-900">30 - 45 دقيقة</h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#0456AE]">
              <Clock className="w-6 h-6" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between"
          >
            <div className="text-right">
              <p className="text-gray-400 text-sm mb-1">طريقة الاستلام</p>
              <h3 className="text-xl font-bold text-gray-900">توصيل للمنزل</h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#0456AE]">
              <Truck className="w-6 h-6" />
            </div>
          </motion.div>
        </div>

        {/* Order Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-xl font-bold text-gray-900">ملخص الطلب</h2>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Item */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-blue-600">
                  <div className="w-6 h-6 rounded-full border-4 border-blue-600 relative">
                    <div className="absolute inset-0 border-t-4 border-transparent rotate-45"></div>
                  </div>
                </div>
                <div className="text-right">
                  <h4 className="font-bold text-gray-900">بانادول اكسترا (24 قرص)</h4>
                  <p className="text-xs text-gray-400">صيدلية النهدي - فرع الرياض</p>
                </div>
              </div>
              <span className="font-bold text-gray-900">25.00 ج.م</span>
            </div>

            {/* Calculations */}
            <div className="space-y-3 pt-4 border-t border-gray-50">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">المجموع الفرعي</span>
                <span className="font-medium text-gray-900">25.00 ج.م</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">رسوم التوصيل</span>
                <span className="font-medium text-gray-900">10.00 ج.م</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#10B981] font-bold">خصم العرض</span>
                <span className="text-[#10B981] font-bold">-5.00 ج.م</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-50">
                <span className="text-lg font-black text-gray-900">الإجمالي</span>
                <span className="text-lg font-black text-gray-900">30.00 ج.م</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-[#F8FAFC] p-4 rounded-2xl flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-500">طريقة الدفع</span>
              </div>
              <span className="text-sm font-bold text-gray-900">بطاقة مدي (**** 4242)</span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <Link href="/patient-order-tracking" className="flex items-center justify-center gap-2 bg-[#0456AE] text-white py-4 rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg shadow-blue-100">
            <MapPin className="w-5 h-5" />
            <span>تتبع الطلب</span>
          </Link>
          <Link href="/patient-home" className="flex items-center justify-center gap-2 bg-white text-[#0456AE] border-2 border-[#0456AE] py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all">
            <Home className="w-5 h-5" />
            <span>العودة للرئيسية</span>
          </Link>
        </div>

        <div className="text-center pt-4">
          <p className="text-gray-400 text-sm">
            لديك استفسار؟ <a href="#" className="text-[#0456AE] font-bold underline underline-offset-4">تواصل مع خدمة العملاء</a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-12 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-right">
            <div className="space-y-4">
              <div className="flex items-center justify-start gap-2 text-[#0456AE]">
                <PlusSquare className="w-8 h-8 fill-current" />
                <span className="font-bold text-2xl">Healup</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                منصتكم الموثوقة للحصول على الأدوية والخدمات الصحية في أسرع وقت ومن أفضل الصيدليات المعتمدة.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900">روابط سريعة</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-[#0456AE] transition-colors">عن Healup</a></li>
                <li><a href="#" className="hover:text-[#0456AE] transition-colors">الصيدليات المتعاقدة</a></li>
                <li><a href="#" className="hover:text-[#0456AE] transition-colors">الأسئلة الشائعة</a></li>
                <li><a href="#" className="hover:text-[#0456AE] transition-colors">سياسة الخصوصية</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-gray-900">تواصل معنا</h4>
              <div className="flex justify-start gap-3">
                <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-[#0456AE] transition-all">
                  <MessageCircle className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-[#0456AE] transition-all">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-[#0456AE] transition-all">
                  <Mail className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-50 text-center text-gray-400 text-xs">
            <p>© Healup 2024. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
