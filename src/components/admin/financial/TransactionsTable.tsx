import { Eye } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

export type TransactionRow = {
  id: number;
  date: string;
  pharmacy: string;
  amount: number;
  status: string;
};

function toLocaleDate(value: string | undefined, locale: "ar" | "en") {
  if (!value) return "-";
  const d = new Date(value);
  if (!Number.isFinite(d.getTime())) return "-";
  return d.toLocaleString(locale === "ar" ? "ar-EG" : "en-US", { dateStyle: "medium", timeStyle: "short" });
}

function statusInfo(status: string, t: (key: string, fallback?: string) => string) {
  const s = (status || "").toLowerCase();
  if (s === "completed") return { text: t("admin.financial.statusCompleted", "Completed"), cls: "bg-[#D1FAE5] text-[#107F5B]" };
  if (s === "rejected") return { text: t("admin.financial.statusRejected", "Failed"), cls: "bg-[#FFE4E6] text-[#C5344C]" };
  if (s === "pending_pharmacy_confirmation") return { text: t("admin.financial.statusPendingPharmacyConfirmation", "Waiting confirmation"), cls: "bg-[#FEF3C7] text-[#B84825]" };
  if (s === "preparing") return { text: t("admin.financial.statusPreparing", "Preparing"), cls: "bg-[#DBEAFE] text-[#2244B8]" };
  if (s === "out_for_delivery") return { text: t("admin.financial.statusOutForDelivery", "Out for delivery"), cls: "bg-[#E0E7FF] text-[#3930A7]" };
  return { text: status || t("admin.financial.statusUnknown", "Unknown"), cls: "bg-slate-100 text-slate-600" };
}

export default function TransactionsTable({ items }: { items: TransactionRow[] }) {
  const { t, locale } = useLocale();
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-50 p-6">
        <h3 className="text-lg font-bold text-gray-900">{t("admin.financial.transactionsTitle", "Latest transactions")}</h3>
        <button type="button" className="text-sm font-semibold text-blue-600 hover:underline">
          {t("admin.financial.transactionsViewAll", "View all transactions")}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-start">
          <thead>
            <tr className="bg-gray-50/50 text-xs font-medium uppercase tracking-wider text-gray-400">
              <th className="px-6 py-4">{t("admin.financial.transactionsId", "Transaction ID")}</th>
              <th className="px-6 py-4">{t("admin.financial.transactionsDate", "Date")}</th>
              <th className="px-6 py-4">{t("admin.financial.transactionsPharmacy", "Pharmacy")}</th>
              <th className="px-6 py-4">{t("admin.financial.transactionsAmount", "Amount")} ({t("admin.financial.currencyShort", "EGP")})</th>
              <th className="px-6 py-4 text-center">{t("admin.financial.transactionsStatus", "Status")}</th>
              <th className="px-6 py-4 text-center">{t("admin.financial.transactionsActions", "Actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                  {t("admin.financial.transactionsEmpty", "No transactions yet.")}
                </td>
              </tr>
            ) : (
              items.map((tx) => {
                const status = statusInfo(tx.status, t);
                return (
                  <tr key={tx.id} className="transition-colors hover:bg-gray-50/50">
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">TR-{tx.id}#</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{toLocaleDate(tx.date, locale)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{tx.pharmacy || "-"}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{tx.amount.toLocaleString(locale === "ar" ? "ar-EG" : "en-US")}</td>
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
