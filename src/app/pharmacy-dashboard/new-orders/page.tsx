"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import PharmacySidebar from "@/components/pharmacy/PharmacySidebar";
import PharmacyTopNavbar from "@/components/pharmacy/PharmacyTopNavbar";
import { orderService, type Order } from "@/services/orderService";
import {
  pharmacyPortalService,
  type IncomingMedicineRequestRow,
  type SubmitOfferMedicine,
} from "@/services/pharmacyPortalService";
import { formatRelativeTimeAr } from "@/lib/formatRelativeAr";
import { getDrugPrice } from "@/lib/drugs";

const DISMISS_KEY = "healup_pharmacy_dismissed_requests";

function readDismissed(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(DISMISS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as unknown;
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "number") : [];
  } catch {
    return [];
  }
}

function writeDismissed(ids: number[]) {
  sessionStorage.setItem(DISMISS_KEY, JSON.stringify(ids));
}

type UnifiedRow =
  | {
      kind: "medicine";
      key: string;
      patientName: string;
      medicineLabel: string;
      hasRx: boolean;
      rxUrl: string | null;
      timeIso: string;
      requestId: number;
      medicines: IncomingMedicineRequestRow["request"]["medicines"];
    }
  | {
      kind: "purchase";
      key: string;
      patientName: string;
      medicineLabel: string;
      timeIso: string;
      order: Order;
    };

export default function PharmacyNewOrdersPage() {
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

  const loadAll = useCallback(async () => {
    setLoadError(null);
    try {
      const [o, r] = await Promise.all([orderService.list(), pharmacyPortalService.incomingRequests()]);
      setOrders(o.data);
      setIncoming(r.data);
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

  const pendingPurchase = useMemo(
    () => orders.filter((x) => x.status === "pending_pharmacy_confirmation"),
    [orders]
  );

  const rows = useMemo(() => {
    const list: UnifiedRow[] = [];
    for (const row of incoming) {
      if (dismissed.includes(row.request.id)) continue;
      const meds = row.request.medicines.map((m) => `${m.medicine_name} ×${m.quantity}`).join("، ");
      const rx = row.request.prescription_url;
      list.push({
        kind: "medicine",
        key: `m-${row.request.id}`,
        patientName: row.request.patient?.name ?? "مريض",
        medicineLabel: meds || (rx ? "وصفة طبية" : "—"),
        hasRx: !!rx,
        rxUrl: rx,
        timeIso: row.request.created_at,
        requestId: row.request.id,
        medicines: row.request.medicines,
      });
    }
    for (const o of pendingPurchase) {
      const meds = o.items?.map((i) => `${i.medicine_name} ×${i.quantity}`).join("، ") ?? "—";
      list.push({
        kind: "purchase",
        key: `p-${o.id}`,
        patientName: o.patient?.name ?? "مريض",
        medicineLabel: meds,
        timeIso: o.created_at,
        order: o,
      });
    }
    return list.sort((a, b) => new Date(b.timeIso).getTime() - new Date(a.timeIso).getTime());
  }, [incoming, pendingPurchase, dismissed]);

  const inProgress = useMemo(
    () => orders.filter((o) => ["confirmed", "preparing", "out_for_delivery", "ready_for_pickup"].includes(o.status)).length,
    [orders]
  );

  const completedToday = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return orders.filter((o) => o.status === "completed" && new Date(o.created_at) >= start).length;
  }, [orders]);

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

  return (
    <div className="pharmacyDashboard">
      <PharmacySidebar active="new-orders" />
      <div className="main" style={{ padding: 0 }}>
        <PharmacyTopNavbar />
        <div className="content" style={{ padding: "20px 24px 40px" }}>
          <div className="stats-grid" style={{ marginBottom: 24 }}>
            <div className="stat-card">
              <div className="stat-top">
                <div className="stat-icon icon-light">
                  <span style={{ fontSize: 11, fontWeight: 900, color: "#1a56db" }}>NEW</span>
                </div>
              </div>
              <div className="stat-label">طلبات تحتاج رد</div>
              <div className="stat-value">{incoming.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-top">
                <div className="stat-icon icon-orange">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5">
                    <path d="M3 12a9 9 0 019-9 9.75 9.75 0 016.74 2.74L21 8" />
                    <path d="M21 3v5h-5" />
                  </svg>
                </div>
              </div>
              <div className="stat-label">طلبات شراء بانتظارك</div>
              <div className="stat-value">{pendingPurchase.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-top">
                <div className="stat-icon icon-green">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
              </div>
              <div className="stat-label">مكتمل اليوم</div>
              <div className="stat-value">{completedToday}</div>
            </div>
            <div className="stat-card">
              <div className="stat-top">
                <div className="stat-icon icon-blue">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                  </svg>
                </div>
              </div>
              <div className="stat-label">قيد التنفيذ</div>
              <div className="stat-value">{inProgress}</div>
            </div>
          </div>

          {loadError ? (
            <p style={{ color: "#b91c1c", fontWeight: 700, marginBottom: 16 }}>{loadError}</p>
          ) : null}

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2">
                <path d="M2 8l10 7 10-7" />
                <rect x="2" y="6" width="20" height="14" rx="2" />
              </svg>
              <span className="section-title">طلبات جديدة</span>
            </div>
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
              <tbody>
                {rows.map((row) =>
                  row.kind === "medicine" ? (
                    <tr key={row.key}>
                      <td style={{ textAlign: "center" }}>
                        <div className="patient-row" style={{ justifyContent: "center" }}>
                          <div className="patient-avatar" style={{ background: "#bfdbfe" }}>
                            👤
                          </div>
                          <span>{row.patientName}</span>
                        </div>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <div className="med-row" style={{ justifyContent: "center", flexWrap: "wrap", gap: 6 }}>
                          {row.hasRx ? (
                            <>
                              {row.rxUrl?.startsWith("http") || row.rxUrl?.startsWith("data:") ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={row.rxUrl} alt="" className="med-thumb" style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover" }} />
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
                          <span>طلب شراء #{row.order.id} — {row.medicineLabel}</span>
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
                  )
                )}
              </tbody>
            </table>
            {rows.length === 0 ? (
              <p style={{ textAlign: "center", padding: 24, color: "#64748b" }}>لا توجد طلبات جديدة حالياً.</p>
            ) : null}
          </div>
        </div>
      </div>

      {offerOpen && offerRow ? (
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
                style={{ flex: 1, padding: 12, borderRadius: 10, border: "1px solid #e2e8f0", background: "#f8fafc", fontWeight: 700 }}
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
      ) : null}
    </div>
  );
}
