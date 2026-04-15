"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PatientShell from "@/components/patient/PatientShell";
import { authService } from "@/services/authService";
import { orderService } from "@/services/orderService";
import { requestService, type Offer } from "@/services/requestService";

function PatientOffersInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestIdParam = searchParams?.get("requestId");
  const requestId = requestIdParam ? Number(requestIdParam) : NaN;

  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyResponseId, setBusyResponseId] = useState<number | null>(null);

  const load = useCallback(async () => {
    if (!Number.isFinite(requestId) || requestId < 1) {
      setLoading(false);
      setError("معرّف الطلب غير صالح.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await requestService.getOffers(requestId);
      setOffers(data.offers);
    } catch {
      setOffers([]);
      setError("تعذر تحميل العروض. قد لا يكون الطلب لك أو انتهى.");
    } finally {
      setLoading(false);
    }
  }, [requestId]);

  useEffect(() => {
    if (authService.getGuard() !== "user" || !authService.getToken()) return;
    void load();
    const on = () => void load();
    window.addEventListener("healup:notification", on);
    return () => window.removeEventListener("healup:notification", on);
  }, [load]);

  const chooseOffer = async (responseId: number) => {
    setBusyResponseId(responseId);
    setError(null);
    try {
      await orderService.create(responseId, true);
      window.dispatchEvent(new Event("healup:notification"));
      router.push("/patient-review-orders");
    } catch {
      setError("تعذر إنشاء الطلب من هذا العرض. حاول مرة أخرى.");
    } finally {
      setBusyResponseId(null);
    }
  };

  const sorted = useMemo(
    () =>
      [...offers].sort((a, b) => {
        const da = a.distance_km ?? 9999;
        const db = b.distance_km ?? 9999;
        return da - db;
      }),
    [offers]
  );

  if (authService.getGuard() !== "user" || !authService.getToken()) {
    return (
      <div className="min-h-screen bg-slate-50 p-8" dir="rtl">
        <p className="text-slate-600">
          <Link href="/patient-login" className="font-bold text-[#0456AE]">
            سجّل الدخول
          </Link>{" "}
          لعرض عروض الصيدليات.
        </p>
      </div>
    );
  }

  if (!Number.isFinite(requestId) || requestId < 1) {
    return (
      <div className="min-h-screen bg-slate-50 p-8" dir="rtl">
        <p className="text-slate-600">أضف رقم الطلب في الرابط: ?requestId=</p>
        <Link href="/patient-review-orders" className="mt-4 inline-block font-bold text-[#0456AE]">
          طلباتي
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8" dir="rtl">
        <p className="text-slate-500">جاري تحميل العروض…</p>
      </div>
    );
  }

  if (error && offers.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8" dir="rtl">
        <p className="text-red-600">{error}</p>
        <Link href="/patient-review-orders" className="mt-6 inline-block font-bold text-[#0456AE]">
          العودة لطلباتي
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 pb-16 pt-4 md:px-8" dir="rtl">
      <h1 className="mb-2 text-3xl font-black text-[#002B5B]">عروض الصيدليات</h1>
      <p className="mb-2 text-slate-500">طلب دواء #{requestId}</p>
      {error ? <p className="mb-4 text-sm font-bold text-red-600">{error}</p> : null}

      {sorted.length === 0 ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-600">لا توجد عروض بعد. ستصلك إشعاراً عند وصول عرض من صيدلية.</p>
          <Link href="/patient-review-orders" className="mt-6 inline-block font-bold text-[#0456AE]">
            طلباتي
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {sorted.map((offer) => {
            const r = offer.response;
            const meds = r.response_medicines ?? [];
            const subtotal = meds.reduce((s, m) => s + m.price * m.quantity_available, 0);
            const total = subtotal + r.delivery_fee;
            return (
              <div key={r.id} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-lg font-black text-slate-900">{r.pharmacy?.name ?? "صيدلية"}</p>
                    {offer.distance_km != null ? (
                      <p className="text-sm text-slate-500">على بعد {offer.distance_km.toFixed(1)} كم</p>
                    ) : null}
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                    توصيل {r.delivery_fee.toFixed(0)} ج.م
                  </span>
                </div>
                <ul className="mb-4 space-y-2 text-sm text-slate-700">
                  {meds.map((m) => (
                    <li key={m.medicine_name} className="flex justify-between gap-2">
                      <span>
                        {m.medicine_name}
                        {!m.available ? <span className="text-amber-700"> (غير متوفر)</span> : null}
                      </span>
                      <span>
                        {m.quantity_available} × {m.price.toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mb-4 text-xl font-black text-[#0456AE]">{total.toFixed(2)} ج.م إجمالاً</p>
                <button
                  type="button"
                  disabled={busyResponseId === r.id || meds.some((m) => !m.available)}
                  className="w-full rounded-xl bg-[#0456AE] py-3 text-center text-sm font-black text-white disabled:opacity-50"
                  onClick={() => void chooseOffer(r.id)}
                >
                  {busyResponseId === r.id ? "جاري إنشاء الطلب…" : "اختيار هذا العرض"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function PatientOffersPage() {
  return (
    <PatientShell active="orders">
      <Suspense fallback={<div className="p-8 text-center text-slate-500">جاري التحميل...</div>}>
        <PatientOffersInner />
      </Suspense>
    </PatientShell>
  );
}
