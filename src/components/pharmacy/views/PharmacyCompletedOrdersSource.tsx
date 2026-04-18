"use client";

import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ChevronDown, Eye, FileText, Loader2, MapPin, Pill, Search, User, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { orderService, type Order } from "@/services/orderService";
import { requestService } from "@/services/requestService";

type FilterTab = "الكل" | "اليوم" | "هذا الأسبوع" | "هذا الشهر";

function parseServerDate(value?: string | null): Date {
  const v = (value || "").trim();
  if (!v) return new Date(0);
  if (/[zZ]$/.test(v) || /[+-]\d\d:?\d\d$/.test(v)) return new Date(v);
  return new Date(`${v}Z`);
}

function formatArabicDateTime(value?: string | null) {
  const date = parseServerDate(value);
  if (!Number.isFinite(date.getTime())) return "—";
  return date.toLocaleString("ar-EG", { dateStyle: "medium", timeStyle: "short" });
}

function formatMoney(value: number) {
  return `${value.toFixed(2)} ج.م`;
}

function orderItemsLabel(order: Order) {
  const items = order.items || [];
  if (!items.length) return "—";
  return items.map((item) => `${item.medicine_name} × ${item.quantity}`).join("، ");
}

function isCompleted(order: Order) {
  return String(order.status || "").trim().toLowerCase() === "completed";
}

function matchesDateFilter(order: Order, filter: FilterTab) {
  if (filter === "الكل") return true;
  const created = parseServerDate(order.created_at);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - created.getTime()) / 86400000);
  if (filter === "اليوم") return diffDays === 0;
  if (filter === "هذا الأسبوع") return diffDays < 7;
  if (filter === "هذا الشهر") return diffDays < 30;
  return true;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<FilterTab>("الكل");
  const [query, setQuery] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingRequestId, setDownloadingRequestId] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const loadOrders = useMemo(() => {
    return async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await orderService.list();
        const data = Array.isArray(res.data) ? res.data : [];
        setOrders(data.filter((order) => isCompleted(order)));
      } catch {
        setError("تعذر تحميل الطلبات المكتملة حالياً.");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
  }, []);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const filteredOrders = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders
      .filter((order) => matchesDateFilter(order, activeTab))
      .filter((order) => {
        if (!q) return true;
        const haystack = [
          `#HLP-${order.id}`,
          order.patient?.name || "",
          order.pharmacy?.name || "",
          order.delivery_address_snapshot || "",
          orderItemsLabel(order),
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      })
      .sort((a, b) => parseServerDate(b.created_at).getTime() - parseServerDate(a.created_at).getTime());
  }, [activeTab, orders, query]);

  const totals = useMemo(
    () => ({
      all: orders.length,
      today: orders.filter((order) => matchesDateFilter(order, "اليوم")).length,
      week: orders.filter((order) => matchesDateFilter(order, "هذا الأسبوع")).length,
      month: orders.filter((order) => matchesDateFilter(order, "هذا الشهر")).length,
    }),
    [orders],
  );

  const onDownloadInvoice = async (order: Order) => {
    if (!order.request_id) return;
    setDownloadingRequestId(order.request_id);
    try {
      const blob = await requestService.downloadInvoice(order.request_id);
      if (!blob || blob.size === 0) throw new Error("empty_invoice");
      const mime = (blob.type || "").toLowerCase();
      if (mime.includes("application/json")) {
        const maybeJsonText = await blob.text();
        throw new Error(maybeJsonText || "invoice_not_ready");
      }

      const pdfBlob = mime.includes("application/pdf") ? blob : new Blob([blob], { type: "application/pdf" });
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `healup-receipt-request-${order.request_id}.pdf`;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      window.setTimeout(() => {
        URL.revokeObjectURL(url);
        a.remove();
      }, 250);
    } catch {
      alert("تعذر تحميل الفاتورة حالياً. حاول مرة أخرى بعد قليل.");
    } finally {
      setDownloadingRequestId(null);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg pb-12" dir="rtl">
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white px-4 py-3 shadow-sm">
        <div className="flex w-full items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xl font-bold text-brand-blue">
              <span>Healup</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-blue text-white">
                <Pill size={20} />
              </div>
            </div>
            <button className="text-sm font-medium text-brand-blue transition-opacity hover:opacity-80">
              <span>لوحة التحكم</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-800">الطلبات المكتملة</h2>
              <div className="flex items-center gap-1 text-[10px] text-slate-500">
                <MapPin size={10} />
                <span>الطلبات المنجزة فقط</span>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100">
              <User size={18} className="text-slate-500" />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto mt-8 max-w-7xl px-4">
        <h1 className="mb-6 text-2xl font-bold text-slate-900">الطلبات المكتملة</h1>

        <div className="relative mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="البحث برقم الطلب أو اسم المريض..."
            className="w-full rounded-xl border border-slate-200 bg-white px-12 py-3 text-sm shadow-sm transition-all focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        </div>

        <div className="mb-8 flex rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
          {([
            ["الكل", totals.all],
            ["اليوم", totals.today],
            ["هذا الأسبوع", totals.week],
            ["هذا الشهر", totals.month],
          ] as const).map(([tab, count]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                activeTab === tab ? "bg-brand-blue text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {tab} ({count})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 rounded-2xl border border-slate-100 bg-white py-10 text-slate-500 shadow-sm">
            <Loader2 className="animate-spin" size={18} />
            جاري تحميل الطلبات...
          </div>
        ) : null}

        {error ? (
          <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 shadow-sm">
            {error}
          </div>
        ) : null}

        {!loading && filteredOrders.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white py-10 text-center text-slate-500 shadow-sm">
            لا توجد طلبات مكتملة مطابقة للبحث أو التصفية.
          </div>
        ) : null}

        <div className="space-y-4">
          {filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-stretch gap-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-center pr-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-light-green text-brand-green shadow-inner">
                  <CheckCircle2 size={32} />
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between text-right">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-brand-blue">#HLP-{order.id}</span>
                    <span className="rounded-md bg-brand-light-green px-2 py-0.5 text-[10px] font-bold text-brand-green">المكتملة</span>
                  </div>
                  <span className="text-xs text-slate-400">{formatArabicDateTime(order.created_at)}</span>
                </div>

                <div className="mb-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 font-bold text-slate-700">
                    <User size={16} className="text-slate-400" />
                    <span>{order.patient?.name || "مريض"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Pill size={14} className="text-slate-300" />
                    <span className="max-w-[48ch] truncate">{orderItemsLabel(order)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-slate-400">الإجمالي:</span>
                    <span className="text-xl font-bold text-slate-900">{formatMoney(Number(order.total_price || 0))}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={downloadingRequestId === order.request_id}
                      onClick={() => void onDownloadInvoice(order)}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-100 bg-white px-6 py-2 text-xs font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {downloadingRequestId === order.request_id ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
                      <span>عرض الفاتورة</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="inline-flex items-center gap-2 rounded-lg bg-brand-blue px-6 py-2 text-xs font-bold text-white transition-colors hover:bg-brand-blue/90"
                    >
                      <Eye size={14} />
                      <span>التفاصيل</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <button className="group flex items-center gap-2 rounded-full border-2 border-brand-blue px-8 py-2.5 text-sm font-bold text-brand-blue transition-all hover:bg-brand-blue hover:text-white">
            <span>تحميل المزيد من الطلبات</span>
            <ChevronDown size={18} className="transition-transform group-hover:translate-y-0.5" />
          </button>
        </div>
      </main>

      <AnimatePresence>
        {selectedOrder ? (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4" onClick={() => setSelectedOrder(null)}>
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900">تفاصيل الطلب #HLP-{selectedOrder.id}</h2>
                  <p className="mt-1 text-sm text-slate-500">{formatArabicDateTime(selectedOrder.created_at)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-full bg-slate-100 p-2 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs font-bold text-slate-400">المريض</div>
                  <div className="mt-1 font-bold text-slate-900">{selectedOrder.patient?.name || "مريض"}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs font-bold text-slate-400">الحالة</div>
                  <div className="mt-1 font-bold text-emerald-600">المكتملة</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 md:col-span-2">
                  <div className="text-xs font-bold text-slate-400">الأدوية</div>
                  <div className="mt-1 font-medium text-slate-900">{orderItemsLabel(selectedOrder)}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs font-bold text-slate-400">رقم الطلب</div>
                  <div className="mt-1 font-bold text-slate-900">#HLP-{selectedOrder.id}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs font-bold text-slate-400">الإجمالي</div>
                  <div className="mt-1 font-bold text-slate-900">{formatMoney(Number(selectedOrder.total_price || 0))}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 md:col-span-2">
                  <div className="text-xs font-bold text-slate-400">عنوان التسليم</div>
                  <div className="mt-1 font-medium leading-relaxed text-slate-900">{selectedOrder.delivery_address_snapshot || "—"}</div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => void onDownloadInvoice(selectedOrder)}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <FileText size={16} />
                  عرض الفاتورة
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-xl bg-brand-blue px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-blue/90"
                >
                  إغلاق
                </button>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <footer className="mt-16 text-center text-[10px] text-slate-400">
        <p>© 2024 منصة Healup الطبية - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
}
