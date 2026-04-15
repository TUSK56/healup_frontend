"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getDrugPrice } from "@/lib/drugs";
import {
  pharmacyPortalService,
  type IncomingMedicineRequestRow,
  type SubmitOfferMedicine,
} from "@/services/pharmacyPortalService";

function defaultPriceForMedicine(name: string): number {
  const p = getDrugPrice(name);
  return Math.max(5, Math.round(p * 100) / 100);
}

export default function PharmacyIncomingRequestsSection() {
  const [rows, setRows] = useState<IncomingMedicineRequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyRequestId, setBusyRequestId] = useState<number | null>(null);
  const [deliveryFees, setDeliveryFees] = useState<Record<number, string>>({});
  const [prices, setPrices] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await pharmacyPortalService.incomingRequests();
      setRows(data.data);
      const feeInit: Record<number, string> = {};
      const priceInit: Record<string, string> = {};
      for (const row of data.data) {
        feeInit[row.request.id] = "25";
        for (const m of row.request.medicines) {
          priceInit[`${row.request.id}-${m.medicine_name}`] = String(defaultPriceForMedicine(m.medicine_name));
        }
      }
      setDeliveryFees((prev) => ({ ...feeInit, ...prev }));
      setPrices((prev) => ({ ...priceInit, ...prev }));
    } catch {
      setRows([]);
      setError("تعذر تحميل طلبات الأدوية الواردة.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const on = () => void load();
    window.addEventListener("healup:notification", on);
    return () => window.removeEventListener("healup:notification", on);
  }, [load]);

  const submit = async (row: IncomingMedicineRequestRow) => {
    const fee = parseFloat(deliveryFees[row.request.id] ?? "25");
    if (!Number.isFinite(fee) || fee < 0) {
      setError("أدخل رسوم توصيل صحيحة.");
      return;
    }
    const medicines: SubmitOfferMedicine[] = row.request.medicines.map((m) => {
      const key = `${row.request.id}-${m.medicine_name}`;
      const price = parseFloat(prices[key] ?? "0");
      return {
        medicine_name: m.medicine_name,
        available: true,
        quantity_available: m.quantity,
        price: Number.isFinite(price) && price > 0 ? price : defaultPriceForMedicine(m.medicine_name),
      };
    });

    setBusyRequestId(row.request.id);
    setError(null);
    try {
      await pharmacyPortalService.submitOffer({
        request_id: row.request.id,
        delivery_fee: fee,
        medicines,
      });
      await load();
      window.dispatchEvent(new Event("healup:notification"));
    } catch {
      setError("تعذر إرسال العرض. تحقق من الأسعار وحاول مرة أخرى.");
    } finally {
      setBusyRequestId(null);
    }
  };

  const sorted = useMemo(
    () => [...rows].sort((a, b) => (a.distance_km ?? 999) - (b.distance_km ?? 999)),
    [rows]
  );

  if (loading && rows.length === 0) {
    return <p style={{ padding: 12, color: "#64748b" }}>جاري تحميل طلبات الأدوية المفتوحة…</p>;
  }

  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ marginBottom: 10, fontWeight: 800, fontSize: 18 }}>طلبات أدوية جديدة (كل الصيدليات)</h2>
      <p style={{ marginBottom: 14, fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>
        عند إرسال المريض لطلب دواء، يصل الطلب هنا لجميع الصيدليات المعتمدة. أرسل عرضك بالأسعار ورسوم التوصيل.
      </p>
      {error ? (
        <p style={{ color: "#b91c1c", marginBottom: 10, fontWeight: 600 }}>{error}</p>
      ) : null}
      {sorted.length === 0 ? (
        <p style={{ color: "#64748b" }}>لا توجد طلبات أدوية بحاجة لرد من صيدليتك حالياً.</p>
      ) : (
        <div className="section-card" style={{ overflowX: "auto" }}>
          <table className="orders-table" style={{ width: "100%", minWidth: 720 }}>
            <thead>
              <tr>
                <th>الطلب</th>
                <th>الأدوية</th>
                <th>المسافة</th>
                <th>رسوم التوصيل</th>
                <th>إرسال عرض</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((row) => (
                <tr key={row.request.id}>
                  <td style={{ fontWeight: 700 }}>#{row.request.id}</td>
                  <td style={{ textAlign: "right", fontSize: 13 }}>
                    {row.request.medicines.map((m) => (
                      <div key={m.id} style={{ marginBottom: 8 }}>
                        <div style={{ fontWeight: 700 }}>{m.medicine_name} ×{m.quantity}</div>
                        <label style={{ fontSize: 12, color: "#64748b" }}>سعر الوحدة (ج.م)</label>
                        <input
                          type="number"
                          min={1}
                          step="0.01"
                          style={{ width: "100%", maxWidth: 120, marginTop: 4, padding: 6, borderRadius: 8, border: "1px solid #e2e8f0" }}
                          value={prices[`${row.request.id}-${m.medicine_name}`] ?? ""}
                          onChange={(e) =>
                            setPrices((p) => ({ ...p, [`${row.request.id}-${m.medicine_name}`]: e.target.value }))
                          }
                        />
                      </div>
                    ))}
                  </td>
                  <td>
                    {row.distance_km != null ? (
                      <span style={{ fontWeight: 700 }}>{row.distance_km.toFixed(1)} كم</span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    <input
                      type="number"
                      min={0}
                      step="1"
                      style={{ width: 88, padding: 8, borderRadius: 8, border: "1px solid #e2e8f0" }}
                      value={deliveryFees[row.request.id] ?? ""}
                      onChange={(e) =>
                        setDeliveryFees((f) => ({ ...f, [row.request.id]: e.target.value }))
                      }
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="pill pill-green"
                      disabled={busyRequestId === row.request.id}
                      onClick={() => void submit(row)}
                    >
                      {busyRequestId === row.request.id ? "جاري الإرسال…" : "إرسال العرض"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
