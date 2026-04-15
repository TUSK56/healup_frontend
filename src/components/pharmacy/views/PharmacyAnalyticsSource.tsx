"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { pharmacyAnalyticsService, type PharmacyAnalytics } from "@/services/pharmacyAnalyticsService";

function formatEgp(n: number) {
  return `${n.toLocaleString("ar-EG", { maximumFractionDigits: 0 })} ?.?`;
}

export default function Dashboard() {
  const [data, setData] = useState<PharmacyAnalytics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    pharmacyAnalyticsService
      .get()
      .then(setData)
      .catch(() => setError("???? ????? ?????????. ???? ?? ????? ?????? ???????."));
  }, []);

  const chart = useMemo(
    () => data?.revenue_last_7_days.map((d) => ({ name: d.name, value: Number(d.value) })) ?? [],
    [data]
  );

  if (error) return <p className="text-red-600 font-bold">{error}</p>;
  if (!data) return <p className="text-slate-500">???? ???????...</p>;

  const topMax = Math.max(1, ...data.top_medicines.map((m) => m.orders));

  return (
    <div className="bg-slate-50/50 font-sans" dir="rtl">
      <main className="w-full p-4 md:p-6 space-y-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900">??????? ???????</h1>
          <p className="text-slate-500">???? ???? ????? ??? ???? ?????? ????????</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-none shadow-sm"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">?????? ?????????</CardTitle></CardHeader><CardContent className="flex items-baseline justify-between"><div className="text-2xl font-bold">{formatEgp(data.total_revenue)}</div><Badge variant="secondary" className="bg-[#DCFCE7] text-[#009C31] border-none">+12%</Badge></CardContent></Card>
          <Card className="border-none shadow-sm"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">??????? ????????</CardTitle></CardHeader><CardContent className="flex items-baseline justify-between"><div className="text-2xl font-bold">{data.completed_total}</div><Badge variant="secondary" className="bg-[#DCFCE7] text-[#009C31] border-none">+5%</Badge></CardContent></Card>
          <Card className="border-none shadow-sm"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">????? ???? ?????</CardTitle></CardHeader><CardContent className="flex items-baseline justify-between"><div className="text-2xl font-bold">{formatEgp(data.average_order_value)}</div><Badge variant="secondary" className="bg-[#DCFCE7] text-[#009C31] border-none">+2%</Badge></CardContent></Card>
          <Card className="border-none shadow-sm"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">????? ?????</CardTitle></CardHeader><CardContent className="flex items-baseline justify-between"><div className="text-2xl font-bold">{data.new_orders}</div><Badge variant="secondary" className="bg-[#DCFCE7] text-[#009C31] border-none">+1%</Badge></CardContent></Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">??????? ????????? ???????</CardTitle>
                <div className="flex items-center gap-2 mt-1"><span className="text-2xl font-bold">{formatEgp(data.total_revenue)}</span></div>
              </div>
              <Badge variant="outline" className="text-slate-500 font-normal">??? 7 ????</Badge>
            </CardHeader>
            <CardContent className="p-0 pt-4">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chart} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs><linearGradient id="colorValueLive" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0456AE" stopOpacity={0.1}/><stop offset="95%" stopColor="#0456AE" stopOpacity={0}/></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} dy={10} interval={0} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "none", textAlign: "right" }} />
                    <Area type="monotone" dataKey="value" stroke="#0456AE" strokeWidth={3} fillOpacity={1} fill="url(#colorValueLive)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-1 border-none shadow-sm">
            <CardHeader><CardTitle className="text-lg">???? 5 ????? ??????</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              {data.top_medicines.slice(0, 5).map((med) => (
                <div key={med.medicine_name} className="space-y-2">
                  <div className="flex justify-between text-sm"><span className="font-medium text-slate-700">{med.medicine_name}</span><span className="text-slate-500">{med.orders} ???</span></div>
                  <Progress value={(med.orders / topMax) * 100} className="h-2 bg-slate-100" indicatorClassName="bg-[#0456AE]" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader><CardTitle className="text-lg">????? ??????? ??? ?????</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-slate-100">
                  <TableHead className="text-right text-[#5A6C85]">?????</TableHead>
                  <TableHead className="text-right text-[#5A6C85]">??? ???????</TableHead>
                  <TableHead className="text-right text-[#5A6C85]">?????????</TableHead>
                  <TableHead className="text-right text-[#5A6C85]">??????</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.category_breakdown.map((cat) => (
                  <TableRow key={cat.name} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-medium text-primary">{cat.name}</TableCell>
                    <TableCell>{cat.orders}</TableCell>
                    <TableCell>{formatEgp(cat.revenue)}</TableCell>
                    <TableCell><Badge className="bg-[#DBEAFE] text-[#1E40AF] border-none shadow-none font-medium">?????</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
