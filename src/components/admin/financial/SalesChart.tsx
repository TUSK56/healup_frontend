"use client";

import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { useLocale } from "@/contexts/LocaleContext";

export default function SalesChart() {
  const { t } = useLocale();
  const data = [
    { name: t("admin.financial.monthJan", "Jan"), sales: 4000 },
    { name: t("admin.financial.monthFeb", "Feb"), sales: 3000 },
    { name: t("admin.financial.monthMar", "Mar"), sales: 5000 },
    { name: t("admin.financial.monthApr", "Apr"), sales: 2780 },
    { name: t("admin.financial.monthMay", "May"), sales: 1890 },
    { name: t("admin.financial.monthJun", "Jun"), sales: 2390 },
  ];
  return (
    <div className="h-[400px] rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between">
        <h3 className="text-lg font-bold text-gray-900">{t("admin.financial.salesGrowthTitle", "Monthly sales growth")}</h3>
        <p className="text-xs text-gray-400">{t("admin.financial.salesGrowthPeriod", "Last 6 months")}</p>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} dy={10} />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
              }}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#2563eb"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorSales)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
