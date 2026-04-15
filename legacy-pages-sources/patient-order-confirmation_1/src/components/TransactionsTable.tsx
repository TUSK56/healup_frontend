import { Eye } from 'lucide-react';

const transactions = [
  { id: "TR-8821#", date: "24 مايو 2024", pharmacy: "صيدلية العزبي", amount: "1,450.00", status: "مكتملة", statusColor: "bg-[#D1FAE5] text-[#107F5B]" },
  { id: "TR-8822#", date: "24 مايو 2024", pharmacy: "صيدليات مصر", amount: "720.50", status: "قيد المعالجة", statusColor: "bg-[#FEF3C7] text-[#B84825]" },
  { id: "TR-8823#", date: "23 مايو 2024", pharmacy: "صيدلية رشدي", amount: "2,100.00", status: "مكتملة", statusColor: "bg-[#D1FAE5] text-[#107F5B]" },
  { id: "TR-8824#", date: "23 مايو 2024", pharmacy: "صيدلية ١٩٠١١", amount: "340.00", status: "فاشلة", statusColor: "bg-[#FFE4E6] text-[#C5344C]" },
];

export default function TransactionsTable() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">أحدث المعاملات</h3>
        <button className="text-blue-600 text-sm font-semibold hover:underline">عرض جميع المعاملات</button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead>
            <tr className="bg-gray-50/50 text-gray-400 text-xs font-medium uppercase tracking-wider">
              <th className="px-6 py-4">رقم المعاملة</th>
              <th className="px-6 py-4">التاريخ</th>
              <th className="px-6 py-4">الصيدلية</th>
              <th className="px-6 py-4">المبلغ (ج.م)</th>
              <th className="px-6 py-4 text-center">الحالة</th>
              <th className="px-6 py-4 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {transactions.map((tx, index) => (
              <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 text-sm font-bold text-gray-900">{tx.id}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{tx.date}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{tx.pharmacy}</td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">{tx.amount}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${tx.statusColor}`}>
                      {tx.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <button className="p-2 text-[#014FAC] hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
