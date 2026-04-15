"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, ChevronDown, FileText, Search, User } from "lucide-react";
import { orderService, type Order } from "@/services/orderService";

type DateTab = "«·ﬂ·" | "«·ÌÊ„" | "Â–« «·√”»Ê⁄" | "Â–« «·‘Â—";

function formatAmount(n: number) {
  return `${n.toFixed(2)} Ã.„`;
}

export default function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [tab, setTab] = useState<DateTab>("«·ﬂ·");
  const [q, setQ] = useState("");

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

  const done = useMemo(() => orders.filter((o) => o.status === "completed"), [orders]);

  const filtered = useMemo(() => {
    const now = new Date();
    const startToday = new Date(now);
    startToday.setHours(0, 0, 0, 0);

    const startWeek = new Date(startToday);
    startWeek.setDate(startWeek.getDate() - startWeek.getDay());

    const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return done
      .filter((o) => {
        const dt = new Date(o.created_at);
        if (tab === "«·ÌÊ„") return dt >= startToday;
        if (tab === "Â–« «·√”»Ê⁄") return dt >= startWeek;
        if (tab === "Â–« «·‘Â—") return dt >= startMonth;
        return true;
      })
      .filter((o) => {
        if (!q.trim()) return true;
        const query = q.trim().toLowerCase();
        const patient = (o.patient?.name ?? "").toLowerCase();
        const id = `hlp-${o.id}`.toLowerCase();
        return patient.includes(query) || id.includes(query);
      });
  }, [done, tab, q]);

  return (
    <div className="bg-brand-bg pb-8" dir="rtl">
      <main className="w-full px-4 mt-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">«·ÿ·»«  «·„ﬂ „·…</h1>

        <div className="relative mb-6">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="«·»ÕÀ »—ﬁ„ «·ÿ·» √Ê «”„ «·„—Ì÷..."
            className="w-full bg-white border border-slate-200 rounded-xl py-3 px-12 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all shadow-sm"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        </div>

        <div className="bg-white p-1.5 rounded-xl border border-slate-200 flex mb-8 shadow-sm">
          {(["«·ﬂ·", "«·ÌÊ„", "Â–« «·√”»Ê⁄", "Â–« «·‘Â—"] as DateTab[]).map((key) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === key ? "bg-brand-blue text-white shadow-md" : "text-slate-500 hover:bg-slate-50"}`}
            >
              {key}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filtered.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-stretch gap-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center pr-2">
                <div className="w-16 h-16 rounded-full bg-brand-light-green flex items-center justify-center text-brand-green shadow-inner">
                  <CheckCircle2 size={32} />
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between text-right">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-brand-blue font-bold text-lg">HLP-{order.id}</span>
                    <span className="bg-brand-light-green text-brand-green text-[10px] font-bold px-2 py-0.5 rounded-md">„ﬂ „·</span>
                  </div>
                  <span className="text-slate-400 text-xs">{new Date(order.created_at).toLocaleDateString("ar-EG")} - {new Date(order.created_at).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}</span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-slate-700 font-bold">
                    <User size={16} className="text-slate-400" />
                    <span>{order.patient?.name ?? "„—Ì÷"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-xs max-w-[60%] truncate">
                    <span>{order.items?.map((i) => `${i.medicine_name} ◊${i.quantity}`).join("° ") ?? "ó"}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-400 text-xs">«·≈Ã„«·Ì:</span>
                    <span className="text-slate-900 font-bold text-xl">{formatAmount(order.total_price)}</span>
                  </div>
                  <button className="bg-white border border-slate-100 text-slate-700 px-6 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm" type="button">
                    <FileText size={14} />
                    <span>⁄—÷ «·›« Ê—…</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 ? <p className="text-center text-slate-500 py-10">·«  ÊÃœ ÿ·»«  „ﬂ „·….</p> : null}

        <div className="mt-10 flex justify-center">
          <span className="border-2 border-brand-blue text-brand-blue px-8 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 opacity-70">
            <span> Õ„Ì· «·„“Ìœ „‰ «·ÿ·»« </span>
            <ChevronDown size={18} />
          </span>
        </div>
      </main>
    </div>
  );
}
