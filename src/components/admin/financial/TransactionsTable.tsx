import { Eye } from "lucide-react";

export type TransactionRow = {
  id: number;
  date: string;
  pharmacy: string;
  amount: number;
  status: string;
};

function toArabicDate(value?: string) {
  if (!value) return "-";
  const d = new Date(value);
  if (!Number.isFinite(d.getTime())) return "-";
  return d.toLocaleString("ar-EG", { dateStyle: "medium", timeStyle: "short" });
}

function statusInfo(status: string) {
  const s = (status || "").toLowerCase();
  if (s === "completed") return { text: "مكتملة", cls: "bg-[#D1FAE5] text-[#107F5B]" };
  if (s === "rejected") return { text: "فاشلة", cls: "bg-[#FFE4E6] text-[#C5344C]" };
  if (s === "pending_pharmacy_confirmation") return { text: "بانتظار التأكيد", cls: "bg-[#FEF3C7] text-[#B84825]" };
  if (s === "preparing") return { text: "قيد التحضير", cls: "bg-[#DBEAFE] text-[#2244B8]" };
  if (s === "out_for_delivery") return { text: "قيد التوصيل", cls: "bg-[#E0E7FF] text-[#3930A7]" };
  return { text: status || "غير معروف", cls: "bg-slate-100 text-slate-600" };
}

export default function TransactionsTable({ items }: { items: TransactionRow[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-50 p-6">
        <h3 className="text-lg font-bold text-gray-900">أحدث المعاملات</h3>
        <button type="button" className="text-sm font-semibold text-blue-600 hover:underline">
          عرض جميع المعاملات
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead>
            <tr className="bg-gray-50/50 text-xs font-medium uppercase tracking-wider text-gray-400">
              <th className="px-6 py-4">رقم المعاملة</th>
              <th className="px-6 py-4">التاريخ</th>
              <th className="px-6 py-4">الصيدلية</th>
              <th className="px-6 py-4">المبلغ (ج.م)</th>
              <th className="px-6 py-4 text-center">الحالة</th>
              <th className="px-6 py-4 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                  لا توجد معاملات بعد.
                </td>
              </tr>
            ) : (
              items.map((tx) => {
                const status = statusInfo(tx.status);
                return (
                  <tr key={tx.id} className="transition-colors hover:bg-gray-50/50">
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">TR-{tx.id}#</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{toArabicDate(tx.date)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{tx.pharmacy || "-"}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{tx.amount.toLocaleString("ar-EG")}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${status.cls}`}>{status.text}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <button type="button" className="rounded-lg p-2 text-[#014FAC] transition-colors hover:bg-blue-50">
                          <Eye className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
