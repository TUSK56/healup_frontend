"use client";

import React from "react";
import Link from "next/link";
import { Pill, MapPin, Clock, ArrowLeft, ChevronDown, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import api from "@/services/apiService";
import { orderService } from "@/services/orderService";
import { pharmacyService, type AwaitingPatientOrderRow } from "@/services/pharmacyService";
import { consumePharmacyCurrentOrderNotifications } from "@/lib/pharmacyNotifications";

type ApiOrder = {
  id: number;
  request_id: number;
  status: string;
  /** Prefer camelCase; API may send `Delivery` (PascalCase). */
  delivery?: boolean;
  Delivery?: boolean;
  total_price: number;
  created_at: string;
  preparing_at?: string | null;
  patient?: { name?: string | null } | null;
  items?: Array<{ medicine_name: string; quantity: number; price: number }>;
};

type BoardRow =
  | { kind: "awaiting"; row: AwaitingPatientOrderRow }
  | { kind: "order"; order: ApiOrder };

/** Handles both JSON `status` and accidental PascalCase `Status`. */
function normalizeOrderStatus(order: ApiOrder & { Status?: string }): string {
  const raw = order.status ?? order.Status;
  return String(raw ?? "")
    .trim()
    .toLowerCase();
}

function normalizeOrderDelivery(order: ApiOrder): boolean {
  const v = order.delivery ?? order.Delivery;
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v !== 0;
  if (typeof v === "string") return v === "true" || v === "1";
  return true;
}

type DetailState =
  | { kind: "order"; order: ApiOrder }
  | { kind: "awaiting"; row: AwaitingPatientOrderRow };

function parseServerDate(value: string) {
  const v = (value || "").trim();
  if (!v) return new Date(0);
  if (/[zZ]$/.test(v) || /[+-]\d\d:\d\d$/.test(v)) return new Date(v);
  return new Date(`${v}Z`);
}

function relativeArabic(iso: string) {
  const diffMs = Math.max(0, Date.now() - parseServerDate(iso).getTime());
  const sec = Math.floor(diffMs / 1000);
  if (sec < 60) return "الآن";
  const minutes = Math.floor(sec / 60);
  if (minutes < 60) return minutes === 1 ? "منذ دقيقة" : `منذ ${minutes} دقيقة`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours === 1 ? "منذ ساعة" : `منذ ${hours} ساعة`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "منذ يوم" : `منذ ${days} يوم`;
}

function contentsLabelFromRequestLike(input: {
  medicines?: Array<{ medicine_name: string; quantity: number }>;
  prescription_url?: string | null;
}) {
  const hasRx = Boolean(input.prescription_url && String(input.prescription_url).trim());
  const hasMeds = Boolean(input.medicines && input.medicines.length > 0);
  if (hasMeds && hasRx) return "علاج + روشتة";
  if (hasMeds) return "علاج";
  if (hasRx) return "روشتة";
  return "—";
}

async function downloadFileFromUrl(url: string, filenameBase: string) {
  const safeUrl = String(url || "").trim();
  if (!safeUrl) return;
  try {
    const res = await fetch(safeUrl, { mode: "cors" });
    if (!res.ok) throw new Error("download_failed");
    const blob = await res.blob();
    const ct = (res.headers.get("content-type") || blob.type || "").toLowerCase();
    const ext = ct.includes("pdf") ? "pdf" : ct.includes("png") ? "png" : "jpg";
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = `${filenameBase}.${ext}`;
    a.rel = "noopener";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 200);
  } catch {
    window.open(safeUrl, "_blank", "noopener,noreferrer");
  }
}

/** UI label + bucket for tabs */
function classifyOrder(order: ApiOrder): { label: string; tab: "wait" | "prep" | "out" | "done" } {
  const st = normalizeOrderStatus(order);
  if (st === "pending_pharmacy_confirmation") {
    return { label: "جاري التجهيز", tab: "prep" };
  }
  if (st === "confirmed") {
    return { label: "بانتظار المريض", tab: "wait" };
  }
  if (st === "preparing") {
    return { label: "جاري التجهيز", tab: "prep" };
  }
  if (st === "out_for_delivery") return { label: "بالطريق", tab: "out" };
  if (st === "ready_for_pickup") return { label: "بالطريق", tab: "out" };
  if (st === "completed") return { label: "المكتملة", tab: "done" };
  if (st === "rejected") return { label: "مرفوض", tab: "done" };
  return { label: String(order.status ?? (order as { Status?: string }).Status ?? "").trim() || st, tab: "prep" };
}

const AwaitPatientCard = ({
  row,
  onDetails,
}: {
  row: AwaitingPatientOrderRow;
  onDetails: (r: AwaitingPatientOrderRow) => void;
}) => {
  const label = contentsLabelFromRequestLike(row);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col overflow-hidden rounded-2xl border border-amber-100 bg-amber-50/40 shadow-sm transition-all duration-300 hover:shadow-md"
    >
      <div className="flex-1 p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <div className="w-fit rounded-lg bg-amber-100 px-2.5 py-1">
              <span className="text-xs font-bold tracking-wider text-amber-900">طلب #{row.request_id}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800">{row.patient_name?.trim() || "مريض"}</h3>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">
            <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            بانتظار المريض
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-slate-600">
            <div className="rounded-lg bg-white/80 p-2">
              <Pill size={16} className="text-slate-400" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-extrabold text-slate-700">المحتويات:</span>
              <span className="text-sm font-bold text-slate-700">{label}</span>
              {row.prescription_url ? (
                <button
                  type="button"
                  className="text-sm font-black text-[#1a56db] underline"
                  onClick={(e) => {
                    e.preventDefault();
                    void downloadFileFromUrl(row.prescription_url!, `prescription-${row.request_id}`);
                  }}
                >
                  تحميل الروشتة
                </button>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-500">
            <div className="rounded-lg bg-white/80 p-2">
              <Clock size={16} className="text-slate-400" />
            </div>
            <span className="text-sm">{relativeArabic(row.created_at)}</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="group flex w-full items-center justify-center gap-2 bg-amber-700 py-4 text-sm font-bold text-white transition-colors hover:bg-amber-800"
        onClick={() => onDetails(row)}
      >
        <span>عرض التفاصيل</span>
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
      </button>
    </motion.div>
  );
};

const OrderCard = ({
  order,
  onDetails,
  onConfirmPreparing,
  confirmingId,
}: {
  order: ApiOrder;
  onDetails: (o: ApiOrder) => void;
  onConfirmPreparing: (o: ApiOrder) => void;
  confirmingId: number | null;
}) => {
  const { label, tab } = classifyOrder(order);
  const st = normalizeOrderStatus(order);
  /** Same “جاري التجهيز” tab covers pending + preparing; both can ship from dashboard. */
  const showConfirmPreparing = st === "preparing" || st === "pending_pharmacy_confirmation";
  const isWait = tab === "wait";
  const isOut = tab === "out";
  const isDone = tab === "done";
  const med =
    order.items?.map((i) => `${i.medicine_name} ×${i.quantity}`).join("، ") || "—";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
    >
      <div className="flex-1 p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <div className="w-fit rounded-lg bg-[#E6EFF7] px-2.5 py-1">
              <span className="text-xs font-bold tracking-wider text-[#004BAB]">#HLP-{order.id}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800">{order.patient?.name || "مريض"}</h3>
          </div>

          <div
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
              isWait
                ? "bg-amber-50 text-amber-700"
                : isOut
                  ? "bg-blue-50 text-blue-600"
                  : isDone
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-[#FEF3C7] text-amber-600"
            }`}
          >
            <div
              className={`h-1.5 w-1.5 rounded-full ${
                isWait ? "bg-amber-500" : isOut ? "bg-blue-500" : isDone ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
            {label}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-slate-600">
            <div className="rounded-lg bg-slate-50 p-2">
              <Pill size={16} className="text-slate-400" />
            </div>
            <span className="text-sm font-medium">{med}</span>
          </div>

          <div className="flex items-center gap-3 text-slate-500">
            <div className="rounded-lg bg-slate-50 p-2">
              {isOut ? <MapPin size={16} className="text-slate-400" /> : <Clock size={16} className="text-slate-400" />}
            </div>
            <span className="text-sm">{relativeArabic(order.created_at)}</span>
          </div>
        </div>
      </div>

      {showConfirmPreparing ? (
        <div className="flex w-full border-t border-slate-100">
          <button
            type="button"
            disabled={confirmingId === order.id}
            className="group flex min-h-[56px] min-w-0 flex-1 items-center justify-center gap-1.5 border-e border-slate-200/90 bg-emerald-700 px-2 py-4 text-center text-xs font-bold leading-tight text-white transition-colors hover:bg-emerald-800 disabled:opacity-70 sm:text-sm sm:gap-2"
            onClick={() => onConfirmPreparing(order)}
          >
            {confirmingId === order.id ? (
              <Loader2 size={18} className="animate-spin shrink-0" />
            ) : (
              <>
                <CheckCircle2 size={16} className="shrink-0" />
                <span>توصيل الطلب</span>
              </>
            )}
          </button>
          <button
            type="button"
            className="group flex min-h-[56px] min-w-0 flex-1 items-center justify-center gap-2 bg-[#0456AE] px-2 py-4 text-sm font-bold text-white transition-colors hover:bg-[#004494]"
            onClick={() => onDetails(order)}
          >
            <span>عرض التفاصيل</span>
            <ArrowLeft size={16} className="shrink-0 transition-transform group-hover:-translate-x-1" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="group flex w-full items-center justify-center gap-2 bg-[#0456AE] py-4 text-sm font-bold text-white transition-colors hover:bg-[#004494]"
          onClick={() => onDetails(order)}
        >
          <span>عرض التفاصيل</span>
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
        </button>
      )}
    </motion.div>
  );
};

type TabKey = "all" | "wait" | "prep" | "out" | "done";

export default function PharmacyCurrentOrdersApp() {
  const [orders, setOrders] = React.useState<ApiOrder[]>([]);
  const [completedOrders, setCompletedOrders] = React.useState<ApiOrder[]>([]);
  const [awaitingRows, setAwaitingRows] = React.useState<AwaitingPatientOrderRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<TabKey>("all");
  const [nowTick, setNowTick] = React.useState(() => Date.now());
  const [detail, setDetail] = React.useState<DetailState | null>(null);
  const [confirmingId, setConfirmingId] = React.useState<number | null>(null);
  const [shipError, setShipError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const [ordersRes, awaiting] = await Promise.all([
        api.get<{ data: ApiOrder[] }>("/orders"),
        pharmacyService.getAwaitingPatientOrders().catch(() => [] as AwaitingPatientOrderRow[]),
      ]);
      const list = ordersRes.data?.data || [];
      const open = ["pending_pharmacy_confirmation", "confirmed", "preparing", "out_for_delivery", "ready_for_pickup"];
      setOrders(list.filter((o) => open.includes(normalizeOrderStatus(o))));
      setCompletedOrders(
        list
          .filter((o) => normalizeOrderStatus(o) === "completed")
          .slice(0, 120),
      );
      setAwaitingRows(awaiting);
    } catch (e) {
      console.error("Pharmacy orders load failed", e);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  React.useEffect(() => {
    const t = window.setInterval(() => setNowTick(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const handleConfirmPreparing = React.useCallback(
    async (o: ApiOrder) => {
      if (confirmingId != null) return;
      setShipError(null);
      setConfirmingId(o.id);
      try {
        await orderService.updateStatus(o.id, "out_for_delivery");
        await consumePharmacyCurrentOrderNotifications();
        await load();
      } catch (e: unknown) {
        const ax = e as { response?: { data?: { message?: string } } };
        const msg =
          ax.response?.data?.message?.trim() ||
          (e instanceof Error ? e.message : "") ||
          "تعذر تحديث حالة الطلب. تحقق من الاتصال أو أعد تسجيل الدخول.";
        setShipError(msg);
        console.error("Ship order failed", e);
      } finally {
        setConfirmingId(null);
      }
    },
    [confirmingId, load],
  );

  const stats = React.useMemo(() => {
    const waitOrders = orders.filter((o) => classifyOrder(o).tab === "wait").length;
    const prepOrders = orders.filter((o) => classifyOrder(o).tab === "prep").length;
    const outOrders = orders.filter((o) => classifyOrder(o).tab === "out").length;
    return {
      all: awaitingRows.length + orders.length,
      wait: awaitingRows.length + waitOrders,
      prep: prepOrders,
      out: outOrders,
      done: completedOrders.length,
    };
  }, [orders, awaitingRows, completedOrders]);

  const filtered: BoardRow[] = React.useMemo(() => {
    if (activeTab === "done") {
      return completedOrders.map((order) => ({ kind: "order" as const, order }));
    }
    const awaitingBoard: BoardRow[] = awaitingRows.map((row) => ({ kind: "awaiting", row }));

    const orderPart = (() => {
      if (activeTab === "all") return orders;
      return orders.filter((o) => {
        const { tab } = classifyOrder(o);
        if (activeTab === "wait") return tab === "wait";
        if (activeTab === "prep") return tab === "prep";
        if (activeTab === "out") return tab === "out";
        return true;
      });
    })();

    const orderRows: BoardRow[] = orderPart.map((order) => ({ kind: "order", order }));

    if (activeTab === "all") {
      const merged = [...awaitingBoard, ...orderRows];
      merged.sort((a, b) => {
        const ta = a.kind === "awaiting" ? a.row.created_at : a.order.created_at;
        const tb = b.kind === "awaiting" ? b.row.created_at : b.order.created_at;
        return parseServerDate(tb).getTime() - parseServerDate(ta).getTime();
      });
      return merged;
    }
    if (activeTab === "wait") {
      const merged = [...awaitingBoard, ...orderRows];
      merged.sort((a, b) => {
        const ta = a.kind === "awaiting" ? a.row.created_at : a.order.created_at;
        const tb = b.kind === "awaiting" ? b.row.created_at : b.order.created_at;
        return parseServerDate(tb).getTime() - parseServerDate(ta).getTime();
      });
      return merged;
    }
    return orderRows;
  }, [activeTab, orders, awaitingRows, completedOrders]);

  return (
    <div className="flex min-h-screen flex-col font-sans">
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-8 md:py-12">
        <div className="mb-12 text-center md:text-right">
          <h1 className="mb-3 text-4xl font-black text-slate-900">الطلبات الحالية</h1>
          <p className="text-lg text-slate-500">تابع حالة طلبات الأدوية الجارية (بعد العرض) والتسليم</p>
        </div>

        {shipError ? (
          <div
            className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-right text-sm font-medium text-red-800"
            role="alert"
          >
            {shipError}
            <button
              type="button"
              className="mr-3 text-xs font-bold text-red-600 underline"
              onClick={() => setShipError(null)}
            >
              إغلاق
            </button>
          </div>
        ) : null}

        {loading ? (
          <div className="py-20 text-center text-slate-500">جاري التحميل...</div>
        ) : null}

        <div className="mb-10 flex flex-wrap items-center justify-center gap-2 border-b border-slate-100 pb-px md:justify-start">
          {(
            [
              ["all", `الكل (${stats.all})`],
              ["wait", `بانتظار المريض (${stats.wait})`],
              ["prep", `جاري التجهيز (${stats.prep})`],
              ["out", `بالطريق (${stats.out})`],
              ["done", `المكتملة (${stats.done})`],
            ] as const
          ).map(([key, text]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`relative px-5 py-4 text-sm font-bold transition-all md:px-6 ${
                activeTab === key ? "text-[#0456AE]" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {text}
              {activeTab === key ? (
                <motion.div layoutId="activeTabCo" className="absolute bottom-0 left-0 right-0 h-1 rounded-t-full bg-[#0456AE]" />
              ) : null}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((entry) =>
              entry.kind === "awaiting" ? (
                <AwaitPatientCard
                  key={`await-rq-${entry.row.request_id}`}
                  row={entry.row}
                  onDetails={(r) => setDetail({ kind: "awaiting", row: r })}
                />
              ) : (
                <OrderCard
                  key={`ord-${entry.order.id}`}
                  order={entry.order}
                  onDetails={(o) => setDetail({ kind: "order", order: o })}
                  onConfirmPreparing={handleConfirmPreparing}
                  confirmingId={confirmingId}
                />
              ),
            )}
          </AnimatePresence>
        </div>

        {!loading && filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-500">لا توجد طلبات في هذا القسم حالياً.</div>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:justify-start">
          <button
            type="button"
            className="flex items-center gap-2 font-bold text-[#0456AE] transition-all hover:underline"
            onClick={() => void load()}
          >
            <span>تحديث القائمة</span>
            <ChevronDown size={20} />
          </button>
          <Link href="/pharmacy-dashboard/new-orders" className="text-sm font-bold text-slate-500 hover:text-[#0456AE]">
            إدارة الطلبات الجديدة والعروض
          </Link>
        </div>
      </main>

      {detail ? (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/45 p-4"
          onClick={() => setDetail(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {detail.kind === "order" ? (
              <>
                <h2 className="mb-4 text-xl font-black text-slate-900">تفاصيل الطلب #{detail.order.id}</h2>
                <p className="mb-2 text-sm text-slate-600">
                  المريض: <strong>{detail.order.patient?.name || "—"}</strong>
                </p>
                <p className="mb-2 text-sm text-slate-600">
                  الحالة: <strong>{classifyOrder(detail.order).label}</strong>
                </p>
                <p className="mb-2 text-sm text-slate-600">
                  طريقة الاستلام: <strong>{detail.order.delivery ? "توصيل للمنزل" : "استلام من الصيدلية"}</strong>
                </p>
                <p className="mb-4 text-sm text-slate-600">
                  الإجمالي: <strong>{Number(detail.order.total_price || 0).toFixed(2)} ج.م</strong>
                </p>
                <ul className="space-y-2 border-t border-slate-100 pt-4 text-right">
                  {(detail.order.items || []).map((i, idx) => (
                    <li key={idx} className="flex justify-between text-sm">
                      <span>{i.medicine_name}</span>
                      <span className="text-slate-500">
                        {i.quantity} × {Number(i.price).toFixed(2)} ج.م
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <h2 className="mb-4 text-xl font-black text-slate-900">طلب رقم #{detail.row.request_id}</h2>
                <p className="mb-2 text-sm text-slate-600">
                  المريض: <strong>{detail.row.patient_name?.trim() || "—"}</strong>
                </p>
                <p className="mb-2 text-sm font-bold text-amber-800">
                  بانتظار المريض — <span className="text-slate-800">المحتويات: {contentsLabelFromRequestLike(detail.row)}</span>
                </p>
                <p className="mb-4 text-sm text-slate-500">
                  رقم العرض: {detail.row.response_id} — تاريخ الطلب: {relativeArabic(detail.row.created_at)}
                </p>
                {detail.row.prescription_url ? (
                  <button
                    type="button"
                    className="mb-4 inline-flex w-full items-center justify-center rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-black text-[#1a56db]"
                    onClick={() => void downloadFileFromUrl(detail.row.prescription_url!, `prescription-${detail.row.request_id}`)}
                  >
                    تحميل الروشتة
                  </button>
                ) : null}
                <ul className="space-y-2 border-t border-slate-100 pt-4 text-right">
                  {(detail.row.medicines || []).map((m, idx) => (
                    <li key={idx} className="flex justify-between text-sm">
                      <span>{m.medicine_name}</span>
                      <span className="text-slate-500">{m.quantity}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <button
              type="button"
              className="mt-6 w-full rounded-xl bg-slate-100 py-3 text-sm font-bold text-slate-800"
              onClick={() => setDetail(null)}
            >
              إغلاق
            </button>
          </div>
        </div>
      ) : null}

      <footer className="mt-auto border-t border-slate-100 bg-white py-8 px-4 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <CheckCircle2 size={18} className="text-blue-500" />
            <span>Healup - منصة إدارة الصيدليات والطلبات الطبية</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
