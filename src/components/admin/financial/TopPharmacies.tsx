import { ChevronLeft } from "lucide-react";

const pharmacies = [
  { name: "صيدلية العزبي", branch: "فرع المهندسين", sales: "145 ألف", rank: 1, color: "bg-blue-50 text-[--color-brand-primary]" },
  { name: "صيدليات مصر", branch: "فرع المعادي", sales: "98 ألف", rank: 2, color: "bg-gray-50 text-gray-600" },
  { name: "صيدلية سيف", branch: "فرع مصر الجديدة", sales: "76 ألف", rank: 3, color: "bg-gray-50 text-gray-600" },
];

export default function TopPharmacies() {
  return (
    <div className="h-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-lg font-bold text-gray-900">أعلى الصيدليات مبيعاً</h3>

      <div className="space-y-4">
        {pharmacies.map((pharmacy, index) => (
          <div
            key={index}
            className="group flex cursor-pointer items-center justify-between rounded-xl border border-gray-50 p-4 transition-all hover:border-blue-100 hover:bg-blue-50/30"
          >
            <div className="flex items-center gap-4">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${pharmacy.color}`}>
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

      <button
        type="button"
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-100 bg-[#F8FAFC] py-3 text-sm font-bold text-[--color-brand-primary] transition-colors hover:bg-gray-100"
      >
        <span>عرض القائمة الكاملة</span>
        <ChevronLeft className="h-4 w-4" />
      </button>
    </div>
  );
}
