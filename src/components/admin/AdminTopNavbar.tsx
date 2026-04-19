"use client";

import React from "react";
import { Bell, LogOut, Search, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { adminService, AdminNotification } from "@/services/adminService";
import { authService } from "@/services/authService";

function toArabicTime(value?: string | null): string {
  const v = (value || "").trim();
  if (!v) return "";
  const d = /[zZ]$/.test(v) || /[+-]\d\d:?\d\d$/.test(v) ? new Date(v) : new Date(`${v}Z`);
  if (!Number.isFinite(d.getTime())) return "";
  return d.toLocaleString("ar-EG", { dateStyle: "short", timeStyle: "short" });
}

export default function AdminTopNavbar() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [unread, setUnread] = React.useState<AdminNotification[]>([]);
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const profileRef = React.useRef<HTMLDivElement | null>(null);

  const loadNotifications = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.listNotifications();
      const rows = Array.isArray(res.data) ? res.data : [];
      setUnread(rows.filter((x) => !x.is_read));
    } catch {
      setUnread([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const onOpenNotification = React.useCallback(
    async (n: AdminNotification) => {
      try {
        await adminService.markNotificationRead(n.id);
      } catch {
        // non-blocking
      }
      setUnread((prev) => prev.filter((x) => x.id !== n.id));
      setOpen(false);
      router.push((n.route || "/admin/dashboard").trim() || "/admin/dashboard");
    },
    [router]
  );

  React.useEffect(() => {
    void loadNotifications();

    const id = window.setInterval(() => {
      void loadNotifications();
    }, 15000);

    const onRealtime = () => {
      void loadNotifications();
    };

    window.addEventListener("healup:notification", onRealtime as EventListener);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("healup:notification", onRealtime as EventListener);
    };
  }, [loadNotifications]);

  React.useEffect(() => {
    if (!open && !profileOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      const notifEl = wrapRef.current;
      const profileEl = profileRef.current;
      if (notifEl && !notifEl.contains(target)) setOpen(false);
      if (profileEl && !profileEl.contains(target)) setProfileOpen(false);
    };

    window.addEventListener("mousedown", onPointerDown);
    return () => window.removeEventListener("mousedown", onPointerDown);
  }, [open, profileOpen]);

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
        <div className="relative" ref={wrapRef}>
          <button
            type="button"
            className="relative rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100"
            aria-label="الإشعارات"
            onClick={() => setOpen((v) => !v)}
          >
            <Bell size={22} />
            {unread.length > 0 ? <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-red-500" /> : null}
          </button>

          {open ? (
            <div className="absolute left-0 top-12 z-40 w-[340px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
              <div className="border-b border-slate-100 px-4 py-3 text-sm font-bold text-slate-900">الإشعارات الجديدة</div>
              <div className="max-h-80 overflow-y-auto">
                {loading ? (
                  <p className="px-4 py-4 text-sm text-slate-500">جاري تحميل الإشعارات...</p>
                ) : unread.length === 0 ? (
                  <p className="px-4 py-4 text-sm text-slate-500">لا توجد إشعارات جديدة.</p>
                ) : (
                  unread.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => void onOpenNotification(n)}
                      className="block w-full border-b border-slate-100 px-4 py-3 text-right transition-colors hover:bg-slate-50"
                    >
                      <div className="text-sm font-medium text-slate-800">{n.message}</div>
                      <div className="mt-1 text-xs text-slate-400">{toArabicTime(n.created_at)}</div>
                    </button>
                  ))
                )}
              </div>
            </div>
          ) : null}
        </div>

        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-3 rounded-xl border-r border-slate-200 pr-4 transition-colors hover:bg-slate-50 sm:pr-6"
          >
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
          </button>

          {profileOpen ? (
            <div className="absolute left-0 top-12 z-40 w-[190px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  router.push("/admin/settings");
                }}
                className="flex w-full items-center gap-2 border-b border-slate-100 px-4 py-3 text-right text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                <Settings size={15} />
                الإعدادات
              </button>
              <button
                type="button"
                onClick={() => {
                  authService.logout();
                  setProfileOpen(false);
                  router.push("/admin-login");
                }}
                className="flex w-full items-center gap-2 px-4 py-3 text-right text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-50"
              >
                <LogOut size={15} />
                تسجيل الخروج
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
