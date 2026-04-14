"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { orderService, type Order } from "@/services/orderService";

export default function PharmacyCompletedOrdersLive() {
  const [orders, setOrders] = useState<Order[]>([]);

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

  const done = useMemo(() => orders.filter((o) => o.status === "completed"), [orders]);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8" dir="rtl">
      <h1 className="mb-8 text-2xl font-bold text-slate-900">الطلبات المكتملة</h1>
      <div className="space-y-4">
        {done.length === 0 ? (
          <p className="text-slate-500">لا توجد طلبات مكتملة بعد.</p>
        ) : (
          done.map((o) => (
            <div
              key={o.id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between"
            >
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="font-bold text-[#0456AE]">#{o.id}</span>
                  <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">مكتمل</span>
                </div>
                <p className="font-bold text-slate-800">{o.patient?.name ?? "مريض"}</p>
                <p className="text-sm text-slate-500">
                  {o.items?.map((i) => `${i.medicine_name} ×${i.quantity}`).join("، ") ?? "—"}
                </p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-sm text-slate-400">{new Date(o.created_at).toLocaleString("ar-EG")}</p>
                <p className="text-xl font-bold text-slate-900">{o.total_price.toFixed(2)} ج.م</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
