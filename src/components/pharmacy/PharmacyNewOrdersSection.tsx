"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { orderService, type Order } from "@/services/orderService";
import {
  pharmacyPortalService,
  type IncomingMedicineRequestRow,
  type SubmitOfferMedicine,
} from "@/services/pharmacyPortalService";
import { formatRelativeTimeAr } from "@/lib/formatRelativeAr";
import { getDrugPrice } from "@/lib/drugs";
import {
  buildUnifiedRows,
  readDismissed,
  writeDismissed,
  type UnifiedRow,
} from "@/components/pharmacy/pharmacyNewOrdersShared";

type Variant = "home" | "page";

export default function PharmacyNewOrdersSection({
  variant,
  homePreviewRows = 8,
}: {
  variant: Variant;
  /** Only on home dashboard: how many rows to show before «عرض الكل» */
  homePreviewRows?: number;
}) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [incoming, setIncoming] = useState<IncomingMedicineRequestRow[]>([]);
  const [dismissed, setDismissed] = useState<number[]>([]);
  const [busyOrderId, setBusyOrderId] = useState<number | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [offerOpen, setOfferOpen] = useState(false);
  const [offerRow, setOfferRow] = useState<IncomingMedicineRequestRow | null>(null);
  const [offerDelivery, setOfferDelivery] = useState("25");
  const [offerPrices, setOfferPrices] = useState<Record<number, string>>({});
  const [offerBusy, setOfferBusy] = useState(false);

  const [newOrdersSearch, setNewOrdersSearch] = useState("");
  const [newOrdersFilter, setNewOrdersFilter] = useState<"all" | "urgent_sort" | "rx_only">("all");
  const [newOrdersVisible, setNewOrdersVisible] = useState(12);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);

  const loadAll = useCallback(async () => {
    setLoadError(null);
    try {
      const [o, r] = await Promise.all([orderService.list(), pharmacyPortalService.incomingRequests()]);
      setOrders(o.data);
      setIncoming(r.data);
      setLastUpdatedAt(new Date());
    } catch {
      setLoadError("تعذر تحميل الطلبات. تأكد من تسجيل الدخول كصيدلية معتمدة.");
      setOrders([]);
      setIncoming([]);
    }
  }, []);

  useEffect(() => {
    setDismissed(readDismissed());
    void loadAll();
    const on = () => void loadAll();
    window.addEventListener("healup:notification", on);
    return () => window.removeEventListener("healup:notification", on);
  }, [loadAll]);

  useEffect(() => {
    setNewOrdersVisible(12);
  }, [newOrdersFilter, newOrdersSearch]);

  const pendingPurchase = useMemo(
    () => orders.filter((x) => x.status === "pending_pharmacy_confirmation"),
    [orders]
  );

  const rows = useMemo(
    () => buildUnifiedRows(incoming, pendingPurchase, dismissed),
    [incoming, pendingPurchase, dismissed]
  );

  const tableRows = useMemo(() => {
    if (variant === "home") {
      return rows.slice(0, homePreviewRows);
    }
    return rows;
  }, [rows, variant, homePreviewRows]);

  const pageDisplayRows = useMemo(() => {
    if (variant !== "page") return rows;
    let r = [...rows];
    const q = newOrdersSearch.trim().toLowerCase();
    if (q) {
      r = r.filter(
        (row) =>
          row.patientName.toLowerCase().includes(q) || row.medicineLabel.toLowerCase().includes(q)
      );
    }
    if (newOrdersFilter === "rx_only") {
      r = r.filter((row) => row.kind === "medicine" && row.hasRx);
    }
    if (newOrdersFilter === "urgent_sort") {
      r.sort((a, b) => new Date(a.timeIso).getTime() - new Date(b.timeIso).getTime());
    } else {
      r.sort((a, b) => new Date(b.timeIso).getTime() - new Date(a.timeIso).getTime());
    }
    return r;
  }, [rows, variant, newOrdersSearch, newOrdersFilter]);

  const inProgress = useMemo(
    () =>
      orders.filter((o) => ["confirmed", "preparing", "out_for_delivery", "ready_for_pickup"].includes(o.status))
        .length,
    [orders]
  );

  const completedToday = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return orders.filter((o) => o.status === "completed" && new Date(o.created_at) >= start).length;
  }, [orders]);

  const totalRevenue = useMemo(
    () => orders.filter((o) => o.status === "completed").reduce((s, o) => s + o.total_price, 0),
    [orders]
  );

  const handlePurchase = async (orderId: number, status: "confirmed" | "rejected") => {
    setBusyOrderId(orderId);
    try {
      await orderService.updateStatus(orderId, status);
      await loadAll();
      window.dispatchEvent(new Event("healup:notification"));
    } finally {
      setBusyOrderId(null);
    }
  };

  const dismissMedicine = (requestId: number) => {
    const next = [...dismissed, requestId];
    setDismissed(next);
    writeDismissed(next);
    window.dispatchEvent(new Event("healup:notification"));
  };

  const openOffer = (row: IncomingMedicineRequestRow) => {
    setOfferRow(row);
    setOfferDelivery("25");
    const prices: Record<number, string> = {};
    for (const m of row.request.medicines) {
      prices[m.id] = String(getDrugPrice(m.medicine_name));
    }
    setOfferPrices(prices);
    setOfferOpen(true);
  };

  const submitOffer = async () => {
    if (!offerRow) return;
    const fee = parseFloat(offerDelivery);
    if (!Number.isFinite(fee) || fee < 0) return;
    const medicines: SubmitOfferMedicine[] = offerRow.request.medicines.map((m) => {
      const p = parseFloat(offerPrices[m.id] ?? "0");
      return {
        medicine_name: m.medicine_name,
        available: true,
        quantity_available: m.quantity,
        price: Number.isFinite(p) && p > 0 ? p : getDrugPrice(m.medicine_name),
      };
    });
    setOfferBusy(true);
    try {
      await pharmacyPortalService.submitOffer({
        request_id: offerRow.request.id,
        delivery_fee: fee,
        medicines,
      });
      setOfferOpen(false);
      setOfferRow(null);
      await loadAll();
      window.dispatchEvent(new Event("healup:notification"));
    } finally {
      setOfferBusy(false);
    }
  };

  const OVERDUE_MS = 45 * 60 * 1000;

  const renderOfferModal = () =>
    offerOpen && offerRow ? (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15,23,42,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 50,
        }}
        role="dialog"
        aria-modal="true"
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 24,
            maxWidth: 440,
            width: "92%",
            boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 style={{ marginBottom: 12 }}>إرسال عرض للطلب #{offerRow.request.id}</h3>
          <label style={{ display: "block", marginBottom: 8 }}>رسوم التوصيل (ج.م)</label>
          <input
            type="number"
            min={0}
            value={offerDelivery}
            onChange={(e) => setOfferDelivery(e.target.value)}
            style={{ width: "100%", marginBottom: 16, padding: 10, borderRadius: 10, border: "1px solid #e2e8f0" }}
          />
          {offerRow.request.medicines.map((m) => (
            <div key={m.id} style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>
                {m.medicine_name} ×{m.quantity}
              </div>
              <label style={{ fontSize: 12, color: "#64748b" }}>سعر الوحدة</label>
              <input
                type="number"
                min={1}
                step="0.01"
                value={offerPrices[m.id] ?? ""}
                onChange={(e) => setOfferPrices((p) => ({ ...p, [m.id]: e.target.value }))}
                style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #e2e8f0" }}
              />
            </div>
          ))}
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button
              type="button"
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 10,
                border: "1px solid #e2e8f0",
                background: "#f8fafc",
                fontWeight: 700,
              }}
              onClick={() => setOfferOpen(false)}
            >
              إلغاء
            </button>
            <button
              type="button"
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 10,
                border: "none",
                background: "#1a56db",
                color: "#fff",
                fontWeight: 800,
                opacity: offerBusy ? 0.7 : 1,
              }}
              disabled={offerBusy}
              onClick={() => void submitOffer()}
            >
              {offerBusy ? "جاري الإرسال…" : "إرسال العرض"}
            </button>
          </div>
        </div>
      </div>
    ) : null;

  const renderRow = (row: UnifiedRow) =>
    row.kind === "medicine" ? (
      <tr key={row.key}>
        <td style={{ textAlign: "center" }}>
          <div className="patient-row" style={{ justifyContent: "center" }}>
            <div className="patient-avatar" style={{ background: "#bfdbfe" }}>👤</div>
            <span>{row.patientName}</span>
          </div>
        </td>
        <td style={{ textAlign: "center" }}>
          <div className="med-row" style={{ justifyContent: "center", flexWrap: "wrap", gap: 6 }}>
            {row.hasRx ? (
              <>
                {row.rxUrl?.startsWith("http") || row.rxUrl?.startsWith("data:") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={row.rxUrl}
                    alt=""
                    className="med-thumb"
                    style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover" }}
                  />
                ) : (
                  <div className="med-thumb">📋</div>
                )}
                <span>وصفة + {row.medicineLabel}</span>
              </>
            ) : (
              <>
                <div className="med-thumb">💊</div>
                <span>{row.medicineLabel}</span>
              </>
            )}
          </div>
        </td>
        <td style={{ textAlign: "center" }}>
          <span className="time-text">{formatRelativeTimeAr(row.timeIso)}</span>
        </td>
        <td style={{ textAlign: "center" }}>
          <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              className="pill pill-green"
              style={{ padding: "6px 14px", borderRadius: 8, border: "none", fontWeight: 700 }}
              onClick={() => {
                const full = incoming.find((i) => i.request.id === row.requestId);
                if (full) openOffer(full);
              }}
            >
              متوفر
            </button>
            <button
              type="button"
              className="pill pill-red"
              style={{ padding: "6px 14px", borderRadius: 8, border: "none", fontWeight: 700 }}
              onClick={() => dismissMedicine(row.requestId)}
            >
              غير متوفر
            </button>
          </div>
        </td>
      </tr>
    ) : (
      <tr key={row.key}>
        <td style={{ textAlign: "center" }}>
          <div className="patient-row" style={{ justifyContent: "center" }}>
            <div className="patient-avatar" style={{ background: "#fde68a" }}>👤</div>
            <span>{row.patientName}</span>
          </div>
        </td>
        <td style={{ textAlign: "center" }}>
          <div className="med-row" style={{ justifyContent: "center" }}>
            <div className="med-thumb">🧾</div>
            <span>
              طلب شراء #{row.order.id} — {row.medicineLabel}
            </span>
          </div>
        </td>
        <td style={{ textAlign: "center" }}>
          <span className="time-text">{formatRelativeTimeAr(row.timeIso)}</span>
        </td>
        <td style={{ textAlign: "center" }}>
          <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              className="pill pill-green"
              disabled={busyOrderId === row.order.id}
              style={{ padding: "6px 14px", borderRadius: 8, border: "none", fontWeight: 700 }}
              onClick={() => void handlePurchase(row.order.id, "confirmed")}
            >
              موافقة
            </button>
            <button
              type="button"
              className="pill pill-red"
              disabled={busyOrderId === row.order.id}
              style={{ padding: "6px 14px", borderRadius: 8, border: "none", fontWeight: 700 }}
              onClick={() => void handlePurchase(row.order.id, "rejected")}
            >
              رفض
            </button>
          </div>
        </td>
      </tr>
    );

  const renderPageOrderCard = (row: UnifiedRow) => {
    const overdue = Date.now() - new Date(row.timeIso).getTime() > OVERDUE_MS;
    if (row.kind === "medicine") {
      const showRxImg = row.rxUrl?.startsWith("http") || row.rxUrl?.startsWith("data:");
      return (
        <article key={row.key} className={`pharmacy-new-order-card ${overdue ? "is-urgent" : ""}`}>
          <div className="pharmacy-new-card-top">
            <div className="pharmacy-new-card-med-icon" aria-hidden>
              💊
            </div>
            <div style={{ textAlign: "right" }}>
              <span className="pharmacy-new-card-id">REQ-{row.requestId}</span>
              <div className="pharmacy-new-card-name">{row.patientName}</div>
              <div className="pharmacy-new-card-meta">
                <span>{formatRelativeTimeAr(row.timeIso)}</span>
                {row.hasRx ? <span className="pharmacy-new-urgent-tag">وصفة طبية</span> : null}
                {overdue ? <span className="pharmacy-new-urgent-tag">بانتظار رد</span> : null}
              </div>
            </div>
          </div>
          <div className="pharmacy-new-card-med">
            <div className="pharmacy-new-card-med-info">
              <div className="pharmacy-new-card-med-name">{row.medicineLabel}</div>
              <div className="pharmacy-new-card-med-qty">{row.medicines.length} صنف</div>
              {row.hasRx && row.rxUrl?.startsWith("http") ? (
                <a
                  href={row.rxUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: 11, color: "var(--blue)", fontWeight: 600, marginTop: 4, display: "inline-block" }}
                >
                  عرض الوصفة
                </a>
              ) : null}
            </div>
            <div className={`pharmacy-new-card-thumb ${row.hasRx ? "blue-bg" : ""}`}>
              {showRxImg ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={row.rxUrl!} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : row.hasRx ? (
                "📋"
              ) : (
                "💊"
              )}
            </div>
          </div>
          <div className="pharmacy-new-card-actions">
            <button
              type="button"
              className="pharmacy-new-btn-available"
              onClick={() => {
                const full = incoming.find((i) => i.request.id === row.requestId);
                if (full) openOffer(full);
              }}
            >
              متوفر
            </button>
            <button type="button" className="pharmacy-new-btn-unavailable" onClick={() => dismissMedicine(row.requestId)}>
              غير متوفر
            </button>
          </div>
        </article>
      );
    }
    return (
      <article key={row.key} className={`pharmacy-new-order-card ${overdue ? "is-urgent" : ""}`}>
        <div className="pharmacy-new-card-top">
          <div className="pharmacy-new-card-med-icon" aria-hidden>
            🧾
          </div>
          <div style={{ textAlign: "right" }}>
            <span className="pharmacy-new-card-id">ORD-{row.order.id}</span>
            <div className="pharmacy-new-card-name">{row.patientName}</div>
            <div className="pharmacy-new-card-meta">
              <span>{formatRelativeTimeAr(row.timeIso)}</span>
              {overdue ? <span className="pharmacy-new-urgent-tag">بانتظار رد</span> : null}
            </div>
          </div>
        </div>
        <div className="pharmacy-new-card-med">
          <div className="pharmacy-new-card-med-info">
            <div className="pharmacy-new-card-med-name">طلب شراء</div>
            <div className="pharmacy-new-card-med-qty">{row.medicineLabel}</div>
          </div>
          <div className="pharmacy-new-card-thumb amber-bg">🧾</div>
        </div>
        <div className="pharmacy-new-card-actions">
          <button
            type="button"
            className="pharmacy-new-btn-available"
            disabled={busyOrderId === row.order.id}
            onClick={() => void handlePurchase(row.order.id, "confirmed")}
          >
            موافقة
          </button>
          <button
            type="button"
            className="pharmacy-new-btn-unavailable"
            disabled={busyOrderId === row.order.id}
            onClick={() => void handlePurchase(row.order.id, "rejected")}
          >
            رفض
          </button>
        </div>
      </article>
    );
  };

  const tableBlock = (
    <>
      {loadError ? <p style={{ color: "#b91c1c", fontWeight: 700, marginBottom: 16 }}>{loadError}</p> : null}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2">
            <path d="M2 8l10 7 10-7" />
            <rect x="2" y="6" width="20" height="14" rx="2" />
          </svg>
          <span className="section-title">طلبات جديدة</span>
        </div>
        {variant === "home" ? (
          <Link href="/pharmacy-dashboard/new-orders" style={{ fontSize: 12, color: "var(--blue)", fontWeight: 600 }}>
            عرض الكل
          </Link>
        ) : null}
      </div>

      <div className="section-card" style={{ paddingTop: 12 }}>
        <table className="orders-table" style={{ tableLayout: "fixed", width: "100%" }}>
          <thead>
            <tr>
              <th style={{ width: "22%", textAlign: "center" }}>المريض</th>
              <th style={{ width: "36%", textAlign: "center" }}>الدواء / الوصفة</th>
              <th style={{ width: "18%", textAlign: "center" }}>الوقت</th>
              <th style={{ width: "24%", textAlign: "center" }}>الإجراء</th>
            </tr>
          </thead>
          <tbody>{tableRows.map((row) => renderRow(row))}</tbody>
        </table>
        {rows.length === 0 ? (
          <p style={{ textAlign: "center", padding: 24, color: "#64748b" }}>لا توجد طلبات جديدة حالياً.</p>
        ) : null}
      </div>
    </>
  );

  if (variant === "page") {
    const visibleSlice = pageDisplayRows.slice(0, newOrdersVisible);
    const updateLabel = lastUpdatedAt
      ? lastUpdatedAt.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })
      : "—";

    return (
      <>
        <div className="pharmacy-new-page">
          <div className="pharmacy-new-header">
            <h1 className="pharmacy-new-title">الطلبات الجديدة</h1>
            <p className="pharmacy-new-subtitle">
              لديك <span>{rows.length}</span> {rows.length === 1 ? "طلب" : "طلبات"} بحاجة إلى رد سريع
            </p>
          </div>

          <div className="pharmacy-new-toolbar">
            <div className="pharmacy-new-toolbar-left">
              <div className="pharmacy-new-search">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="search"
                  placeholder="ابحث عن مريض أو دواء..."
                  value={newOrdersSearch}
                  onChange={(e) => setNewOrdersSearch(e.target.value)}
                  aria-label="بحث"
                />
              </div>
            </div>
            <button type="button" className="pharmacy-new-update-badge" onClick={() => void loadAll()}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 4v6h-6" />
                <path d="M20.49 15a9 9 0 11-2-8L23 10" />
              </svg>
              آخر تحديث {updateLabel}
            </button>
          </div>

          <div className="pharmacy-new-filter-row">
            <button
              type="button"
              className={`pharmacy-new-filter-btn ${newOrdersFilter === "all" ? "active" : ""}`}
              onClick={() => setNewOrdersFilter("all")}
            >
              الكل
            </button>
            <button
              type="button"
              className={`pharmacy-new-filter-btn ${newOrdersFilter === "urgent_sort" ? "active" : ""}`}
              onClick={() => setNewOrdersFilter("urgent_sort")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              عاجل أولاً
            </button>
            <button
              type="button"
              className={`pharmacy-new-filter-btn ${newOrdersFilter === "rx_only" ? "active" : ""}`}
              onClick={() => setNewOrdersFilter("rx_only")}
            >
              بوصفة طبية
            </button>
          </div>

          {loadError ? <p style={{ color: "#b91c1c", fontWeight: 700, marginBottom: 16 }}>{loadError}</p> : null}

          <div className="pharmacy-new-cards-grid">
            {visibleSlice.length === 0 ? (
              <p style={{ gridColumn: "1 / -1", textAlign: "center", padding: 32, color: "#64748b" }}>
                {rows.length === 0 ? "لا توجد طلبات جديدة حالياً." : "لا توجد طلبات تطابق التصفية."}
              </p>
            ) : (
              visibleSlice.map((row) => renderPageOrderCard(row))
            )}
          </div>

          {pageDisplayRows.length > newOrdersVisible ? (
            <div className="pharmacy-new-load-more-wrap">
              <button
                type="button"
                className="pharmacy-new-load-more-btn"
                onClick={() => setNewOrdersVisible((n) => n + 12)}
              >
                عرض المزيد من الطلبات
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            </div>
          ) : null}
        </div>
        {renderOfferModal()}
      </>
    );
  }

  /* home */
  return (
    <>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon icon-light">
              <span style={{ fontSize: 11, fontWeight: 900, color: "#1a56db", letterSpacing: "-0.5px" }}>NEW</span>
            </div>
            {rows.length > 0 ? <span className="stat-badge badge-green">+</span> : null}
          </div>
          <div className="stat-label">طلبات جديدة</div>
          <div className="stat-value">{rows.length}</div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon icon-orange">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5">
                <path d="M3 12a9 9 0 019-9 9.75 9.75 0 016.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 01-9 9 9.75 9.75 0 01-6.74-2.74L3 16" />
                <path d="M8 16H3v5" />
              </svg>
            </div>
            {inProgress > 0 ? <span className="stat-badge badge-orange">نشط</span> : null}
          </div>
          <div className="stat-label">طلبات قيد التنفيذ</div>
          <div className="stat-value">{inProgress}</div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon icon-green">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            {completedToday > 0 ? (
              <span className="stat-badge badge-green">{completedToday} اليوم</span>
            ) : null}
          </div>
          <div className="stat-label">مكتمل اليوم</div>
          <div className="stat-value">{completedToday}</div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon icon-blue">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2">
                <rect x="6" y="3" width="16" height="11" rx="2" />
                <path d="M2 9v7a2 2 0 002 2h14" />
                <circle cx="14" cy="8.5" r="2" />
              </svg>
            </div>
          </div>
          <div className="stat-label">إجمالي الإيرادات</div>
          <div className="stat-value">
            {totalRevenue.toLocaleString("ar-EG", { maximumFractionDigits: 0 })} <span>ج.م</span>
          </div>
        </div>
      </div>

      <div className="bottom-grid" style={{ marginTop: 20 }}>
        <div>{tableBlock}</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                  <rect x="1" y="3" width="15" height="13" rx="2" />
                  <path d="M16 8h4l3 3v5h-7V8z" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
                <span className="section-title">نشاط حالي</span>
              </div>
            </div>
            <div className="activity-card">
              <div className="activity-list">
                <p style={{ padding: 20, color: "#64748b", textAlign: "center", margin: 0 }}>
                  تفاصيل الطلبات النشطة تظهر في «الطلبات الحالية».
                </p>
              </div>
            </div>
          </div>
          <div className="bottom-btns">
            <button className="bottom-btn btn-add-stock" type="button">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>إضافة مخزون</span>
            </button>
            <button className="bottom-btn btn-support" type="button">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2">
                <path d="M3 11C3 6.03 7.03 2 12 2s9 4.03 9 9" />
                <rect x="2" y="11" width="3" height="6" rx="1.5" />
                <rect x="19" y="11" width="3" height="6" rx="1.5" />
              </svg>
              <span>الدعم الفني</span>
            </button>
          </div>
        </div>
      </div>

      {renderOfferModal()}
    </>
  );
}
