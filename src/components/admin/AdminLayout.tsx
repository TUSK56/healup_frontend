"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/contexts/LocaleContext";
import {
  LayoutDashboard,
  Store,
  Users,
  ShoppingCart,
  FileText,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AdminTopNavbar from "@/components/admin/AdminTopNavbar";
import RealtimeBridge from "@/components/RealtimeBridge";
import HealupLogo from "@/components/HealupLogo";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "لوحة القيادة", icon: LayoutDashboard },
  { href: "/admin/pharmacies", label: "إدارة الصيدليات", icon: Store },
  { href: "/admin/patients", label: "إدارة المرضى", icon: Users },
  { href: "/admin/orders", label: "الطلبات", icon: ShoppingCart },
  { href: "/admin/financial", label: "التقارير", icon: FileText },
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { locale } = useLocale();
  const settingsActive = pathname === "/admin/settings";

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans" dir={locale === "ar" ? "rtl" : "ltr"}>
      <aside className="sticky top-0 z-40 flex h-screen w-72 shrink-0 flex-col border-l border-slate-200 bg-white p-6">
        <div className="mb-10 px-2">
          <HealupLogo href="/admin/dashboard" compact />
          <div>
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
          <Link
            href="/admin/settings"
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200",
              settingsActive
                ? "bg-[#0055B3] font-medium text-white shadow-lg shadow-blue-900/20"
                : "cursor-pointer text-slate-500 hover:bg-slate-100"
            )}
          >
            <Settings size={20} />
            <span>الإعدادات</span>
          </Link>
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <RealtimeBridge />
        <AdminTopNavbar />
        <div className="min-h-0 flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
