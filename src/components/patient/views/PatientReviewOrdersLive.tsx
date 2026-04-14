"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { authService } from "@/services/authService";
import { orderService, type Order } from "@/services/orderService";

const activeStatuses = new Set([
  "pending_pharmacy_confirmation",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "ready_for_pickup",
]);

function statusLabel(s: string): string {
  const map: Record<string, string> = {
    pending_pharmacy_confirmation: "بانتظار الصيدلية",
    confirmed: "بانتظار تأكيدك",
    preparing: "جاري التجهيز",
    out_for_delivery: "خرج للتوصيل",
    ready_for_pickup: "جاهز للاستلام",
    completed: "مكتمل",
    rejected: "مرفوض",
  };
  return map[s] ?? s;
}

export default function PatientReviewOrdersLive() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [tab, setTab] = useState<"all" | "active" | "done" | "rejected">("all");

  const load = useCallback(async () => {
    try {
      const data = await orderService.list();
      setOrders(data.data);
    } catch {
      setOrders([]);
    }
  }, []);

  useEffect(() => {
    if (authService.getGuard() !== "user" || !authService.getToken()) return;
    load();
    const on = () => load();
    window.addEventListener("healup:notification", on);
    return () => window.removeEventListener("healup:notification", on);
  }, [load]);

  const filtered = useMemo(() => {
    if (tab === "all") return orders;
    if (tab === "active") return orders.filter((o) => activeStatuses.has(o.status));
    if (tab === "done") return orders.filter((o) => o.status === "completed");
    return orders.filter((o) => o.status === "rejected");
  }, [orders, tab]);

  if (authService.getGuard() !== "user" || !authService.getToken()) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-8" dir="rtl">
        <p className="text-slate-600">يرجى <Link href="/patient-login" className="font-bold text-[#0052CC]">تسجيل الدخول</Link> لعرض طلباتك.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 pb-16 pt-4 md:px-8" dir="rtl">
      <h1 className="mb-2 text-4xl font-black text-[#002B5B]">طلباتي</h1>
      <p className="mb-8 text-lg text-slate-400">تتبع وإدارة جميع طلبات الأدوية</p>

      <div className="mb-8 flex flex-wrap gap-2">
        {(
          [
            ["all", "الكل"],
            ["active", "قيد التنفيذ"],
            ["done", "المكتملة"],
            ["rejected", "المرفوضة"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-full px-4 py-2 text-sm font-bold ${
              tab === key ? "bg-[#0052CC] text-white" : "bg-white text-slate-500 shadow-sm"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <p className="text-slate-500">لا توجد طلبات في هذا التبويب.</p>
        ) : (
          filtered.map((o) => (
            <div key={o.id} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-[#0052CC]">طلب #{o.id}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{statusLabel(o.status)}</span>
              </div>
              <p className="mb-1 font-bold text-slate-800">{o.pharmacy?.name ?? "صيدلية"}</p>
              <p className="mb-2 text-sm text-slate-500">
                {o.items?.map((i) => `${i.medicine_name} ×${i.quantity}`).join("، ") ?? "—"}
              </p>
              <p className="mb-4 text-lg font-bold text-slate-900">{o.total_price.toFixed(2)} ج.م</p>
              <div className="flex flex-wrap gap-3">
                {activeStatuses.has(o.status) ? (
                  <Link
                    href={`/patient-order-tracking?id=${o.id}`}
                    className="rounded-lg bg-[#0052CC] px-4 py-2 text-sm font-bold text-white"
                  >
                    تتبع الطلب
                  </Link>
                ) : null}
                {o.status === "confirmed" ? (
                  <Link
                    href={`/patient-order-confirmation?id=${o.id}`}
                    className="rounded-lg border border-[#0052CC] px-4 py-2 text-sm font-bold text-[#0052CC]"
                  >
                    تأكيد الطلب
                  </Link>
                ) : null}
                {o.status === "completed" || o.status === "rejected" ? (
                  <Link
                    href={`/patient-review-order-history?id=${o.id}`}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700"
                  >
                    تفاصيل الطلب
                  </Link>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
