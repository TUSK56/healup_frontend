"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { orderService, type Order } from "@/services/orderService";

const activeStatuses = new Set([
  "confirmed",
  "preparing",
  "out_for_delivery",
  "ready_for_pickup",
]);

function labelAr(status: string): string {
  switch (status) {
    case "confirmed":
      return "بانتظار المريض";
    case "preparing":
      return "جاري التجهيز";
    case "out_for_delivery":
      return "خرج للتوصيل";
    case "ready_for_pickup":
      return "جاهز للاستلام";
    default:
      return status;
  }
}

export default function PharmacyCurrentOrdersLive() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [busy, setBusy] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await orderService.list();
      setOrders(data.data);
    } catch {
      setOrders([]);
    }
  }, []);

  useEffect(() => {
    load();
    const on = () => load();
    window.addEventListener("healup:notification", on);
    return () => window.removeEventListener("healup:notification", on);
  }, [load]);

  const current = useMemo(
    () => orders.filter((o) => activeStatuses.has(o.status)),
    [orders]
  );

  const nextAction = (o: Order): { label: string; status: string } | null => {
    switch (o.status) {
      case "confirmed":
        return { label: "بدء التجهيز", status: "preparing" };
      case "preparing":
        return { label: "خرج للتوصيل", status: "out_for_delivery" };
      case "out_for_delivery":
        return { label: "إكمال الطلب", status: "completed" };
      case "ready_for_pickup":
        return { label: "إكمال الطلب", status: "completed" };
      default:
        return null;
    }
  };

  const alternate = (o: Order): { label: string; status: string } | null => {
    if (o.status === "preparing") {
      return { label: "جاهز للاستلام", status: "ready_for_pickup" };
    }
    return null;
  };

  const handle = async (orderId: number, status: string) => {
    setBusy(orderId);
    try {
      await orderService.updateStatus(orderId, status);
      await load();
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8" dir="rtl">
      <h1 className="mb-2 text-2xl font-black text-slate-900">الطلبات الحالية</h1>
      <p className="mb-8 text-slate-500">الطلبات النشطة بعد التأكيد</p>

      <div className="grid gap-4 md:grid-cols-2">
        {current.length === 0 ? (
          <p className="text-slate-500">لا توجد طلبات حالية.</p>
        ) : (
          current.map((o) => {
            const act = nextAction(o);
            const alt = alternate(o);
            return (
              <div key={o.id} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <span className="rounded-lg bg-[#E6EFF7] px-2 py-1 text-xs font-bold text-[#004BAB]">#{o.id}</span>
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">{labelAr(o.status)}</span>
                </div>
                <p className="mb-1 font-bold text-slate-800">{o.patient?.name ?? "مريض"}</p>
                <p className="mb-1 text-sm text-slate-500">
                  {o.items?.map((i) => `${i.medicine_name} ×${i.quantity}`).join("، ") ?? "—"}
                </p>
                <p className="mb-4 text-lg font-bold text-slate-900">{o.total_price.toFixed(2)} ج.م</p>
                <div className="flex flex-wrap gap-2">
                  {act ? (
                    <button
                      type="button"
                      disabled={busy === o.id}
                      className="rounded-lg bg-[#0456AE] px-4 py-2 text-sm font-bold text-white"
                      onClick={() => handle(o.id, act.status)}
                    >
                      {act.label}
                    </button>
                  ) : null}
                  {alt ? (
                    <button
                      type="button"
                      disabled={busy === o.id}
                      className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700"
                      onClick={() => handle(o.id, alt.status)}
                    >
                      {alt.label}
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
