/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Users, 
  UserCheck, 
  UserPlus, 
  Calendar, 
  Search, 
  Eye, 
  Edit2, 
  ChevronLeft, 
  ChevronRight,
  LayoutDashboard,
  Pill,
  ShoppingBag,
  BarChart3,
  Settings,
  Bell
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const patients = [
  {
    id: "PA-1029",
    name: "أحمد محمود السيد",
    email: "ahmed.m@email.com",
    phone: "010 1234 5678",
    joinDate: "12 أكتوبر 2023",
    status: "نشط",
    image: "https://picsum.photos/seed/ahmed/100/100"
  },
  {
    id: "PA-1030",
    name: "سارة علي حسن",
    email: "sara.h@email.com",
    phone: "011 9876 5432",
    joinDate: "05 سبتمبر 2023",
    status: "نشط",
    image: "https://picsum.photos/seed/sara/100/100"
  },
  {
    id: "PA-1031",
    name: "محمد إبراهيم كمال",
    email: "faisal.k@email.com",
    phone: "012 4442 2211",
    joinDate: "20 أغسطس 2023",
    status: "غير نشط",
    image: "https://picsum.photos/seed/mohamed/100/100"
  },
  {
    id: "PA-1032",
    name: "منى عبد العزيز",
    email: "laila.m@email.com",
    phone: "015 1112 2233",
    joinDate: "15 يوليو 2023",
    status: "نشط",
    image: "https://picsum.photos/seed/mona/100/100"
  },
  {
    id: "PA-1033",
    name: "ياسين مصطفى",
    email: "youssef.g@email.com",
    phone: "010 7778 8999",
    joinDate: "02 يونيو 2023",
    status: "غير نشط",
    image: "https://picsum.photos/seed/yassin/100/100"
  }
];

const stats = [
  {
    title: "إجمالي المرضى",
    value: "1,240",
    subValue: "+12% من الشهر الماضي",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    title: "المرضى النشطون",
    value: "850",
    subValue: "68.5% من الإجمالي",
    icon: UserCheck,
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    title: "مرضى جدد",
    value: "120",
    subValue: "خلال الـ 30 يوم الماضية",
    icon: UserPlus,
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    title: "معدل المواعيد",
    value: "45",
    subValue: "موعد/يوم كمتوسط",
    icon: Calendar,
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  }
];

const navItems = [
  { name: "لوحة القيادة", icon: LayoutDashboard, active: false },
  { name: "إدارة الصيدليات", icon: Pill, active: false },
  { name: "إدارة المرضى", icon: Users, active: true },
  { name: "الطلبات", icon: ShoppingBag, active: false },
  { name: "التقارير", icon: BarChart3, active: false },
];

export default function App() {
  return (
    <div className="flex h-screen bg-slate-50/50 font-sans" dir="rtl">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-l border-slate-100 flex flex-col shrink-0">
        {/* Logo */}
        <div className="p-8 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-blue-900">Healup</h1>
            <div className="bg-blue-600 p-2 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">لوحة الإدارة</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item, index) => (
            <button
              key={index}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group",
                item.active 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <span className="font-medium text-sm">{item.name}</span>
              <item.icon className={cn(
                "h-5 w-5",
                item.active ? "text-white" : "text-slate-400 group-hover:text-slate-900"
              )} />
            </button>
          ))}
        </nav>

        {/* Bottom Settings */}
        <div className="p-6 border-t border-slate-50">
          <button className="w-full flex items-center justify-between px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all group">
            <span className="font-medium text-sm">الإعدادات</span>
            <Settings className="h-5 w-5 text-slate-400 group-hover:text-slate-900" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-end px-8 shrink-0">
          {/* Left: User Profile */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <h2 className="text-sm font-bold text-slate-900">أحمد علي</h2>
                <p className="text-[10px] text-slate-500">مدير النظام</p>
              </div>
              <Avatar className="h-11 w-11 border-2 border-white shadow-sm">
                <AvatarImage src="https://picsum.photos/seed/doctor/100/100" referrerPolicy="no-referrer" />
                <AvatarFallback>أ.ع</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* Title Section */}
          <section className="mb-8 text-right">
            <h2 className="text-3xl font-bold text-slate-900 mb-1">إدارة المرضى</h2>
            <p className="text-slate-500 text-sm">نظرة عامة على جميع المرضى المسجلين في المنصة</p>
          </section>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-none shadow-sm hover:shadow-md transition-shadow h-full relative overflow-hidden">
                  <CardContent className="p-6">
                    <div className={`${stat.bgColor} p-2.5 rounded-xl absolute top-6 left-6 shrink-0`}>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500 mb-4">{stat.title}</p>
                      <h3 className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                      <p className={`text-xs ${stat.title === "إجمالي المرضى" ? "text-green-600" : "text-slate-400"}`}>
                        {stat.subValue}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Search and Table Section */}
          <Card className="border-none shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <div className="relative max-w-2xl">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="بحث عن مريض بالاسم، البريد الإلكتروني أو رقم الهاتف..." 
                  className="pr-10 bg-slate-50 border-none focus-visible:ring-blue-500/20"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="text-right font-bold text-slate-900">المريض</TableHead>
                    <TableHead className="text-right font-bold text-slate-900">البريد الإلكتروني</TableHead>
                    <TableHead className="text-right font-bold text-slate-900">رقم الهاتف</TableHead>
                    <TableHead className="text-right font-bold text-slate-900">تاريخ الانضمام</TableHead>
                    <TableHead className="text-right font-bold text-slate-900">الحالة</TableHead>
                    <TableHead className="text-right font-bold text-slate-900">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient, index) => (
                    <TableRow key={index} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={patient.image} referrerPolicy="no-referrer" />
                            <AvatarFallback>{patient.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-slate-900">{patient.name}</p>
                            <p className="text-xs text-slate-500">ID: {patient.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600">{patient.email}</TableCell>
                      <TableCell className="text-slate-600">{patient.phone}</TableCell>
                      <TableCell className="text-slate-600">{patient.joinDate}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={
                            patient.status === "نشط" 
                              ? "bg-green-50 text-green-700 hover:bg-green-50 border-none w-fit" 
                              : "bg-slate-100 text-slate-600 hover:bg-slate-100 border-none w-fit"
                          }
                        >
                          {patient.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
              <p className="text-sm text-slate-500 order-2 sm:order-1">
                عرض 1 إلى 5 من أصل 1,240 مريض
              </p>
              <div className="flex items-center gap-2 order-1 sm:order-2">
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="default" className="h-9 w-9 bg-blue-600 hover:bg-blue-700">1</Button>
                <Button variant="outline" className="h-9 w-9">2</Button>
                <Button variant="outline" className="h-9 w-9">3</Button>
                <span className="px-2 text-slate-400">...</span>
                <Button variant="outline" className="h-9 w-9">24</Button>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Footer */}
          <footer className="mt-12 text-center text-slate-400 text-sm">
            <p>© 2024 Healup Admin. جميع الحقوق محفوظة.</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
