"use client";

/**
 * Top bar aligned with reference: pages/admin-home-page_1 (App.tsx header).
 */
import { Bell, Search } from "lucide-react";

export default function AdminTopNavbar() {
  return (
    <header className="sticky top-0 z-30 flex h-20 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-8">
      <div className="relative w-full max-w-md min-w-0 sm:max-w-lg md:w-96">
        <Search className="pointer-events-none absolute right-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          name="admin-global-search"
          placeholder="البحث عن طلبات، مرضى، أو صيدليات..."
          className="w-full rounded-xl border-none bg-slate-50 py-2.5 pl-4 pr-11 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/20"
          autoComplete="off"
        />
      </div>

      <div className="flex shrink-0 items-center gap-4 sm:gap-6">
        <button
          type="button"
          className="relative rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100"
          aria-label="الإشعارات"
        >
          <Bell size={22} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
        </button>

        <div className="flex items-center gap-3 border-r border-slate-200 pr-4 sm:pr-6">
          <div className="text-left">
            <p className="text-sm font-bold text-slate-900">أحمد علي</p>
            <p className="text-[10px] font-medium text-slate-400">مدير النظام</p>
          </div>
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-white bg-orange-100 shadow-sm">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed"
              alt=""
              className="h-full w-full"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
