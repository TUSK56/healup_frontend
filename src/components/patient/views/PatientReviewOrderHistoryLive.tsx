"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { authService } from "@/services/authService";
import { orderService, type Order } from "@/services/orderService";

function statusLabel(s: string): string {
  const map: Record<string, string> = {
    completed: "مكتمل",
    rejected: "مرفوض",
  };
  return map[s] ?? s;
}

export default function PatientReviewOrderHistoryLive() {
  const searchParams = useSearchParams();
  const idParam = searchParams?.get("id") ?? null;
  const [order, setOrder] = useState<Order | null>(null);
  const [pastOrders, setPastOrders] = useState<Order[]>([]);
  const [missing, setMissing] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!idParam || !authService.getToken()) {
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
    } finally {
      setLoading(false);
    }
  }, [idParam]);

  const loadPast = useCallback(async () => {
    if (idParam || !authService.getToken()) return;
    setLoading(true);
    try {
      const data = await orderService.list();
      setPastOrders(data.data.filter((o) => o.status === "completed" || o.status === "rejected"));
    } catch {
      setPastOrders([]);
    } finally {
      setLoading(false);
    }
  }, [idParam]);

  useEffect(() => {
    if (idParam) {
      void load();
    } else {
      void loadPast();
    }
  }, [idParam, load, loadPast]);

  if (authService.getGuard() !== "user" || !authService.getToken()) {
    return (
      <div className="min-h-screen bg-slate-50 p-8" dir="rtl">
        <Link href="/patient-login" className="font-bold text-blue-600">
          سجّل الدخول
        </Link>
      </div>
    );
  }

  if (!idParam) {
    if (loading) {
      return (
        <div className="min-h-screen bg-slate-50 p-8" dir="rtl">
          <p className="text-slate-500">جاري التحميل...</p>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8" dir="rtl">
        <h1 className="mb-2 text-2xl font-black text-slate-900">تاريخ الطلبات</h1>
        <p className="mb-8 text-slate-500">الطلبات المكتملة أو المرفوضة</p>
        {pastOrders.length === 0 ? (
          <p className="text-slate-600">لا يوجد طلبات منتهية بعد.</p>
        ) : (
          <ul className="space-y-3">
            {pastOrders.map((o) => (
              <li key={o.id}>
                <Link
                  href={`/patient-review-order-history?id=${o.id}`}
                  className="flex flex-col rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-blue-200 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <span className="font-bold text-[#0456AE]">#{o.id}</span>
                    <p className="font-bold text-slate-800">{o.pharmacy?.name ?? "—"}</p>
                    <p className="text-xs text-slate-400">{new Date(o.created_at).toLocaleString("ar-EG")}</p>
                  </div>
                  <div className="mt-2 text-left md:mt-0 md:text-right">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">
                      {statusLabel(o.status)}
                    </span>
                    <p className="mt-1 text-lg font-black text-slate-900">{o.total_price.toFixed(2)} ج.م</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <Link href="/patient-review-orders" className="mt-8 inline-block font-bold text-blue-600">
          ← العودة لطلباتي النشطة
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

  if (missing || !order) {
    return (
      <div className="min-h-screen bg-slate-50 p-8" dir="rtl">
        <p className="text-red-600">لم يتم العثور على الطلب.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8" dir="rtl">
      <h1 className="mb-2 text-2xl font-black text-slate-900">تفاصيل الطلب #{order.id}</h1>
      <p className="mb-6 rounded-lg bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow">{statusLabel(order.status)}</p>

      <div className="mb-6 rounded-2xl bg-white p-6 shadow">
        <p className="text-sm text-slate-500">الصيدلية</p>
        <p className="text-lg font-bold">{order.pharmacy?.name ?? "—"}</p>
        <p className="mt-2 text-sm text-slate-400">{new Date(order.created_at).toLocaleString("ar-EG")}</p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow">
        <p className="mb-4 font-bold">الأصناف</p>
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
