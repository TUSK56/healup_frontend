/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Bell,
  ChevronLeft,
  CreditCard,
  Download,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  RefreshCcw,
  Search,
  ShoppingCart,
  User,
  Pill,
  Stethoscope,
  ShieldCheck,
  Truck,
  Store,
} from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { requestService, Offer, Request } from '../../../src/services/requestService';
import api from '../../../src/services/apiService';
import { getDrugPrice } from '../../../src/lib/drugs';

const PatientPharmacyMap = dynamic(() => import('../../../src/components/patient/views/PatientPharmacyMap'), { ssr: false });

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

export default function App() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const requestId = useMemo(() => {
    const raw = searchParams.get('requestId') || searchParams.get('id') || '';
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }, [searchParams]);
  const responseId = useMemo(() => {
    const raw = searchParams.get('responseId') || searchParams.get('responseid') || '';
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }, [searchParams]);

  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState<Request | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);
  const [mapFocusToken, setMapFocusToken] = useState(0);
  const [orderSnapshot, setOrderSnapshot] = useState<{
    delivery: boolean;
    status?: string | null;
    payment_method?: string | null;
    delivery_address_snapshot?: string | null;
    coupon_code?: string | null;
    coupon_percent?: number | null;
  } | null>(null);

  const loadPageData = useMemo(() => {
    return async () => {
      if (!requestId) {
        setRequest(null);
        setOffers([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await requestService.getOffers(requestId);
        setRequest(res.request || null);
        setOffers(res.offers || []);
        try {
          const ordRes = await api.get<{
            data: Array<{
              request_id: number;
              delivery: boolean;
              status?: string | null;
              payment_method?: string | null;
              delivery_address_snapshot?: string | null;
              coupon_code?: string | null;
              coupon_percent?: number | null;
            }>;
          }>('/orders');
          const row = (ordRes.data?.data || []).find((o) => Number(o.request_id) === Number(requestId));
          setOrderSnapshot(
            row
              ? {
                  delivery: Boolean(row.delivery),
                  status: row.status,
                  payment_method: row.payment_method,
                  delivery_address_snapshot: row.delivery_address_snapshot,
                  coupon_code: row.coupon_code,
                  coupon_percent: row.coupon_percent,
                }
              : null,
          );
        } catch {
          setOrderSnapshot(null);
        }
      } finally {
        setLoading(false);
      }
    };
  }, [requestId]);

  useEffect(() => {
    void loadPageData();
  }, [loadPageData]);

  useEffect(() => {
    if (!requestId) return;
    const intervalId = window.setInterval(() => {
      void loadPageData();
    }, 4000);
    return () => window.clearInterval(intervalId);
  }, [requestId, loadPageData]);

  const selectedOffer = useMemo(() => {
    if (!offers || offers.length === 0) return null;
    const preferredId = responseId || request?.latest_offer_response_id || null;
    if (preferredId) {
      const exact = offers.find((x) => Number(x?.response?.id) === Number(preferredId));
      if (exact) return exact;
    }
    return offers[0] || null;
  }, [offers, responseId, request?.latest_offer_response_id]);
  const pharmacy = selectedOffer?.response?.pharmacy || null;
  const pharmacyLat = typeof pharmacy?.latitude === 'number' ? pharmacy.latitude : null;
  const pharmacyLng = typeof pharmacy?.longitude === 'number' ? pharmacy.longitude : null;

  const computedSubtotal = useMemo(() => {
    if (!request?.medicines || request.medicines.length === 0) return null;
    if (!selectedOffer?.response?.response_medicines) return null;

    const priceMap = new Map<string, number>();
    selectedOffer.response.response_medicines.forEach((m) => {
      if (m?.medicine_name) priceMap.set(m.medicine_name.trim().toLowerCase(), Number(m.price || 0));
    });

    let sum = 0;
    request.medicines.forEach((m) => {
      const key = (m.medicine_name || '').trim().toLowerCase();
      const unit = priceMap.get(key);
      if (typeof unit === 'number') sum += unit * (m.quantity || 0);
    });
    return sum;
  }, [request?.medicines, selectedOffer?.response?.response_medicines]);

  /** Medicine lines only (same basis as VAT); never use estimated_total here — that value is the full cart total. */
  const estimatedMedicineSubtotal = useMemo(() => {
    if (!request?.medicines?.length) return null;
    let sum = 0;
    for (const m of request.medicines) {
      const p = getDrugPrice(m.medicine_name || '');
      if (typeof p !== 'number') return null;
      sum += p * Number(m.quantity || 0);
    }
    return sum;
  }, [request?.medicines]);

  const hasRealPharmacyPricing = Boolean(
    selectedOffer?.response?.response_medicines?.some((m) => m.available && Number(m.price) > 0),
  );

  const medicineSubtotal = useMemo(() => {
    if (hasRealPharmacyPricing && typeof computedSubtotal === 'number') return computedSubtotal;
    if (typeof estimatedMedicineSubtotal === 'number') return estimatedMedicineSubtotal;
    return null;
  }, [hasRealPharmacyPricing, computedSubtotal, estimatedMedicineSubtotal]);

  const totalDrugQty = useMemo(() => {
    return (request?.medicines || []).reduce((sum, m) => sum + Number(m.quantity || 0), 0);
  }, [request?.medicines]);

  const couponPercent = useMemo(() => {
    const raw = Number(orderSnapshot?.coupon_percent || 0);
    if (!Number.isFinite(raw)) return 0;
    return Math.max(0, Math.min(100, raw));
  }, [orderSnapshot?.coupon_percent]);

  const discount = useMemo(() => {
    if (typeof medicineSubtotal !== 'number' || couponPercent <= 0) return 0;
    return medicineSubtotal * (couponPercent / 100);
  }, [medicineSubtotal, couponPercent]);

  const subtotalAfterDiscount = useMemo(() => {
    if (typeof medicineSubtotal !== 'number') return null;
    return Math.max(0, medicineSubtotal - discount);
  }, [medicineSubtotal, discount]);

  /** Same rule as cart / order create: pickup has no fee; home delivery 25 if &lt; 5 units else 0. Ignore pharmacy offer delivery_fee. */
  const deliveryFee = useMemo(() => {
    if (orderSnapshot?.delivery === false) return 0;
    return totalDrugQty >= 5 ? 0 : 25;
  }, [orderSnapshot?.delivery, totalDrugQty]);

  /** VAT on medicines subtotal only (matches checkout / patient_after_pharmacy_confirmation). */
  const tax = useMemo(() => {
    if (typeof subtotalAfterDiscount !== 'number') return null;
    return subtotalAfterDiscount * 0.15;
  }, [subtotalAfterDiscount]);

  const grandTotal = useMemo(() => {
    if (typeof subtotalAfterDiscount !== 'number' || typeof tax !== 'number') return null;
    return subtotalAfterDiscount + deliveryFee + tax;
  }, [subtotalAfterDiscount, tax, deliveryFee]);

  const parseServerDate = (value: string) => {
    const v = (value || '').trim();
    if (!v) return new Date(0);
    if (/[zZ]$/.test(v) || /[+-]\d\d:\d\d$/.test(v)) return new Date(v);
    return new Date(`${v}Z`);
  };

  const orderHeaderTitle = requestId ? `طلب رقم #HLP-${requestId}` : 'تفاصيل الطلب';
  const orderHeaderDate = request?.created_at
    ? parseServerDate(request.created_at).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' })
    : '';

  const orderStatus = (orderSnapshot?.status || '').trim().toLowerCase();
  const hasTrackedOrder = Boolean(orderSnapshot && orderStatus);
  const isOrderCompleted = orderStatus === 'completed';
  const statusStage = (() => {
    if (!hasTrackedOrder) return 0;
    if (orderStatus === 'completed') return 4;
    if (orderStatus === 'out_for_delivery') return 3;
    if (orderStatus === 'preparing') return 2;
    if (orderStatus === 'pending_pharmacy_confirmation') return 1;
    if (orderStatus === 'confirmed') return 1;
    return 0;
  })();
  const statusPercent = statusStage * 25;
  const statusBadgeText =
    !hasTrackedOrder
      ? 'لا يوجد طلب مؤكد'
      : orderStatus === 'completed'
      ? 'تم التسليم'
      : orderStatus === 'out_for_delivery'
        ? 'خرج للتوصيل'
        : orderStatus === 'preparing'
          ? 'قيد التحضير'
          : orderStatus === 'pending_pharmacy_confirmation'
            ? 'تم التأكيد'
          : orderStatus === 'confirmed'
            ? 'تم التأكيد'
            : 'بانتظار التأكيد';

  const onConfirmOrder = () => {
    if (!selectedOffer?.response?.id || !requestId) return;
    router.push(`/patient_after_pharmacy_confirmation.html?requestId=${encodeURIComponent(String(requestId))}&responseId=${encodeURIComponent(String(selectedOffer.response.id))}`);
  };

  const onReorder = async () => {
    if (!request) return;
    setActionBusy(true);
    try {
      const medicines = (request.medicines || []).map((m) => ({
        medicine_name: m.medicine_name,
        quantity: m.quantity,
      }));
      await requestService.create(
        {
          medicines,
          prescription_url: request.prescription_url || undefined,
          estimated_total: typeof request.estimated_total === 'number' ? request.estimated_total : undefined,
        },
        undefined,
      );
      router.push('/patient-review-orders');
    } finally {
      setActionBusy(false);
    }
  };

  const onDownloadInvoice = () => {
    if (!requestId) return;
    (async () => {
      setActionBusy(true);
      try {
        const blob = await requestService.downloadInvoice(requestId);
        if (!blob || blob.size === 0) throw new Error('empty_invoice');
        const mime = (blob.type || '').toLowerCase();
        if (mime.includes('application/json')) {
          const maybeJsonText = await blob.text();
          throw new Error(maybeJsonText || 'invoice_not_ready');
        }
        const pdfBlob = mime.includes('application/pdf') ? blob : new Blob([blob], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = URL.createObjectURL(pdfBlob);
        a.download = `healup-receipt-request-${requestId}.pdf`;
        a.target = '_self';
        a.rel = 'noopener';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        window.setTimeout(() => {
          URL.revokeObjectURL(a.href);
          URL.revokeObjectURL(url);
          a.remove();
        }, 200);
      } catch {
        alert('تعذر تحميل الفاتورة حالياً. حاول مرة أخرى بعد قليل.');
      } finally {
        setActionBusy(false);
      }
    })();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans" dir="rtl">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="flex h-16 w-full items-center px-4 sm:px-6 lg:px-8">
          {/* Logo Section (Right in RTL) */}
          <div className="flex flex-1 justify-start">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
                <Stethoscope size={24} />
              </div>
              <span className="text-2xl font-bold tracking-tight text-primary">Healup</span>
            </div>
          </div>

          {/* Navigation Section (Center) */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/patient-home" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">الرئيسية</Link>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">الأدوية</a>
            <Link href="/patient-review-orders" className="text-sm font-medium text-primary border-b-2 border-primary pb-1">طلباتي</Link>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">الصيدليات</a>
          </nav>

          {/* Icons Section (Left in RTL) */}
          <div className="flex flex-1 justify-end">
            <div className="flex items-center gap-3">
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                <Bell size={20} />
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                <ShoppingCart size={20} />
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                <User size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Order Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{orderHeaderTitle}</h1>
            <p className="mt-1 text-slate-500">{orderHeaderDate ? `تم الطلب في ${orderHeaderDate}` : (loading ? 'جاري تحميل بيانات الطلب...' : '')}</p>
          </div>
          <div className="flex items-center gap-3">
            <button disabled={actionBusy} onClick={onDownloadInvoice} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed">
              <Download size={18} />
              تحميل الفاتورة
            </button>
            {isOrderCompleted ? (
              <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700">
                <ShieldCheck size={18} />
                تم التسليم
              </span>
            ) : selectedOffer ? (
              <button disabled={actionBusy} onClick={onConfirmOrder} className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed">
                <ShieldCheck size={18} />
                تأكيد الطلب
              </button>
            ) : (
              <button disabled={actionBusy} onClick={onReorder} className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed">
                <RefreshCcw size={18} />
                إعادة الطلب
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <motion.div 
            className="lg:col-span-2 space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Order Status */}
            <motion.section variants={itemVariants} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">حالة الطلب</h2>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${!hasTrackedOrder ? 'bg-slate-100 text-slate-600' : isOrderCompleted ? 'bg-success/10 text-success' : 'bg-blue-50 text-[#1a56db]'}`}>
                  <div className={`h-1.5 w-1.5 rounded-full ${!hasTrackedOrder ? 'bg-slate-500' : isOrderCompleted ? 'bg-success animate-pulse' : 'bg-[#1a56db] animate-pulse'}`} />
                  {statusBadgeText}
                </span>
              </div>
              
              <div className="relative flex items-center justify-between px-4">
                {/* Progress Line */}
                <div className="absolute left-12 right-12 top-5 h-1 bg-slate-100">
                  <div className="h-full bg-primary transition-all duration-500" style={{ width: `${statusPercent}%` }} />
                </div>
                
                {[
                  { label: 'تم التأكيد', step: 1 },
                  { label: 'قيد التحضير', step: 2 },
                  { label: 'خرج للتوصيل', step: 3 },
                  { label: 'تم التسليم', step: 4 },
                ].map((item) => (
                  <div key={item.step} className="relative flex flex-col items-center gap-3">
                    <div className={`z-10 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white shadow-sm transition-colors ${item.step <= statusStage ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                      {item.step === 4 && statusStage >= 4 ? <ShieldCheck size={20} /> : <span className="text-sm font-bold">{item.step}</span>}
                    </div>
                    <span className={`text-xs font-bold ${item.step <= statusStage ? 'text-slate-900' : 'text-slate-400'}`}>{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Medicines List */}
            <motion.section variants={itemVariants} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-lg font-bold text-slate-900">الأدوية المطلوبة</h2>
              <div className="space-y-4">
                {request?.medicines && request.medicines.length > 0 ? request.medicines.map((m, idx) => {
                  const unitPrice =
                    selectedOffer?.response?.response_medicines?.find((x) => (x.medicine_name || '').trim().toLowerCase() === (m.medicine_name || '').trim().toLowerCase())
                      ?.price ?? null;
                  const fallbackUnit = unitPrice === null || unitPrice === undefined ? getDrugPrice(m.medicine_name || '') : null;
                  const effectiveUnit = typeof unitPrice === 'number' ? unitPrice : (typeof fallbackUnit === 'number' ? fallbackUnit : null);
                  const isEstimateUnit = typeof unitPrice !== 'number';
                  const lineTotal = typeof effectiveUnit === 'number' ? effectiveUnit * (m.quantity || 0) : null;
                  return (
                  <div key={m.id ?? idx} className="flex items-center justify-between rounded-2xl border border-slate-50 bg-slate-50/30 p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
                        <Pill size={28} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{m.medicine_name}</h3>
                        <p className="text-sm text-slate-500">
                          {typeof effectiveUnit === 'number'
                            ? `سعر الوحدة: ${effectiveUnit.toFixed(2)} ج.م${isEstimateUnit ? ' (تقديري من دليل الأسعار)' : ''}`
                            : 'بانتظار تحديد السعر من الصيدلية'}
                        </p>
                        <p className="mt-1 text-xs font-medium text-slate-400">الكمية: {m.quantity}</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <span className="text-lg font-bold text-slate-900">
                        {typeof lineTotal === 'number' ? `${lineTotal.toFixed(2)} ج.م` : '—'}
                      </span>
                    </div>
                  </div>
                )}) : (
                  <div className="rounded-2xl border border-slate-50 bg-slate-50/30 p-4 text-slate-500">
                    {request?.prescription_url ? 'طلب بوصفة طبية (سيتم تحديد الأدوية بعد مراجعة الصيدلية).' : (loading ? 'جاري تحميل الأدوية...' : 'لا توجد أدوية في هذا الطلب.')}
                  </div>
                )}
              </div>
            </motion.section>

            {/* Pharmacy Info */}
            <motion.section variants={itemVariants} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-lg font-bold text-slate-900 text-right">معلومات الصيدلية</h2>
              <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                {/* Info on the right (first child in RTL) */}
                <div className="flex flex-col items-end text-right">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-primary">
                      <Store size={32} />
                    </div>
                    <div className="flex flex-col items-end">
                      <h3 className="text-xl font-bold text-slate-900">{pharmacy?.name || 'بانتظار عرض من الصيدلية'}</h3>
                      <p className="text-slate-500">
                        {pharmacy?.city || pharmacy?.district
                          ? `${pharmacy?.city || ''}${pharmacy?.city && pharmacy?.district ? '، ' : ''}${pharmacy?.district || ''}`
                          : 'سيتم تحديد الصيدلية بعد وصول العرض'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Action Links */}
                  <div className="mt-4 flex items-center gap-6">
                    <button onClick={() => setPhoneModalOpen(true)} className="flex items-center gap-2 font-bold text-primary hover:text-primary-hover transition-colors">
                      <span className="text-sm">اتصال بالصيدلية</span>
                      <Phone size={18} />
                    </button>
                    <button className="flex items-center gap-2 font-bold text-primary hover:text-primary-hover transition-colors">
                      <span className="text-sm">دردشة</span>
                      <MessageCircle size={18} />
                    </button>
                  </div>
                </div>

                {/* Map on the left (second child in RTL) */}
                <div className="h-36 w-full overflow-hidden rounded-2xl border border-slate-100 sm:w-80" style={{ position: 'relative' }}>
                  {typeof pharmacyLat === 'number' && typeof pharmacyLng === 'number' ? (
                    <PatientPharmacyMap latitude={pharmacyLat} longitude={pharmacyLng} focusToken={mapFocusToken} />
                  ) : (
                    <div className="h-full w-full bg-slate-50 flex items-center justify-center text-slate-400 text-sm">
                      الخريطة ستظهر بعد وصول عرض من الصيدلية
                    </div>
                  )}
                  {typeof pharmacyLat === 'number' && typeof pharmacyLng === 'number' ? (
                    <div
                      style={{
                        position: 'absolute',
                        left: 10,
                        bottom: 10,
                        zIndex: 1200,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8
                      }}
                    >
                      <a
                        href={`https://www.google.com/maps?q=${encodeURIComponent(String(pharmacyLat))},${encodeURIComponent(String(pharmacyLng))}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: 10,
                          padding: '7px 12px',
                          fontSize: 12,
                          fontWeight: 800,
                          color: '#0f172a',
                          boxShadow: '0 6px 18px rgba(2,6,23,0.12)',
                          textDecoration: 'none'
                        }}
                      >
                        Google Maps
                      </a>
                      <button
                        type="button"
                        onClick={() => setMapFocusToken((v) => v + 1)}
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 10,
                          border: '1px solid #e2e8f0',
                          background: '#ffffff',
                          color: '#0f172a',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 6px 18px rgba(2,6,23,0.12)',
                          cursor: 'pointer'
                        }}
                        title="إعادة تمركز الخريطة"
                      >
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <circle cx="12" cy="12" r="3.2"></circle>
                          <path d="M12 2.5v3.2M12 18.3v3.2M2.5 12h3.2M18.3 12h3.2"></path>
                        </svg>
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </motion.section>
          </motion.div>

          {/* Sidebar */}
          <motion.aside 
            className="space-y-6"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {/* Order Summary */}
            <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-lg font-bold text-slate-900">ملخص الطلب</h2>
              {!hasRealPharmacyPricing ? (
                <p className="mb-3 rounded-xl bg-amber-50 px-3 py-2 text-xs font-bold text-amber-900">
                  المجاميع أدناه تقديرية من سلة الطلب حتى تضع الصيدلية الأسعار الفعلية للأدوية.
                </p>
              ) : null}
              <div className="space-y-4">
                <div className="flex justify-between text-slate-600">
                  <span>المجموع الفرعي</span>
                  <span className="font-medium">
                    {typeof medicineSubtotal === 'number' ? `${medicineSubtotal.toFixed(2)} ج.م` : '--'}
                    {!hasRealPharmacyPricing && typeof medicineSubtotal === 'number' ? (
                      <span className="mr-1 text-[11px] font-extrabold text-amber-700">(تقديري)</span>
                    ) : null}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>رسوم التوصيل</span>
                  <span className="font-medium">{deliveryFee.toFixed(2)} ج.م</span>
                </div>
                {discount > 0 ? (
                  <div className="flex justify-between text-slate-600">
                    <span>الخصم{orderSnapshot?.coupon_code ? ` (${orderSnapshot.coupon_code})` : ''}</span>
                    <span className="font-medium text-emerald-700">-{discount.toFixed(2)} ج.م</span>
                  </div>
                ) : null}
                <div className="flex justify-between text-slate-600">
                  <span>ضريبة القيمة المضافة (15%)</span>
                  <span className="font-medium">{typeof tax === 'number' ? `${tax.toFixed(2)} ج.م` : '--'}</span>
                </div>
                <div className="my-4 border-t border-dashed border-slate-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-slate-900">الإجمالي</span>
                    <span className="text-2xl font-black text-primary">{typeof grandTotal === 'number' ? `${grandTotal.toFixed(2)} ج.م` : '--'}</span>
                  </div>
                </div>
                {isOrderCompleted ? (
                  <div className="rounded-2xl bg-emerald-50 p-3 text-center">
                    <p className="text-sm font-bold text-emerald-700">تم التسليم</p>
                  </div>
                ) : selectedOffer ? (
                  <button
                    disabled={actionBusy}
                    onClick={onConfirmOrder}
                    className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-black text-white shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    تأكيد الطلب
                  </button>
                ) : (
                  <div className="rounded-2xl bg-primary/5 p-3 text-center">
                    <p className="text-sm font-bold text-primary">القيمة تقديرية حتى تقوم الصيدلية بتحديد السعر.</p>
                  </div>
                )}
              </div>
            </section>

            {/* Delivery & Payment */}
            <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-lg font-bold text-slate-900">التوصيل والدفع</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <Truck size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">طريقة الاستلام</h4>
                    <p className="text-sm text-slate-500">
                      {orderSnapshot
                        ? orderSnapshot.delivery
                          ? 'توصيل للمنزل'
                          : 'استلام من الصيدلية'
                        : 'يُعرض بعد تأكيد الطلب'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">عنوان التوصيل</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {orderSnapshot?.delivery_address_snapshot?.trim()
                        ? orderSnapshot.delivery_address_snapshot
                        : orderSnapshot && !orderSnapshot.delivery
                          ? 'موقع الصيدلية (استلام من الفرع)'
                          : 'يُعرض من عنوان الملف الشخصي بعد تأكيد الطلب'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">طريقة الدفع</h4>
                    <div className="mt-1 flex items-center gap-2 rounded-lg bg-slate-50 px-2 py-1">
                      <span className="text-xs font-bold text-slate-600">
                        {orderSnapshot?.payment_method?.trim() || 'يُعرض بعد تأكيد الطلب'}
                      </span>
                      <div className="flex h-4 w-6 items-center justify-center rounded bg-slate-200 text-slate-500">
                        <CreditCard size={12} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Need Help */}
            <section className="overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-xl shadow-slate-900/20">
              <h3 className="text-xl font-bold">تحتاج مساعدة؟</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">إذا كان لديك أي استفسار حول طلبك، فريق الدعم متاح على مدار الساعة.</p>
              <button className="mt-6 w-full rounded-xl bg-white py-3 text-sm font-bold text-slate-900 hover:bg-slate-100 transition-colors">
                تحدث معنا
              </button>
            </section>
          </motion.aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                  <path d="M20 8h-4V6a2 2 0 00-2-2h-4a2 2 0 00-2 2v2H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V10a2 2 0 00-2-2z" />
                  <path d="M12 8v8M8 12h8" />
                </svg>
                </div>
                <span className="text-xl font-bold text-primary">Healup</span>
              </div>
              <p className="text-sm text-slate-400">© 2023 هيل أب. جميع الحقوق محفوظة.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-slate-500">
              <a href="#" className="hover:text-primary transition-colors">الشروط والأحكام</a>
              <a href="#" className="hover:text-primary transition-colors">سياسة الخصوصية</a>
              <a href="#" className="hover:text-primary transition-colors">مركز المساعدة</a>
            </div>
          </div>
        </div>
      </footer>

      {phoneModalOpen ? (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 p-4" onClick={() => setPhoneModalOpen(false)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-lg font-bold text-slate-900">رقم الصيدلية</div>
              <button className="text-slate-500 hover:text-slate-700 text-2xl leading-none" onClick={() => setPhoneModalOpen(false)}>×</button>
            </div>
            <div className="text-slate-600">
              {pharmacy?.phone ? pharmacy.phone : 'غير متوفر حالياً'}
            </div>
            <div className="mt-4 flex gap-2">
              {pharmacy?.phone ? (
                <a href={`tel:${pharmacy.phone}`} className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-center text-sm font-bold text-white">
                  اتصال
                </a>
              ) : null}
              <button className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700" onClick={() => setPhoneModalOpen(false)}>
                إغلاق
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
