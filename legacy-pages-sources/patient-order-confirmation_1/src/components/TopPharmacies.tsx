import { ChevronLeft } from 'lucide-react';

const pharmacies = [
  { name: "صيدلية العزبي", branch: "فرع المهندسين", sales: "145 ألف", rank: 1, color: "bg-blue-50 text-[--color-brand-primary]" },
  { name: "صيدليات مصر", branch: "فرع المعادي", sales: "98 ألف", rank: 2, color: "bg-gray-50 text-gray-600" },
  { name: "صيدلية سيف", branch: "فرع مصر الجديدة", sales: "76 ألف", rank: 3, color: "bg-gray-50 text-gray-600" },
];

export default function TopPharmacies() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full">
      <h3 className="text-lg font-bold text-gray-900 mb-6">أعلى الصيدليات مبيعاً</h3>
      
      <div className="space-y-4">
        {pharmacies.map((pharmacy, index) => (
          <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-gray-50 hover:border-blue-100 hover:bg-blue-50/30 transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${pharmacy.color}`}>
                {pharmacy.rank}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{pharmacy.name}</p>
                <p className="text-xs text-gray-400">{pharmacy.branch}</p>
              </div>
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-green-600">{pharmacy.sales}</p>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-6 py-3 text-sm font-bold text-[--color-brand-primary] bg-[#F8FAFC] border border-gray-100 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
        <span>عرض القائمة الكاملة</span>
        <ChevronLeft className="w-4 h-4" />
      </button>
    </div>
  );
}
