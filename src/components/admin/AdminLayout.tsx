"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  Users,
  ShoppingCart,
  FileText,
  Settings,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AdminTopNavbar from "@/components/admin/AdminTopNavbar";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "لوحة القيادة", icon: LayoutDashboard },
  { href: "/admin/pharmacies", label: "إدارة الصيدليات", icon: Store },
  { href: "/admin/patients", label: "إدارة المرضى", icon: Users },
  { href: "/admin/orders", label: "الطلبات", icon: ShoppingCart },
  { href: "/admin/financial", label: "التقارير", icon: FileText },
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans" dir="rtl">
      <aside className="sticky top-0 z-40 flex h-screen w-72 shrink-0 flex-col border-l border-slate-200 bg-white p-6">
        <div className="mb-10 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0055B3] text-white">
            <Plus size={24} strokeWidth={3} />
          </div>
          <div>
            <h1 className="text-2xl font-bold leading-tight text-[#0055B3]">Healup</h1>
            <p className="text-xs font-medium text-slate-400">لوحة الإدارة</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-2">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200",
                  active
                    ? "bg-[#0055B3] font-medium text-white shadow-lg shadow-blue-900/20"
                    : "cursor-pointer text-slate-500 hover:bg-slate-100"
                )}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 pt-6">
          <button
            type="button"
            className="flex w-full cursor-default items-center gap-3 rounded-xl px-4 py-3 text-slate-500"
          >
            <Settings size={20} />
            <span className="font-medium">الإعدادات</span>
          </button>
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <AdminTopNavbar />
        <div className="min-h-0 flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
