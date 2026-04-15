/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, ReactNode } from 'react';
import { 
  Bell, 
  Store, 
  Camera, 
  Phone, 
  Mail, 
  MapPin, 
  Shield, 
  User, 
  FileText, 
  ChevronLeft,
  Save,
  X,
  Plus,
  BriefcaseMedical,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';

// --- Components ---

const Header = () => (
  <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
    <div className="flex items-center gap-2">
      <div className="bg-healup-blue p-1.5 rounded-lg text-white">
        <BriefcaseMedical size={20} />
      </div>
      <span className="font-bold text-xl text-healup-blue tracking-tight">Healup</span>
    </div>

    <div className="flex items-center gap-4">
      <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600 relative">
        <Bell size={20} />
        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
      </button>
      <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
        <Store size={20} />
      </button>
    </div>
  </header>
);

const ProfileBanner = () => (
  <div className="relative mb-20 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
    <div className="h-40 w-full bg-gradient-to-r from-[#2b59c3] to-[#4a86e8]">
    </div>
    
    <div className="px-8 pb-8 flex flex-col items-center md:items-center md:flex-row gap-6">
      <div className="relative -mt-16">
        <div className="w-32 h-32 bg-white rounded-2xl shadow-xl p-1.5 border border-slate-100">
          <div className="w-full h-full rounded-xl flex items-center justify-center overflow-hidden">
            <div className="bg-gradient-to-b from-[#4dd0e1] to-[#006064] w-full h-full flex flex-col items-center justify-center text-white p-2 relative">
              <div className="border-2 border-white/40 rounded-xl p-2 mb-1">
                <Store size={32} className="text-white" />
              </div>
              <span className="text-[8px] uppercase font-bold tracking-wider">Pharmacy</span>
              <span className="text-[6px] uppercase opacity-60">Professional</span>
            </div>
          </div>
        </div>
        <button className="absolute -bottom-2 -left-2 bg-[#1a4b9c] text-white p-2.5 rounded-full shadow-lg hover:scale-110 transition-transform border-4 border-white">
          <Camera size={16} />
        </button>
      </div>
      
      <div className="text-right md:-mt-8">
        <h1 className="text-2xl font-bold text-slate-900 font-arabic">صيدلية الشفاء المركزية</h1>
        <div className="flex items-center justify-start gap-1 text-slate-400 text-sm mt-1">
          <CheckCircle2 size={14} className="text-slate-400" />
          <span className="font-arabic">رقم الترخيص: PH-456-123</span>
        </div>
      </div>
    </div>
  </div>
);

const InfoCard = ({ title, icon: Icon, children, className = "" }: { title: string, icon: any, children: ReactNode, className?: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-6 ${className}`}
  >
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="bg-blue-50 p-2 rounded-xl text-healup-blue">
          <Icon size={20} />
        </div>
        <h2 className="font-bold text-lg text-slate-800 font-arabic">{title}</h2>
      </div>
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </motion.div>
);

const InputField = ({ label, value, icon: Icon, placeholder, type = "text", dir = "rtl" }: { label: string, value: string, icon?: any, placeholder?: string, type?: string, dir?: string }) => (
  <div className="space-y-1.5 text-right">
    <label className="text-sm font-medium text-slate-500 font-arabic">{label}</label>
    <div className="relative">
      <input 
        type={type}
        defaultValue={value}
        placeholder={placeholder}
        dir={dir}
        className={`w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-arabic ${Icon ? 'pl-11' : ''}`}
      />
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <Icon size={18} />
        </div>
      )}
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [isSaving, setIsSaving] = useState(false);

  return (
    <div className="min-h-screen flex flex-col rtl">
      <Header />
      
      <main className="flex-grow max-w-6xl mx-auto w-full px-4 pb-24">
        <ProfileBanner />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Right Column (2/3 width on desktop) */}
          <div className="lg:col-span-2 space-y-6">
            <InfoCard title="البيانات الأساسية" icon={FileText}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="اسم الصيدلية" value="صيدلية الشفاء المركزية" />
                <InputField label="اسم الصيدلي المسؤول" value="د. أحمد محمود" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="رقم الترخيص" value="PH-456-123" dir="ltr" />
                <InputField label="البريد الإلكتروني" value="contact@alshifa-ph.com" dir="ltr" />
              </div>
            </InfoCard>

            <InfoCard title="الموقع والعنوان" icon={MapPin}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="المدينة" value="القاهرة" />
                <InputField label="الحي" value="مدينة نصر" />
              </div>
              <InputField label="العنوان بالتفصيل" value="شارع عباس العقاد، بجوار مستشفى دار الفؤاد" />
              
              <div className="mt-4 relative rounded-2xl overflow-hidden h-48 border border-slate-200">
                <img 
                  src="https://picsum.photos/seed/map/800/400" 
                  alt="Map" 
                  className="w-full h-full object-cover grayscale opacity-50"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-lg text-xs font-bold whitespace-nowrap border border-slate-100">
                      موقع الصيدلية
                    </div>
                    <MapPin size={40} className="text-healup-blue fill-healup-blue/20" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4">
                  <button className="bg-white/90 backdrop-blur-sm text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm border border-slate-200 flex items-center gap-1">
                    <Plus size={14} />
                    <span>تعديل الموقع</span>
                  </button>
                </div>
              </div>
            </InfoCard>
          </div>

          {/* Left Column (1/3 width on desktop) */}
          <div className="space-y-6">
            <InfoCard title="بيانات التواصل" icon={Phone}>
              <InputField label="رقم الهاتف" value="+20 102 345 6789" icon={Phone} dir="ltr" />
              <InputField label="رقم الطوارئ" value="+20 2 123 4567" icon={Phone} dir="ltr" />
            </InfoCard>

            <InfoCard title="الأمان" icon={Shield}>
              <div className="text-right space-y-4">
                <p className="text-sm text-slate-500 font-arabic leading-relaxed">
                  قم بتغيير كلمة المرور بشكل دوري للحفاظ على أمان حسابك.
                </p>
                <button className="w-full py-3 px-4 rounded-xl border-2 border-healup-blue text-healup-blue font-bold text-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 font-arabic">
                  <ChevronLeft size={18} />
                  <span>تغيير كلمة المرور</span>
                </button>
              </div>
            </InfoCard>
          </div>
        </div>

        {/* Action Buttons at the bottom of the main content */}
        <div className="mt-12 flex items-center gap-4 flex-row-reverse">
          <button 
            onClick={() => {
              setIsSaving(true);
              setTimeout(() => setIsSaving(false), 2000);
            }}
            disabled={isSaving}
            className="bg-[#1a4b9c] text-white px-10 py-3.5 rounded-xl font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all flex items-center gap-2 disabled:opacity-70 font-arabic min-w-[160px] justify-center"
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Save size={18} />
            )}
            <span>{isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
          </button>
          <button className="bg-slate-50 text-slate-500 border border-slate-200 px-10 py-3.5 rounded-xl font-bold hover:bg-slate-100 transition-all font-arabic min-w-[120px] justify-center">
            إلغاء
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 p-6 mt-auto">
        <div className="max-w-6xl mx-auto text-center text-slate-400 text-xs font-arabic">
          © 2024 Healup. جميع الحقوق محفوظة لمنصة الرعاية الصحية.
        </div>
      </footer>
    </div>
  );
}
