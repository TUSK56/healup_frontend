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
  { href: "/admin/dashboard", labelKey: "admin.nav.dashboard", icon: LayoutDashboard },
  { href: "/admin/pharmacies", labelKey: "admin.nav.pharmacies", icon: Store },
  { href: "/admin/patients", labelKey: "admin.nav.patients", icon: Users },
  { href: "/admin/orders", labelKey: "admin.nav.orders", icon: ShoppingCart },
  { href: "/admin/financial", labelKey: "admin.nav.reports", icon: FileText },
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { dir, t } = useLocale();
  const settingsActive = pathname === "/admin/settings";

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans" dir={dir}>
      <aside className="sticky top-0 z-40 flex h-screen w-72 shrink-0 flex-col border-s border-slate-200 bg-white p-6">
        <div className="mb-10 px-2">
          <HealupLogo href="/admin/dashboard" compact />
          <div>
            <p className="text-xs font-medium text-slate-400">{t("admin.panel")}</p>
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
                <span>{t(item.labelKey)}</span>
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
            <span>{t("common.settings")}</span>
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
