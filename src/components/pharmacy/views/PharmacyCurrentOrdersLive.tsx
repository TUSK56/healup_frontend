"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { orderService, type Order } from "@/services/orderService";
import { formatRelativeTimeAr } from "@/lib/formatRelativeAr";

const activeStatuses = new Set([
  "confirmed",
  "preparing",
  "out_for_delivery",
  "ready_for_pickup",
]);

type TabKey = "all" | "preparing" | "out_for_delivery" | "wait_pickup";

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

function statusPillClass(status: string): string {
  switch (status) {
    case "preparing":
      return "preparing";
    case "out_for_delivery":
      return "delivery";
    case "ready_for_pickup":
      return "pickup";
    case "confirmed":
      return "waiting";
    default:
      return "waiting";
  }
}

export default function PharmacyCurrentOrdersLive() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [busy, setBusy] = useState<number | null>(null);
  const [tab, setTab] = useState<TabKey>("all");

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

  const counts = useMemo(() => {
    const preparing = current.filter((o) => o.status === "preparing").length;
    const out = current.filter((o) => o.status === "out_for_delivery").length;
    const wait = current.filter((o) => o.status === "confirmed" || o.status === "ready_for_pickup").length;
    return { preparing, out, wait };
  }, [current]);

  const filtered = useMemo(() => {
    if (tab === "all") return current;
    if (tab === "preparing") return current.filter((o) => o.status === "preparing");
    if (tab === "out_for_delivery") return current.filter((o) => o.status === "out_for_delivery");
    return current.filter((o) => o.status === "confirmed" || o.status === "ready_for_pickup");
  }, [current, tab]);

  const nextAction = (o: Order): { label: string; status: string } | null => {
    switch (o.status) {
      case "confirmed":
        return null;
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
      window.dispatchEvent(new Event("healup:notification"));
    } finally {
      setBusy(null);
    }
  };

  return (
    <div dir="rtl">
      <header className="pharmacy-subpage-header">
        <h1 className="pharmacy-subpage-title">الطلبات الحالية</h1>
        <p className="pharmacy-subpage-desc">تابع حالة طلبات الأدوية الجارية وتفاصيل التوصيل</p>
      </header>

      <div className="pharmacy-current-tabs" role="tablist" aria-label="تصفية الطلبات">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "all"}
          className={`pharmacy-current-tab ${tab === "all" ? "active" : ""}`}
          onClick={() => setTab("all")}
        >
          الكل ({current.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "preparing"}
          className={`pharmacy-current-tab ${tab === "preparing" ? "active" : ""}`}
          onClick={() => setTab("preparing")}
        >
          جاري التجهيز ({counts.preparing})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "out_for_delivery"}
          className={`pharmacy-current-tab ${tab === "out_for_delivery" ? "active" : ""}`}
          onClick={() => setTab("out_for_delivery")}
        >
          خرج للتوصيل ({counts.out})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "wait_pickup"}
          className={`pharmacy-current-tab ${tab === "wait_pickup" ? "active" : ""}`}
          onClick={() => setTab("wait_pickup")}
        >
          جاهز / بانتظار ({counts.wait})
        </button>
      </div>

      <div className="pharmacy-current-grid">
        {filtered.length === 0 ? (
          <p className="pharmacy-analytics-muted" style={{ gridColumn: "1 / -1" }}>
            لا توجد طلبات في هذا القسم.
          </p>
        ) : (
          filtered.map((o) => {
            const act = nextAction(o);
            const alt = alternate(o);
            const pillClass = statusPillClass(o.status);
            return (
              <div key={o.id} className="pharmacy-current-card">
                <div className="pharmacy-current-card-top">
                  <span className="pharmacy-current-id-pill">HLP-{o.id}</span>
                  <span className={`pharmacy-current-status ${pillClass}`}>
                    <span className="pharmacy-current-status-dot" aria-hidden />
                    {labelAr(o.status)}
                  </span>
                </div>
                <h2 className="pharmacy-current-patient">{o.patient?.name ?? "مريض"}</h2>
                <div className="pharmacy-current-lines">
                  <div className="pharmacy-current-line">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                    </svg>
                    <span>{o.items?.map((i) => `${i.medicine_name} ×${i.quantity}`).join("، ") ?? "—"}</span>
                  </div>
                  <div className="pharmacy-current-line">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                    <span>{formatRelativeTimeAr(o.created_at)}</span>
                  </div>
                </div>
                <p className="pharmacy-current-price">{o.total_price.toFixed(2)} ج.م</p>
                <div className="pharmacy-current-actions">
                  {act ? (
                    <button
                      type="button"
                      disabled={busy === o.id}
                      className="pharmacy-current-btn-primary"
                      onClick={() => handle(o.id, act.status)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                      </svg>
                      {act.label}
                    </button>
                  ) : (
                    <button type="button" className="pharmacy-current-btn-primary" disabled style={{ opacity: 0.85 }}>
                      بانتظار إجراء المريض
                    </button>
                  )}
                  {alt ? (
                    <button
                      type="button"
                      disabled={busy === o.id}
                      className="pharmacy-current-btn-secondary"
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
