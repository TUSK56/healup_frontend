/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Bell, User, Phone, Mail, Share2, PlusSquare, CheckCircle2, XCircle, Clock, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { requestService, Request } from '../../../src/services/requestService';
import { orderService } from '../../../src/services/orderService';

interface OrderCardView {
  id: string;
  number: string;
  status: 'processing' | 'delivered' | 'cancelled';
  statusLabel: string;
  orderId: number | null;
  date: string;
  pharmacy: string;
  price: string;
  /** When true, list price is cart estimate until pharmacy confirms line prices */
  priceIsEstimate: boolean;
  contents: string;
  hasOffers: boolean;
  latestOfferResponseId: number | null;
}

const parseServerDate = (value: string) => {
  const v = (value || '').trim();
  if (!v) return new Date(0);
  // Backend returns DateTime which may serialize without timezone; treat as UTC to avoid +2h drift.
  if (/[zZ]$/.test(v) || /[+-]\d\d:\d\d$/.test(v)) return new Date(v);
  return new Date(`${v}Z`);
};

const toRelativeArabic = (value: string) => {
  const created = parseServerDate(value).getTime();
  const diffMs = Math.max(0, Date.now() - created);
  const sec = Math.floor(diffMs / 1000);
  if (sec < 60) return 'الآن';
  const minutes = Math.floor(sec / 60);
  if (minutes < 60) return minutes === 1 ? 'منذ دقيقة' : `منذ ${minutes} دقيقة`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours === 1 ? 'منذ ساعة' : `منذ ${hours} ساعة`;
  const days = Math.floor(hours / 24);
  return days === 1 ? 'منذ يوم' : `منذ ${days} يوم`;
};

export default function App() {
  const [activeTab, setActiveTab] = useState('الكل');
  const [requests, setRequests] = useState<Request[]>([]);
  const [orderByRequest, setOrderByRequest] = useState<Record<number, { id: number; status: string; created_at: string }>>({});
  const [loading, setLoading] = useState(true);

  const tabs = ['الكل', 'قيد التنفيذ', 'المكتملة', 'الملغاة'];

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [reqRes, orderRes] = await Promise.all([requestService.list(), orderService.list().catch(() => ({ data: [] }))]);
        setRequests(reqRes.data || []);

        const byRequest: Record<number, { id: number; status: string; created_at: string }> = {};
        for (const order of orderRes.data || []) {
          if (!Number.isFinite(order.request_id)) continue;
          const existing = byRequest[order.request_id];
          if (!existing) {
            byRequest[order.request_id] = {
              id: order.id,
              status: order.status,
              created_at: order.created_at,
            };
            continue;
          }
          const existingTs = parseServerDate(existing.created_at).getTime();
          const nextTs = parseServerDate(order.created_at).getTime();
          if (nextTs >= existingTs) {
            byRequest[order.request_id] = {
              id: order.id,
              status: order.status,
              created_at: order.created_at,
            };
          }
        }
        setOrderByRequest(byRequest);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const orders = useMemo<OrderCardView[]>(() => {
    return requests.map((request) => {
      const linkedOrder = orderByRequest[request.id];
      const linkedStatus = (linkedOrder?.status || '').toLowerCase();
      const hasLinkedOrder = Boolean(linkedOrder?.id);
      const isCompletedOrder = linkedStatus === 'completed';

      const status: OrderCardView['status'] =
        request.status === 'cancelled' ? 'cancelled' : isCompletedOrder ? 'delivered' : 'processing';

      const statusLabel =
        request.status === 'cancelled'
          ? 'ملغي'
          : isCompletedOrder
          ? 'تم التسليم'
          : hasLinkedOrder
          ? 'قيد التنفيذ'
          : request.status === 'active'
          ? 'بانتظار رد من الصيدليه'
          : 'قيد التنفيذ';

      const fromOffer =
        Boolean(request.uses_latest_offer_pricing) &&
        typeof request.latest_offer_grand_total === 'number' &&
        Number.isFinite(request.latest_offer_grand_total);
      const priceNum = fromOffer ? request.latest_offer_grand_total! : request.estimated_total;
      const pharmacyName =
        (request.latest_pharmacy_name && String(request.latest_pharmacy_name).trim()) ||
        'بانتظار اختيار الصيدلية';

      return {
        id: String(request.id),
        number: String(request.id),
        status,
        statusLabel,
        orderId: linkedOrder?.id ?? null,
        date: toRelativeArabic(request.created_at),
        pharmacy: pharmacyName,
        price: typeof priceNum === 'number' && Number.isFinite(priceNum) ? `${priceNum.toFixed(2)}` : '--',
        priceIsEstimate: !fromOffer,
        contents:
          request.medicines && request.medicines.length > 0
            ? request.medicines.map((m) => `${m.medicine_name} × ${m.quantity}`).join('، ')
            : request.prescription_url
            ? 'طلب بوصفة طبية'
            : 'طلب جديد',
        hasOffers: Boolean(request.has_offers),
        latestOfferResponseId: typeof request.latest_offer_response_id === 'number' ? request.latest_offer_response_id : null,
      };
    });
  }, [requests, orderByRequest]);

  const filteredOrders = useMemo(() => {
    if (activeTab === 'الكل') return orders;
    if (activeTab === 'قيد التنفيذ') return orders.filter((o) => o.status === 'processing');
    if (activeTab === 'المكتملة') return orders.filter((o) => o.status === 'delivered');
    if (activeTab === 'الملغاة') return orders.filter((o) => o.status === 'cancelled');
    return orders;
  }, [activeTab, orders]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-900" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="px-4 md:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Right side: Logo + Navigation */}
            <div className="flex items-center gap-16">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-[#002B5B] tracking-tight">Healup</span>
                <div className="w-10 h-10 bg-[#0052CC] rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-100">
                  <PlusSquare size={24} />
                </div>
              </div>

              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-8">
                <Link href="/patient-home" className="text-gray-400 hover:text-[#0052CC] font-bold transition-colors">الرئيسية</Link>
                <Link href="/patient-review-orders" className="text-[#0052CC] font-extrabold relative py-2">
                  طلباتي
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#0052CC] rounded-full"></span>
                </Link>
                <Link href="/patient-profile" className="text-gray-400 hover:text-[#0052CC] font-bold transition-colors">الملف الشخصي</Link>
              </nav>
            </div>

            {/* Left side: User Actions */}
            <div className="flex items-center gap-5">
              <button className="p-2.5 text-gray-400 hover:text-[#0052CC] hover:bg-blue-50 rounded-full transition-all">
                <Bell size={22} />
              </button>
              <div className="w-11 h-11 bg-orange-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm cursor-pointer hover:scale-105 transition-transform">
                <User size={26} className="text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 md:px-8 pt-4 pb-16">
        <div className="text-start mb-12 pr-48">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black text-[#002B5B] mb-3"
          >
            طلباتي
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg font-medium"
          >
            تتبع وإدارة جميع طلبات الأدوية الخاصة بك
          </motion.p>
        </div>

        {/* Tabs */}
        <div className="flex justify-start mb-12 pr-48 gap-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-base font-bold transition-all duration-300 relative ${
                activeTab === tab
                  ? 'text-[#0052CC]'
                  : 'text-gray-400 hover:text-[#0052CC]'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.span 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0052CC] rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-8 max-w-6xl mx-auto">
          {loading ? (
            <div className="bg-white rounded-[1.5rem] p-8 shadow-sm border border-gray-100 text-center text-gray-500">
              جاري تحميل الطلبات...
            </div>
          ) : null}

          {!loading && filteredOrders.length === 0 ? (
            <div className="bg-white rounded-[1.5rem] p-8 shadow-sm border border-gray-100 text-center text-gray-500">
              لا توجد طلبات حالياً.
            </div>
          ) : null}

          {filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-[1.5rem] p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 relative overflow-hidden group"
            >
              {/* Status Badge */}
              <div className="absolute top-8 left-8">
                <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold ${
                  order.status === 'processing' ? 'bg-blue-50 text-[#0052CC]' :
                  order.status === 'delivered' ? 'bg-green-50 text-green-600' :
                  'bg-red-50 text-red-600'
                }`}>
                  {order.statusLabel}
                </span>
              </div>

              <div className="flex flex-row gap-10 items-start">
                {/* Order Icon (Right Side) */}
                <div className="w-24 h-24 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0 text-[#0052CC]">
                  <div className="relative">
                    <PlusSquare size={32} strokeWidth={2.5} />
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-md p-0.5">
                      <div className="w-4 h-4 bg-[#0052CC] rounded-sm" />
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="flex-1 space-y-6 text-right">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-300">رقم الطلب</p>
                    <h3 className="text-2xl font-black text-gray-900">#{order.number}</h3>
                  </div>

                  <div className="flex flex-row items-center justify-between text-sm font-bold border-b border-gray-50 pb-6">
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin size={16} />
                      <span>{order.pharmacy}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock size={16} />
                      <span>{order.date}</span>
                    </div>
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="text-lg font-black text-gray-900">{order.price}</span>
                      <span className="text-xs text-gray-400">ج.م</span>
                      {order.price !== '--' && order.priceIsEstimate ? (
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-extrabold text-amber-800">
                          تقديري
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <p className="text-sm text-gray-400">
                    <span className="font-extrabold text-gray-600">المحتويات:</span> {order.contents}
                  </p>

                  {/* Actions */}
                  <div className="flex flex-row gap-3 pt-2">
                    <Link href={`/patient-review-order-history?requestId=${encodeURIComponent(order.id)}`} className="px-10 bg-white border border-gray-200 text-gray-600 py-3 rounded-xl font-black text-sm hover:bg-gray-50 transition-all inline-flex items-center justify-center">
                      تفاصيل الطلب
                    </Link>
                    {!order.orderId && order.hasOffers && order.latestOfferResponseId ? (
                      <Link
                        href={`/patient_after_pharmacy_confirmation.html?requestId=${encodeURIComponent(order.id)}&responseId=${encodeURIComponent(String(order.latestOfferResponseId))}`}
                        className="px-10 bg-[#0052CC] border border-[#0052CC] text-white py-3 rounded-xl font-black text-sm hover:opacity-90 transition-all inline-flex items-center justify-center"
                      >
                        تأكيد الطلب
                      </Link>
                    ) : null}
                    {order.orderId && order.status !== 'delivered' ? (
                      <Link
                        href={`/patient-order-tracking?orderId=${encodeURIComponent(String(order.orderId))}`}
                        className="px-10 bg-[#0052CC] border border-[#0052CC] text-white py-3 rounded-xl font-black text-sm hover:opacity-90 transition-all inline-flex items-center justify-center"
                      >
                        تتبع الطلب
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-24 pb-12 mt-32">
        <div className="px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-16 mb-20">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 bg-[#1A56DB] rounded-lg flex items-center justify-center text-white">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                    <path d="M20 8h-4V6a2 2 0 00-2-2h-4a2 2 0 00-2 2v2H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V10a2 2 0 00-2-2z" />
                    <path d="M12 8v8M8 12h8" />
                  </svg>
                </div>
                <span className="text-[20px] font-extrabold text-[#1A56DB] leading-none">Healup</span>
              </div>
              <p className="text-gray-400 text-base leading-relaxed font-medium">
                منصة الرعاية الصحية المتكاملة لتلبية جميع احتياجاتك الدوائية والطبية. نسعى لتوفير أفضل تجربة رعاية صحية في متناول يدك.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-black text-[#002B5B] text-lg mb-8">روابط سريعة</h4>
              <ul className="space-y-5 text-base text-gray-400 font-bold">
                <li><a href="#" className="hover:text-[#0052CC] transition-colors">عن Healup</a></li>
                <li><a href="#" className="hover:text-[#0052CC] transition-colors">خدماتنا</a></li>
                <li><a href="#" className="hover:text-[#0052CC] transition-colors">الأسئلة الشائعة</a></li>
                <li><a href="#" className="hover:text-[#0052CC] transition-colors">اتصل بنا</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-black text-[#002B5B] text-lg mb-8">قانوني</h4>
              <ul className="space-y-5 text-base text-gray-400 font-bold">
                <li><a href="#" className="hover:text-[#0052CC] transition-colors">سياسة الخصوصية</a></li>
                <li><a href="#" className="hover:text-[#0052CC] transition-colors">شروط الاستخدام</a></li>
                <li><a href="#" className="hover:text-[#0052CC] transition-colors">سياسة الإرجاع</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-black text-[#002B5B] text-lg mb-8">تواصل معنا</h4>
              <div className="flex gap-5 mb-8">
                <a href="#" className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-[#0052CC] hover:bg-blue-50 transition-all shadow-sm">
                  <Share2 size={20} />
                </a>
                <a href="#" className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-[#0052CC] hover:bg-blue-50 transition-all shadow-sm">
                  <Mail size={20} />
                </a>
                <a href="#" className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-[#0052CC] hover:bg-blue-50 transition-all shadow-sm">
                  <Phone size={20} />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-10 text-center text-base text-gray-300 font-bold">
            <p>© Healup 2024. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
