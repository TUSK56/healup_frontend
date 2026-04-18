"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { motion } from "motion/react";
import {
  CheckCircle2,
  Clock,
  CreditCard,
  Home,
  MapPin,
  Pill,
  Truck,
} from "lucide-react";
import { formatDeliveryEtaRangeKm, haversineKm } from "@/lib/deliveryEta";
import { computeOrderPricingDisplay } from "@/lib/orderPricingDisplay";
import { orderService, type Order } from "@/services/orderService";

const brand = "#0456AE";

function formatMoney(n: number) {
  return `${n.toFixed(2)} ج.م`;
}

export default function PatientOrderConfirmationContent() {
  const searchParams = useSearchParams();
  const rawId = searchParams.get("orderId") ?? searchParams.get("id");
  const orderId = rawId ? parseInt(rawId, 10) : NaN;

  const [order, setOrder] = React.useState<Order | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!Number.isFinite(orderId) || orderId < 1) {
      setLoading(false);
      setError("رقم الطلب غير صالح.");
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await orderService.getById(orderId);
        if (!cancelled) setOrder(data);
      } catch (e: unknown) {
        if (!cancelled) {
          const ax = e as { response?: { data?: { message?: string } } };
          const msg = ax.response?.data?.message?.trim();
          setError(msg || "تعذر تحميل الطلب. حاول مرة أخرى.");
          setOrder(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const pricing = React.useMemo(
    () => computeOrderPricingDisplay(Boolean(order?.delivery), order?.items),
    [order?.delivery, order?.items],
  );

  const patientPharmacyDistanceKm = React.useMemo(() => {
    if (!order) return null;
    const plat = order.pharmacy?.latitude;
    const plng = order.pharmacy?.longitude;
    const patLat = order.patient?.latitude;
    const patLng = order.patient?.longitude;
    if (
      typeof plat === "number" &&
      Number.isFinite(plat) &&
      typeof plng === "number" &&
      Number.isFinite(plng) &&
      typeof patLat === "number" &&
      Number.isFinite(patLat) &&
      typeof patLng === "number" &&
      Number.isFinite(patLng)
    ) {
      return haversineKm(patLat, patLng, plat, plng);
    }
    return null;
  }, [order]);

  if (loading) {
    return (
      <div className="patient-order-confirmation-wrap min-h-[60vh] bg-[#F8FAFC] px-4 py-8 rtl font-sans">
        <div className="mx-auto max-w-3xl rounded-3xl border border-gray-100 bg-white p-10 text-center text-gray-500 shadow-sm">
          جاري التحميل…
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="patient-order-confirmation-wrap min-h-[60vh] bg-[#F8FAFC] px-4 py-8 rtl font-sans">
        <div className="mx-auto max-w-3xl rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <p className="text-gray-700">{error || "الطلب غير موجود."}</p>
          <Link
            href="/patient-home"
            className="mt-6 inline-flex items-center justify-center rounded-2xl px-6 py-3 font-bold text-white shadow-lg shadow-blue-100"
            style={{ background: brand }}
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  const pharmacyName = order.pharmacy?.name ?? "الصيدلية";
  const deliveryLabel = order.delivery ? "توصيل للمنزل" : "استلام من الصيدلية";
  const etaLabel =
    patientPharmacyDistanceKm != null
      ? formatDeliveryEtaRangeKm(patientPharmacyDistanceKm)
      : order.delivery
        ? "يُحدَّد بعد تأكيد الموقع مع الصيدلية"
        : "يُحدَّد بعد ربط موقعك بملفك";
  const payLabel = order.payment_method?.trim() || "—";

  return (
    <div className="patient-order-confirmation-wrap min-h-[60vh] bg-[#F8FAFC] px-4 py-8 rtl font-sans">
      <main className="mx-auto max-w-3xl space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm"
        >
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#ECFDF5]">
              <CheckCircle2 className="h-12 w-12 text-[#10B981]" />
            </div>
          </div>
          <h1 className="mb-3 text-3xl font-black text-gray-900">تم تأكيد طلبك بنجاح!</h1>
          <p className="mx-auto mb-6 max-w-md leading-relaxed text-gray-500">
            شكراً لثقتك بـ Healup. نحن نقوم بمعالجة طلبك الآن.
          </p>
          <div
            className="inline-flex items-center rounded-full px-6 py-2 text-sm font-bold"
            style={{ background: "#F1F5F9", color: brand }}
          >
            رقم الطلب #{order.id}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 }}
            className="flex items-center justify-between rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
          >
            <div className="text-right">
              <p className="mb-1 text-sm text-gray-400">
                {order.delivery ? "وقت التوصيل المتوقع" : "الوقت للوصول للصيدلية (تقريبي)"}
              </p>
              <h3 className="text-xl font-bold text-gray-900">{etaLabel}</h3>
            </div>
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50"
              style={{ color: brand }}
            >
              <Clock className="h-6 w-6" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 }}
            className="flex items-center justify-between rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
          >
            <div className="text-right">
              <p className="mb-1 text-sm text-gray-400">طريقة الاستلام</p>
              <h3 className="text-xl font-bold text-gray-900">{deliveryLabel}</h3>
            </div>
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50"
              style={{ color: brand }}
            >
              {order.delivery ? <Truck className="h-6 w-6" /> : <MapPin className="h-6 w-6" />}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm"
        >
          <div className="border-b border-gray-50 p-6">
            <h2 className="text-xl font-bold text-gray-900">ملخص الطلب</h2>
          </div>

          <div className="space-y-6 p-6">
            {(order.items ?? []).map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-blue-600">
                    <Pill className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 text-right">
                    <h4 className="font-bold text-gray-900">{item.medicine_name}</h4>
                    <p className="text-xs text-gray-400">
                      {pharmacyName}
                      {item.quantity > 1 ? ` · الكمية ${item.quantity}` : ""}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 font-bold text-gray-900">{formatMoney(Number(item.price) * item.quantity)}</span>
              </div>
            ))}

            <div className="space-y-3 border-t border-gray-50 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">المجموع الفرعي</span>
                <span className="font-medium text-gray-900">{formatMoney(pricing.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">رسوم التوصيل</span>
                <span className="font-medium text-gray-900">
                  {order.delivery ? formatMoney(pricing.deliveryDisplay) : "—"}
                </span>
              </div>
              {pricing.subtotal > 0 ? (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">ضريبة القيمة المضافة (15%)</span>
                  <span className="font-medium text-gray-900">{formatMoney(pricing.vatDisplay)}</span>
                </div>
              ) : null}
              <div className="flex justify-between border-t border-gray-50 pt-3">
                <span className="text-lg font-black text-gray-900">الإجمالي</span>
                <span className="text-lg font-black text-gray-900">{formatMoney(pricing.grandDisplay)}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#F8FAFC] p-4">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-500">طريقة الدفع</span>
              </div>
              <span className="text-sm font-bold text-gray-900">{payLabel}</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2">
          <Link
            href={`/patient-order-tracking?orderId=${order.id}`}
            className="flex items-center justify-center gap-2 rounded-2xl py-4 font-bold text-white shadow-lg shadow-blue-100 transition-all hover:opacity-90"
            style={{ background: brand }}
          >
            <MapPin className="h-5 w-5" />
            <span>تتبع الطلب</span>
          </Link>
          <Link
            href="/patient-home"
            className="flex items-center justify-center gap-2 rounded-2xl border-2 bg-white py-4 font-bold transition-all hover:bg-blue-50"
            style={{ borderColor: brand, color: brand }}
          >
            <Home className="h-5 w-5" />
            <span>العودة للرئيسية</span>
          </Link>
        </div>

        <div className="pt-2 text-center">
          <p className="text-sm text-gray-400">
            لديك استفسار؟{" "}
            <a href="mailto:support@healup.app" className="font-bold underline underline-offset-4" style={{ color: brand }}>
              تواصل مع خدمة العملاء
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
