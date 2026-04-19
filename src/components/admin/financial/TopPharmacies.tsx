import { ChevronLeft } from "lucide-react";

export type TopPharmacyRow = {
  name: string;
  branch: string;
  sales: number;
  rank: number;
};

export default function TopPharmacies({ items }: { items: TopPharmacyRow[] }) {
  return (
    <div className="h-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-lg font-bold text-gray-900">أعلى الصيدليات مبيعاً</h3>

      <div className="space-y-4">
        {items.length === 0 ? (
          <p className="text-sm text-gray-500">لا توجد بيانات مبيعات حتى الآن.</p>
        ) : (
          items.map((pharmacy) => (
            <div
              key={`${pharmacy.rank}-${pharmacy.name}`}
              className="group flex items-center justify-between rounded-xl border border-gray-50 p-4 transition-all hover:border-blue-100 hover:bg-blue-50/30"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${
                    pharmacy.rank === 1 ? "bg-blue-50 text-[--color-brand-primary]" : "bg-gray-50 text-gray-600"
                  }`}
                >
                  {pharmacy.rank}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{pharmacy.name}</p>
                  <p className="text-xs text-gray-400">{pharmacy.branch}</p>
                </div>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-green-600">{pharmacy.sales.toLocaleString("ar-EG")} ج.م</p>
              </div>
            </div>
          ))
        )}
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
