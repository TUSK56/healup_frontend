"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { motion } from "motion/react";
import { CheckCircle2, Clock, Home, MapPin, Package, Pill, Store, User } from "lucide-react";
import { patientService } from "@/services/patientService";
import { orderService, type Order } from "@/services/orderService";
import { formatDeliveryEtaRangeKm, haversineKm } from "@/lib/deliveryEta";
import { computeOrderPricingDisplay } from "@/lib/orderPricingDisplay";

const PatientCourierRouteMap = dynamic(() => import("./PatientCourierRouteMap"), { ssr: false });

function parseServerDate(value?: string | null): Date {
  const v = (value || "").trim();
  if (!v) return new Date(NaN);
  if (/[zZ]$/.test(v) || /[+-]\d\d:?\d\d$/.test(v)) return new Date(v);
  return new Date(`${v}Z`);
}

function pharmacyBranchLine(ph: Order["pharmacy"]): string {
  if (!ph) return "";
  const parts = [ph.district, ph.city].filter(Boolean);
  if (parts.length) return `فرع ${parts.join("، ")}`;
  return (ph.address_details || "").trim();
}

function formatMoney(n: number) {
  return `${n.toFixed(2)} ج.م`;
}

function orderDeliveryFlag(o: Order): boolean {
  const v = o.delivery ?? (o as Order & { Delivery?: boolean }).Delivery;
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v !== 0;
  if (typeof v === "string") return v === "true" || v === "1";
  return true;
}

export default function PatientOrderTrackingView() {
  const searchParams = useSearchParams();
  const rawId = searchParams.get("orderId") ?? searchParams.get("id");
  const orderId = rawId ? parseInt(rawId, 10) : NaN;

  const [order, setOrder] = React.useState<Order | null>(null);
  const [patientPhone, setPatientPhone] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const loadOrder = React.useCallback(async () => {
    if (!Number.isFinite(orderId) || orderId < 1) return;
    const [o, me] = await Promise.all([orderService.getById(orderId), patientService.getMe().catch(() => null)]);
    setOrder(o);
    const phoneFromOrder = o.patient?.phone ?? null;
    const phoneFromMe = me?.data?.phone ?? null;
    setPatientPhone(phoneFromOrder || phoneFromMe || null);
  }, [orderId]);

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
        await loadOrder();
      } catch (e: unknown) {
        if (!cancelled) {
          const ax = e as { response?: { data?: { message?: string } } };
          setError(ax.response?.data?.message?.trim() || "تعذر تحميل الطلب.");
          setOrder(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [orderId, loadOrder]);

  React.useEffect(() => {
    if (!Number.isFinite(orderId) || orderId < 1) return;
    const status = (order?.status || "").toLowerCase();
    if (status === "completed" || status === "rejected") return;
    const id = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      void loadOrder().catch(() => {});
    }, 10000);
    return () => window.clearInterval(id);
  }, [orderId, loadOrder, order?.status]);

  const rejected = order && (order.status || "").toLowerCase() === "rejected";

  const trackingUi = React.useMemo(() => {
    if (!order) return null;
    const s = (order.status || "").toLowerCase().trim();

    const stageTwoTitle =
      s === "out_for_delivery" || s === "ready_for_pickup" || s === "completed"
        ? orderDeliveryFlag(order)
          ? "خارج للتوصيل"
          : "جاهز للاستلام"
        : "تأكيد الصيدلية والتجهيز";

    const stageTwoDesc =
      s === "completed"
        ? orderDeliveryFlag(order)
          ? "اكتملت مرحلة خروج المندوب للتوصيل"
          : "اكتملت مرحلة تجهيز الطلب للاستلام"
        : s === "out_for_delivery" || s === "ready_for_pickup"
          ? orderDeliveryFlag(order)
            ? "المندوب في الطريق إليك"
            : "يمكنك الاستلام من الفرع"
          : "الصيدلية تراجع الطلب وتؤكده، ثم يبدأ التجهيز بعد موافقتك.";

    const step3Unlocked =
      s === "out_for_delivery" || s === "ready_for_pickup" || s === "completed";

    const s2Done = ["out_for_delivery", "ready_for_pickup", "completed"].includes(s);

    const s2Current =
      !s2Done &&
      (s === "pending_pharmacy_confirmation" || s === "confirmed" || s === "preparing");

    const steps = [
      {
        key: "s1",
        title: "تم استلام الطلب",
        desc: "تم تسجيل طلبك بعد إتمام الشراء.",
        done: true,
        current: false,
      },
      {
        key: "s2",
        title: stageTwoTitle,
        desc: stageTwoDesc,
        done: s2Done,
        current: s2Current,
      },
      {
        key: "s3",
        title: orderDeliveryFlag(order) ? "خارج للتوصيل" : "جاهز للاستلام",
        desc: orderDeliveryFlag(order) ? "المندوب في الطريق إليك" : "يمكنك الاستلام من الفرع",
        done: s === "completed",
        current: step3Unlocked && s !== "completed",
      },
      {
        key: "s4",
        title: "تم التسليم",
        desc: orderDeliveryFlag(order) ? "تم تسليم الطلب" : "تم إكمال الطلب",
        done: s === "completed",
        current: false,
      },
    ];

    return { steps, step3Unlocked, createdAt: parseServerDate(order.created_at) };
  }, [order]);

  const pricing = React.useMemo(
    () => computeOrderPricingDisplay(order ? orderDeliveryFlag(order) : false, order?.items, order?.coupon_percent),
    [order, order?.items, order?.coupon_percent],
  );

  const etaLabel = React.useMemo(() => {
    if (!order) return "";
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
      return formatDeliveryEtaRangeKm(haversineKm(patLat, patLng, plat, plng));
    }
    return "يُحدَّد بعد ربط المواقع";
  }, [order]);

  if (loading) {
    return (
      <div className="patient-order-tracking-wrap min-h-[50vh] bg-slate-50 px-4 py-10 text-center text-slate-500 rtl">
        جاري تحميل تفاصيل الطلب…
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="patient-order-tracking-wrap min-h-[50vh] bg-slate-50 px-4 py-10 rtl">
        <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-700">{error || "الطلب غير موجود."}</p>
          <Link
            href="/patient-home"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#1a56db] px-6 py-3 text-sm font-bold text-white"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  const deliveryAddressText = (order.delivery_address_snapshot || "").trim() || "—";
  const patientName = order.patient?.name || "—";
  const phoneDisplay = (patientPhone || "").trim() || "—";
  const ph = order.pharmacy;
  const branch = pharmacyBranchLine(ph);
  const pharmacyCoords: [number, number] | null =
    typeof ph?.latitude === "number" && typeof ph?.longitude === "number"
      ? [ph.latitude, ph.longitude]
      : null;
  const patientCoords: [number, number] | null =
    typeof order.patient?.latitude === "number" && typeof order.patient?.longitude === "number"
      ? [order.patient.latitude, order.patient.longitude]
      : null;
  const canMap = Boolean(pharmacyCoords && patientCoords);
  const showCourierMap = Boolean(trackingUi?.step3Unlocked && canMap);
  const orderCompleted = (order.status || "").toLowerCase() === "completed";
  const statusLower = (order.status || "").toLowerCase();
  const isDelivery = orderDeliveryFlag(order);
  const mapProgressKey = `healup_tracking_car_km_${order.id}_${statusLower}_${isDelivery ? "delivery" : "pickup"}`;

  return (
    <div className="patient-order-tracking-wrap min-h-screen bg-slate-50 px-4 py-6 font-sans rtl" dir="rtl">
      <div className="mx-auto max-w-6xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col justify-between gap-4 md:flex-row md:items-center"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-900">تتبع الطلب</h1>
            <p className="mt-1 text-slate-500">
              رقم الطلب: <span className="font-mono font-bold text-slate-800">#{order.id}</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/patient-home"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <Home className="h-4 w-4" />
              العودة للرئيسية
            </Link>
            <div className="flex items-center gap-3 rounded-2xl border border-[#1a56db]/20 bg-[#e8effc] px-4 py-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1a56db] text-white">
                <Clock className="h-5 w-5" />
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-[#1a56db]">الوقت المتوقع</p>
                <p className="text-lg font-black text-slate-900">{etaLabel}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {rejected ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-center text-sm font-bold text-red-800">
            تم رفض هذا الطلب من الصيدلية.
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 }}
            className="space-y-6 lg:col-span-8"
          >
            <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="mb-2 text-lg font-bold text-slate-900">حالة الطلب</h2>
              {trackingUi?.createdAt && Number.isFinite(trackingUi.createdAt.getTime()) ? (
                <p className="mb-6 text-xs text-slate-400">
                  تاريخ إنشاء الطلب:{" "}
                  {trackingUi.createdAt.toLocaleString("ar-EG", { dateStyle: "medium", timeStyle: "short" })}
                </p>
              ) : (
                <div className="mb-6" />
              )}
              <div className="relative space-y-8 pr-2">
                <div className="absolute right-[22px] top-3 bottom-3 w-0.5 bg-slate-100" aria-hidden />
                {(trackingUi?.steps ?? []).map((step) => {
                  const active = !rejected && (step.done || step.current);
                  const showCheck = !rejected && step.done;
                  const showActiveRing = !rejected && step.current && !step.done;
                  return (
                    <div key={step.key} className="relative flex items-start gap-4">
                      <div
                        className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-4 border-white shadow ${
                          showCheck
                            ? "bg-[#00B87E] text-white"
                            : showActiveRing
                              ? "bg-[#1a56db] text-white"
                              : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {showCheck ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                      </div>
                      <div className="min-w-0 flex-1 pt-0.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className={`font-bold ${active ? "text-slate-900" : "text-slate-400"}`}>{step.title}</h3>
                          {step.current ? (
                            <span className="rounded-full bg-[#1a56db]/10 px-2 py-0.5 text-[10px] font-extrabold text-[#1a56db]">
                              جاري الآن
                            </span>
                          ) : null}
                        </div>
                        <p className={`text-sm ${active ? "text-slate-500" : "text-slate-400"}`}>{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {showCourierMap && isDelivery ? (
              <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 bg-white/95 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                    <h2 className="font-bold text-slate-900">موقع المندوب</h2>
                  </div>
                </div>
                <PatientCourierRouteMap
                  pharmacy={pharmacyCoords!}
                  patient={patientCoords!}
                  delivery={isDelivery}
                  lockCarAtDestination={orderCompleted}
                  progressStorageKey={mapProgressKey}
                />
              </section>
            ) : showCourierMap && !isDelivery ? (
              <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-4 py-3">
                  <h2 className="font-bold text-slate-900">المسار إلى الصيدلية</h2>
                </div>
                <PatientCourierRouteMap
                  pharmacy={pharmacyCoords!}
                  patient={patientCoords!}
                  delivery={false}
                  lockCarAtDestination={orderCompleted}
                  progressStorageKey={mapProgressKey}
                />
              </section>
            ) : (
              <section className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
                {trackingUi?.step3Unlocked
                  ? "الخريطة تتطلب موقع الصيدلية وموقعك (إحداثيات) في الملف الشخصي."
                  : "ستظهر الخريطة ومندوب التوصيل عندما يؤكد الصيدلي خروج الطلب للتوصيل."}
              </section>
            )}
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6 lg:col-span-4"
          >
            <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-bold text-slate-900">تفاصيل التوصيل</h2>
              <div className="space-y-5">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-50">
                    <MapPin className="h-5 w-5 text-slate-400" />
                  </div>
                  <div className="min-w-0 text-right">
                    <p className="mb-1 text-xs text-slate-400">عنوان {isDelivery ? "التوصيل" : "الاستلام"}</p>
                    <p className="whitespace-pre-wrap break-words font-medium leading-relaxed text-slate-900">
                      {deliveryAddressText}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">كما أدخلته عند تأكيد الطلب</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-50">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <div className="min-w-0 text-right">
                    <p className="mb-1 text-xs text-slate-400">المستلم</p>
                    <p className="font-medium text-slate-900">{patientName}</p>
                    <p className="text-left text-sm text-slate-600" dir="ltr">
                      {phoneDisplay}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <Store className="h-5 w-5" />
                </div>
                <div className="text-right">
                  <h2 className="font-bold text-slate-900">{ph?.name || "الصيدلية"}</h2>
                  {branch ? <p className="text-xs text-slate-500">{branch}</p> : null}
                </div>
              </div>

              <div className="space-y-4">
                {(order.items ?? []).length === 0 ? (
                  <p className="text-center text-sm text-slate-500">لا توجد أصناف مسجّلة لهذا الطلب.</p>
                ) : (
                  (order.items ?? []).map((item) => (
                    <div key={item.id} className="flex items-start gap-3 border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-[#1a56db]">
                        <Pill className="h-7 w-7" />
                      </div>
                      <div className="min-w-0 flex-1 text-right">
                        <p className="font-bold text-slate-900">{item.medicine_name}</p>
                        <p className="text-sm text-slate-500">الكمية: {item.quantity}</p>
                      </div>
                      <p className="shrink-0 font-bold text-slate-900">{formatMoney(Number(item.price) * item.quantity)}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">المجموع الفرعي</span>
                  <span className="font-medium text-slate-800">{formatMoney(pricing.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">{isDelivery ? "رسوم التوصيل" : "التوصيل"}</span>
                  <span className="font-medium text-slate-800">
                    {isDelivery ? formatMoney(pricing.deliveryDisplay) : "—"}
                  </span>
                </div>
                {pricing.discountDisplay > 0 ? (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">الخصم{order.coupon_code ? ` (${order.coupon_code})` : ""}</span>
                    <span className="font-medium text-emerald-700">-{formatMoney(pricing.discountDisplay)}</span>
                  </div>
                ) : null}
                {pricing.subtotal > 0 ? (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">ضريبة القيمة المضافة (15%)</span>
                    <span className="font-medium text-slate-800">{formatMoney(pricing.vatDisplay)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between border-t border-slate-100 pt-2">
                  <span className="text-lg font-black text-[#1a56db]">الإجمالي</span>
                  <span className="text-xl font-black text-[#1a56db]">{formatMoney(pricing.grandDisplay)}</span>
                </div>
              </div>

              {order.payment_method ? (
                <div className="mt-4 rounded-xl bg-slate-50 px-3 py-2 text-center text-xs text-slate-600">
                  طريقة الدفع: <span className="font-bold text-slate-900">{order.payment_method}</span>
                </div>
              ) : null}
            </section>

            <div className="flex flex-col gap-2">
              <Link
                href="/patient-home"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                <Home className="h-4 w-4" />
                العودة للرئيسية
              </Link>
              <Link
                href={`/patient-order-confirmation?orderId=${order.id}`}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#1a56db]/30 bg-[#f0f6ff] py-3 text-sm font-bold text-[#1a56db] hover:bg-[#e4edfc]"
              >
                <Package className="h-4 w-4" />
                ملخص تأكيد الطلب
              </Link>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}
