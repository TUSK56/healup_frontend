import { Calendar, MapPin, Store, RotateCcw, ChevronDown, ListFilter } from 'lucide-react';

export default function Filters() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-[#F8FAFC] px-4 py-2 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium">هذا الشهر</span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>

        <div className="flex items-center gap-2 bg-[#F8FAFC] px-4 py-2 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium">المدينة: الكل</span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>

        <div className="flex items-center gap-2 bg-[#F8FAFC] px-4 py-2 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
          <Store className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium">اسم الصيدلية</span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 bg-[#F8FAFC] text-[#0039AB] hover:bg-gray-100 px-4 py-2 rounded-xl transition-colors text-sm font-semibold border border-gray-100">
          <RotateCcw className="w-4 h-4" />
          <span>إعادة ضبط</span>
        </button>
        
        <button className="bg-[#E5EEF7] text-[#0038A7] p-2.5 rounded-xl hover:opacity-90 transition-colors border border-blue-50">
          <ListFilter className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
