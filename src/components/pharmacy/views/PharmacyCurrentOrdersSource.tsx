"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ChevronDown, Clock, MapPin, Pill } from "lucide-react";
import { orderService, type Order } from "@/services/orderService";
import { formatRelativeTimeAr } from "@/lib/formatRelativeAr";

type OrderTab = "all" | "processing" | "out-for-delivery" | "completed";

function toVisualStatus(status: string): "processing" | "out-for-delivery" | "completed" {
  if (status === "out_for_delivery") return "out-for-delivery";
  if (status === "completed") return "completed";
  return "processing";
}

function nextAction(o: Order): { label: string; status: string } | null {
  switch (o.status) {
    case "preparing":
      return { label: "Œ—Ã ·· Ê’Ì·", status: "out_for_delivery" };
    case "out_for_delivery":
    case "ready_for_pickup":
      return { label: "≈ﬂ„«· «·ÿ·»", status: "completed" };
    case "confirmed":
      return { label: "»œ¡ «· ÃÂÌ“", status: "preparing" };
    default:
      return null;
  }
}

function statusLabel(status: string) {
  if (status === "out_for_delivery") return "Œ—Ã ·· Ê’Ì·";
  if (status === "completed") return "„ﬂ „·";
  if (status === "ready_for_pickup") return "Ã«Â“ ··«” ·«„";
  if (status === "confirmed") return "»«‰ Ÿ«— «·„—Ì÷";
  return "Ã«—Ì «· ÃÂÌ“";
}

export default function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<OrderTab>("all");
  const [busyOrderId, setBusyOrderId] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await orderService.list();
      setOrders(data.data);
    } catch {
      setOrders([]);
    }
  }, []);

  useEffect(() => {
    void load();
    const on = () => void load();
    window.addEventListener("healup:notification", on);
    return () => window.removeEventListener("healup:notification", on);
  }, [load]);

  const display = useMemo(() => {
    const list = orders.filter((o) => ["confirmed", "preparing", "ready_for_pickup", "out_for_delivery", "completed"].includes(o.status));
    if (activeTab === "all") return list;
    if (activeTab === "completed") return list.filter((o) => toVisualStatus(o.status) === "completed");
    return list.filter((o) => toVisualStatus(o.status) === activeTab);
  }, [orders, activeTab]);

  const stats = useMemo(() => {
    const relevant = orders.filter((o) => ["confirmed", "preparing", "ready_for_pickup", "out_for_delivery", "completed"].includes(o.status));
    return {
      all: relevant.length,
      processing: relevant.filter((o) => toVisualStatus(o.status) === "processing").length,
      delivery: relevant.filter((o) => toVisualStatus(o.status) === "out-for-delivery").length,
    };
  }, [orders]);

  const handleAction = async (orderId: number, status: string) => {
    setBusyOrderId(orderId);
    try {
      await orderService.updateStatus(orderId, status);
      await load();
      window.dispatchEvent(new Event("healup:notification"));
    } finally {
      setBusyOrderId(null);
    }
  };

  return (
    <div className="font-sans" dir="rtl">
      <main className="w-full px-4 md:px-6 py-6">
        <div className="mb-8 text-center md:text-right">
          <h1 className="text-4xl font-black text-slate-900 mb-3">«·ÿ·»«  «·Õ«·Ì…</h1>
          <p className="text-slate-500 text-lg"> «»⁄ Õ«·… ÿ·»«  «·√œÊÌ… «·Ã«—Ì… Ê ›«’Ì· «· Ê’Ì·</p>
        </div>

        <div className="mb-8 flex flex-wrap justify-center md:justify-start items-center gap-2 border-b border-slate-100 pb-px">
          <button onClick={() => setActiveTab("all")} className={`px-6 py-4 text-sm font-bold transition-all relative ${activeTab === "all" ? "text-[#0456AE] border-b-2 border-[#0456AE]" : "text-slate-400 hover:text-slate-600"}`}>
            «·ﬂ· ({stats.all})
          </button>
          <button onClick={() => setActiveTab("processing")} className={`px-6 py-4 text-sm font-bold transition-all relative ${activeTab === "processing" ? "text-[#0456AE] border-b-2 border-[#0456AE]" : "text-slate-400 hover:text-slate-600"}`}>
            Ã«—Ì «· ÃÂÌ“ ({stats.processing})
          </button>
          <button onClick={() => setActiveTab("out-for-delivery")} className={`px-6 py-4 text-sm font-bold transition-all relative ${activeTab === "out-for-delivery" ? "text-[#0456AE] border-b-2 border-[#0456AE]" : "text-slate-400 hover:text-slate-600"}`}>
            Œ—Ã ·· Ê’Ì· ({stats.delivery})
          </button>
          <button onClick={() => setActiveTab("completed")} className={`px-6 py-4 text-sm font-bold transition-all relative ${activeTab === "completed" ? "text-[#0456AE] border-b-2 border-[#0456AE]" : "text-slate-400 hover:text-slate-600"}`}>
            «·„ﬂ „·…
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {display.map((order) => {
            const visualStatus = toVisualStatus(order.status);
            const action = nextAction(order);
            return (
              <div key={order.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col">
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col gap-2">
                      <div className="bg-[#E6EFF7] text-[#004BAB] px-2.5 py-1 rounded-lg w-fit">
                        <span className="text-xs font-bold tracking-wider">HLP-{order.id}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">{order.patient?.name ?? "„—Ì÷"}</h3>
                    </div>

                    <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${visualStatus === "processing" ? "bg-[#FEF3C7] text-amber-600" : visualStatus === "out-for-delivery" ? "bg-[#DBEAFE] text-blue-600" : "bg-emerald-50 text-emerald-600"}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${visualStatus === "processing" ? "bg-amber-500" : visualStatus === "out-for-delivery" ? "bg-blue-500" : "bg-emerald-500"}`} />
                      {statusLabel(order.status)}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-slate-600">
                      <div className="p-2 bg-slate-50 rounded-lg"><Pill size={16} className="text-slate-400" /></div>
                      <span className="text-sm font-medium">{order.items?.map((i) => `${i.medicine_name} ◊${i.quantity}`).join("° ") ?? "ó"}</span>
                    </div>

                    <div className="flex items-center gap-3 text-slate-500">
                      <div className="p-2 bg-slate-50 rounded-lg">{visualStatus === "out-for-delivery" ? <MapPin size={16} className="text-slate-400" /> : <Clock size={16} className="text-slate-400" />}</div>
                      <span className="text-sm">{formatRelativeTimeAr(order.created_at)}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!action || busyOrderId === order.id}
                  onClick={() => action && void handleAction(order.id, action.status)}
                  className="w-full py-4 bg-[#0456AE] hover:bg-[#004494] disabled:opacity-60 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 group"
                >
                  <span>{action ? action.label : "⁄—÷ «· ›«’Ì·"}</span>
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>

        {display.length === 0 ? (
          <p className="text-center text-slate-500 mt-10">·«  ÊÃœ ÿ·»«  ›Ì Â–« «·ﬁ”„.</p>
        ) : null}

        <div className="mt-10 flex justify-center">
          <span className="flex items-center gap-2 text-[#0456AE] font-bold opacity-70">
            <span> Õ„Ì· «·„“Ìœ „‰ «·ÿ·»« </span>
            <ChevronDown size={20} />
          </span>
        </div>
      </main>
    </div>
  );
}
