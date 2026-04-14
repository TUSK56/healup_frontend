"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { authService } from "@/services/authService";
import { orderService, type Order } from "@/services/orderService";

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

export default function PatientOrderTrackingLive() {
  const searchParams = useSearchParams();
  const idParam = searchParams?.get("id") ?? null;
  const [order, setOrder] = useState<Order | null>(null);
  const [missing, setMissing] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!idParam || !authService.getToken()) {
      setOrder(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const o = await orderService.getById(Number(idParam));
      setOrder(o);
      setMissing(false);
    } catch {
      setMissing(true);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [idParam]);

  useEffect(() => {
    load();
    const on = () => load();
    window.addEventListener("healup:notification", on);
    return () => window.removeEventListener("healup:notification", on);
  }, [load]);

  if (authService.getGuard() !== "user" || !authService.getToken()) {
    return (
      <div className="min-h-screen bg-slate-50 p-8" dir="rtl">
        <p>
          <Link href="/patient-login" className="font-bold text-blue-600">
            سجّل الدخول
          </Link>{" "}
          لعرض التتبع.
        </p>
      </div>
    );
  }

  if (!idParam) {
    return (
      <div className="min-h-screen bg-slate-50 p-8" dir="rtl">
        <p className="text-slate-600">اختر طلباً من «طلباتي» ثم اضغط «تتبع الطلب».</p>
        <Link href="/patient-review-orders" className="mt-4 inline-block font-bold text-blue-600">
          طلباتي
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8" dir="rtl">
        <p className="text-slate-500">جاري التحميل...</p>
      </div>
    );
  }

  if (missing || order === null) {
    return (
      <div className="min-h-screen bg-slate-50 p-8" dir="rtl">
        <p className="text-red-600">لم يتم العثور على الطلب.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8" dir="rtl">
      <h1 className="mb-2 text-2xl font-black text-slate-900">تتبع الطلب #{order.id}</h1>
      <p className="mb-6 text-slate-500">{order.pharmacy?.name ?? "صيدلية"}</p>

      <div className="mb-6 rounded-2xl bg-white p-6 shadow">
        <p className="mb-2 text-sm text-slate-500">الحالة</p>
        <p className="text-xl font-bold text-blue-700">{statusLabel(order.status)}</p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow">
        <p className="mb-4 font-bold text-slate-800">الأصناف</p>
        <ul className="space-y-2">
          {order.items?.map((i) => (
            <li key={i.id} className="flex justify-between text-sm">
              <span>{i.medicine_name}</span>
              <span>
                {i.quantity} × {i.price.toFixed(2)} ج.م
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 border-t pt-4 text-lg font-bold">الإجمالي: {order.total_price.toFixed(2)} ج.م</p>
      </div>

      <Link href="/patient-review-orders" className="mt-8 inline-block text-blue-600">
        ← العودة لطلباتي
      </Link>
    </div>
  );
}
