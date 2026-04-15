"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { orderService, type Order } from "@/services/orderService";
import { formatRelativeTimeAr } from "@/lib/formatRelativeAr";

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
    <div dir="rtl">
      <header className="pharmacy-subpage-header">
        <h1 className="pharmacy-subpage-title">الطلبات المكتملة</h1>
        <p className="pharmacy-subpage-desc">سجل الطلبات التي تم تسليمها بنجاح</p>
      </header>

      <div className="pharmacy-done-grid">
        {done.length === 0 ? (
          <p className="pharmacy-analytics-muted" style={{ gridColumn: "1 / -1" }}>
            لا توجد طلبات مكتملة بعد.
          </p>
        ) : (
          done.map((o) => (
            <div key={o.id} className="pharmacy-done-card">
              <div className="pharmacy-done-card-top">
                <span className="pharmacy-current-id-pill">HLP-{o.id}</span>
                <span className="pharmacy-done-badge">مكتمل</span>
              </div>
              <h2 className="pharmacy-current-patient" style={{ fontSize: 17 }}>
                {o.patient?.name ?? "مريض"}
              </h2>
              <div className="pharmacy-current-lines">
                <div className="pharmacy-current-line">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                  </svg>
                  <span>{o.items?.map((i) => `${i.medicine_name} ×${i.quantity}`).join("، ") ?? "—"}</span>
                </div>
              </div>
              <div className="pharmacy-done-meta">
                <div>
                  <p className="pharmacy-analytics-muted" style={{ fontSize: 12, marginBottom: 4 }}>
                    {formatRelativeTimeAr(o.created_at)}
                  </p>
                  <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {new Date(o.created_at).toLocaleString("ar-EG")}
                  </p>
                </div>
                <p className="pharmacy-current-price" style={{ margin: 0 }}>
                  {o.total_price.toFixed(2)} ج.م
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
