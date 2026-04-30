import React from 'react';
import { 
  Bell, 
  Search, 
  User, 
  TrendingUp, 
  TrendingDown, 
  MoreHorizontal, 
  PlusCircle,
  Package,
  Users,
  ShoppingCart,
  DollarSign
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const revenueData = [
  { name: 'Sat', value: 230000 },
  { name: 'Sun', value: 280000 },
  { name: 'Mon', value: 120000 },
  { name: 'Tue', value: 210000 },
  { name: 'Wed', value: 180000 },
  { name: 'Thu', value: 220000 },
  { name: 'Fri', value: 150000 },
];

const topMedicines = [
  { name: 'بندول أكسترا', orders: 420, percentage: 85 },
  { name: 'أوجمنتين 1 جم', orders: 310, percentage: 65 },
  { name: 'كونجستال', orders: 285, percentage: 55 },
  { name: 'بروفين 400', orders: 190, percentage: 40 },
  { name: 'فيتامين سي 1000', orders: 145, percentage: 30 },
];

const categories = [
  { name: 'المسكنات', orders: 450, revenue: '12,400 ج.م', growth: '+15%', status: 'مرتفع', statusColor: 'bg-[#DCFCE7] text-[#166534]', growthColor: 'text-[#07A041]' },
  { name: 'المضادات الحيوية', orders: 320, revenue: '15,600 ج.م', growth: '+8%', status: 'مستقر', statusColor: 'bg-[#DBEAFE] text-[#1E40AF]', growthColor: 'text-[#33AD5D]' },
  { name: 'الفيتامينات', orders: 210, revenue: '8,200 ج.م', growth: '-2%', status: 'منخفض', statusColor: 'bg-[#FEE2E2] text-[#991B1B]', growthColor: 'text-[#E35757]' },
  { name: 'أدوات العناية بالبشرة', orders: 180, revenue: '5,800 ج.م', growth: '+22%', status: 'مرتفع', statusColor: 'bg-[#DCFCE7] text-[#166534]', growthColor: 'text-[#009D2F]' },
  { name: 'أخرى', orders: 90, revenue: '3,000 ج.م', growth: '0%', status: 'مستقر', statusColor: 'bg-[#F1F5F9] text-[#475569]', growthColor: 'text-[#607189]' },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50/50 font-sans" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-6 w-full">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
              <PlusCircle className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-primary">Healup</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
              <Bell className="h-5 w-5 text-slate-500" />
              <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
              <User className="h-5 w-5 text-slate-500" />
            </button>
            <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-slate-200">
              <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150" />
              <AvatarFallback>UN</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8 space-y-8">
        {/* Title Section */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900">Order Analytics</h1>
          <p className="text-slate-500">Comprehensive overview of pharmacy sales performance</p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-none shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Total revenue</CardTitle>
            </CardHeader>
            <CardContent className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">45,000 EGP</div>
              <Badge variant="secondary" className="bg-[#DCFCE7] text-[#009C31] border-none">+12%</Badge>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Completed orders</CardTitle>
            </CardHeader>
            <CardContent className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">1,250</div>
              <Badge variant="secondary" className="bg-[#DCFCE7] text-[#009C31] border-none">+5%</Badge>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Average order value</CardTitle>
            </CardHeader>
            <CardContent className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">85 EGP</div>
              <Badge variant="secondary" className="bg-[#DCFCE7] text-[#009C31] border-none">+2%</Badge>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Customer satisfaction</CardTitle>
            </CardHeader>
            <CardContent className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">98%</div>
              <Badge variant="secondary" className="bg-[#DCFCE7] text-[#009C31] border-none">+1%</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Revenue Trend */}
          <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Daily revenue trends</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-bold">315,000 EGP</span>
                  <span className="text-xs text-green-600 font-medium">8% higher than last week</span>
                </div>
              </div>
              <Badge variant="outline" className="text-slate-500 font-normal">Last 7 days</Badge>
            </CardHeader>
            <CardContent className="p-0 pt-4">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0456AE" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#0456AE" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      dy={10}
                      interval={0}
                    />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                        textAlign: 'right'
                      }}
                      labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                      cursor={{ stroke: '#0456AE', strokeWidth: 2, strokeDasharray: '5 5' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#0456AE" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top Medicines */}
          <Card className="lg:col-span-1 border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Top 5 requested medicines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {topMedicines.map((med, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700">{med.name}</span>
                    <span className="text-slate-500">{med.orders} orders</span>
                  </div>
                  <Progress 
                    value={med.percentage} 
                    className="h-2 bg-slate-100" 
                    indicatorClassName="bg-[#0456AE]"
                  />
                </div>
              ))}
              <button className="w-full text-center text-sm font-medium text-primary hover:underline mt-4">
                View full list
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Category Table */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Order distribution by category</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-slate-100">
                  <TableHead className="text-right text-[#5A6C85]">Category</TableHead>
                  <TableHead className="text-right text-[#5A6C85]">Orders</TableHead>
                  <TableHead className="text-right text-[#5A6C85]">Revenue</TableHead>
                  <TableHead className="text-right text-[#5A6C85]">Growth</TableHead>
                  <TableHead className="text-right text-[#5A6C85]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((cat, i) => (
                  <TableRow key={i} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-medium text-primary">{cat.name}</TableCell>
                    <TableCell>{cat.orders}</TableCell>
                    <TableCell>{cat.revenue}</TableCell>
                    <TableCell className={cat.growthColor}>
                      {cat.growth}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${cat.statusColor} border-none shadow-none font-medium`}>
                        {cat.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t bg-white py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-slate-500 flex items-center gap-1">
            <span className="font-bold text-[#0058B0]">Healup</span>
            <span>© 2024 Smart pharmacy analytics</span>
          </div>
          <div className="flex gap-6 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-primary transition-colors">Reports</a>
            <a href="#" className="hover:text-primary transition-colors">Settings</a>
            <a href="#" className="hover:text-primary transition-colors">Technical Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
