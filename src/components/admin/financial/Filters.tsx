import { Calendar, MapPin, Store, RotateCcw, ChevronDown, ListFilter } from "lucide-react";

export default function Filters() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-100 bg-[#F8FAFC] px-4 py-2 transition-colors hover:bg-gray-100">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium">هذا الشهر</span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>

        <div className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-100 bg-[#F8FAFC] px-4 py-2 transition-colors hover:bg-gray-100">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium">المدينة: الكل</span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>

        <div className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-100 bg-[#F8FAFC] px-4 py-2 transition-colors hover:bg-gray-100">
          <Store className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium">اسم الصيدلية</span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl border border-gray-100 bg-[#F8FAFC] px-4 py-2 text-sm font-semibold text-[#0039AB] transition-colors hover:bg-gray-100"
        >
          <RotateCcw className="h-4 w-4" />
          <span>إعادة ضبط</span>
        </button>

        <button
          type="button"
          className="rounded-xl border border-blue-50 bg-[#E5EEF7] p-2.5 text-[#0038A7] transition-colors hover:opacity-90"
        >
          <ListFilter className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
