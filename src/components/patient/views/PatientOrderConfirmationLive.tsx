"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { authService } from "@/services/authService";
import { orderService, type Order } from "@/services/orderService";

export default function PatientOrderConfirmationLive() {
  const searchParams = useSearchParams();
  const idParam = searchParams?.get("id") ?? null;
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

  const target = idParam
    ? orders.find((o) => o.id === Number(idParam))
    : orders.find((o) => o.status === "confirmed");

  const handleConfirm = async (orderId: number) => {
    setBusy(orderId);
    try {
      await orderService.patientConfirm(orderId);
      await load();
    } finally {
      setBusy(null);
    }
  };

  if (authService.getGuard() !== "user" || !authService.getToken()) {
    return (
      <div className="min-h-screen bg-slate-50 p-8" dir="rtl">
        <Link href="/patient-login" className="font-bold text-blue-600">
          سجّل الدخول
        </Link>
      </div>
    );
  }

  if (!target || target.status !== "confirmed") {
    return (
      <div className="min-h-screen bg-slate-50 p-8" dir="rtl">
        <h1 className="mb-4 text-2xl font-bold">تأكيد الطلب</h1>
        <p className="text-slate-600">لا يوجد طلب بانتظار تأكيدك حالياً.</p>
        <Link href="/patient-review-orders" className="mt-4 inline-block font-bold text-blue-600">
          طلباتي
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8" dir="rtl">
      <h1 className="mb-2 text-2xl font-black text-slate-900">تأكيد الطلب</h1>
      <p className="mb-6 text-slate-500">وافقت الصيدلية على طلبك. يمكنك تأكيده لبدء التجهيز.</p>

      <div className="max-w-lg rounded-2xl bg-white p-6 shadow">
        <p className="mb-2 font-bold text-[#0456AE]">طلب #{target.id}</p>
        <p className="mb-2 text-slate-800">{target.pharmacy?.name ?? "صيدلية"}</p>
        <p className="mb-4 text-sm text-slate-500">
          {target.items?.map((i) => `${i.medicine_name} ×${i.quantity}`).join("، ") ?? "—"}
        </p>
        <p className="mb-6 text-xl font-bold">{target.total_price.toFixed(2)} ج.م</p>
        <button
          type="button"
          disabled={busy === target.id}
          className="w-full rounded-xl bg-[#0456AE] py-3 font-bold text-white"
          onClick={() => handleConfirm(target.id)}
        >
          {busy === target.id ? "جاري التأكيد..." : "تأكيد الطلب"}
        </button>
        <Link href={`/patient-order-tracking?id=${target.id}`} className="mt-4 block text-center text-sm text-blue-600">
          تتبع الطلب بعد التأكيد
        </Link>
      </div>
    </div>
  );
}
