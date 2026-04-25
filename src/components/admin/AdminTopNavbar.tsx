"use client";

import React from "react";
import { Bell, LogOut, Search, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { adminService, AdminNotification } from "@/services/adminService";
import { authService } from "@/services/authService";
import { getNotifications } from "@/lib/notificationCenter";
import { useLocale } from "@/contexts/LocaleContext";

function toLocaleTime(value: string | null | undefined, locale: "ar" | "en"): string {
  const v = (value || "").trim();
  if (!v) return "";
  const d = /[zZ]$/.test(v) || /[+-]\d\d:?\d\d$/.test(v) ? new Date(v) : new Date(`${v}Z`);
  if (!Number.isFinite(d.getTime())) return "";
  return d.toLocaleString(locale === "ar" ? "ar-EG" : "en-US", { dateStyle: "short", timeStyle: "short" });
}

export default function AdminTopNavbar() {
  const { locale, isRTL, t, toggleLocale } = useLocale();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [unread, setUnread] = React.useState<AdminNotification[]>([]);
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const profileRef = React.useRef<HTMLDivElement | null>(null);

  const loadNotifications = React.useCallback(async () => {
    if (document.visibilityState !== "visible") return;
    setLoading(true);
    try {
      const rows = (await getNotifications({ force: true })) as AdminNotification[];
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
    }, 30000);

    const onRealtime = () => {
      void loadNotifications();
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        void loadNotifications();
      }
    };

    window.addEventListener("healup:notification", onRealtime as EventListener);
    window.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("healup:notification", onRealtime as EventListener);
      window.removeEventListener("visibilitychange", onVisibility);
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
        <Search className="pointer-events-none absolute end-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          name="admin-global-search"
          placeholder={t("common.searchPlaceholderAdmin")}
          className="w-full rounded-xl border-none bg-slate-50 py-2.5 ps-4 pe-11 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/20"
          autoComplete="off"
        />
      </div>

      <div className="flex shrink-0 items-center gap-4 sm:gap-6">
        <div className="relative" ref={wrapRef}>
          <button
            type="button"
            className="relative rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100"
            aria-label={t("common.notifications")}
            onClick={() => setOpen((v) => !v)}
          >
            <Bell size={22} />
            {unread.length > 0 ? <span className="absolute end-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-red-500" /> : null}
          </button>

          {open ? (
            <div className="absolute start-0 top-12 z-40 w-[340px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
              <div className="border-b border-slate-100 px-4 py-3 text-sm font-bold text-slate-900">{t("common.newNotifications")}</div>
              <div className="max-h-80 overflow-y-auto">
                {loading ? (
                  <p className="px-4 py-4 text-sm text-slate-500">{t("common.loadingNotifications")}</p>
                ) : unread.length === 0 ? (
                  <p className="px-4 py-4 text-sm text-slate-500">{t("common.noNewNotifications")}</p>
                ) : (
                  unread.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => void onOpenNotification(n)}
                      className="block w-full border-b border-slate-100 px-4 py-3 text-start transition-colors hover:bg-slate-50"
                    >
                      <div className="text-sm font-medium text-slate-800">{n.message}</div>
                      <div className="mt-1 text-xs text-slate-400">{toLocaleTime(n.created_at, locale)}</div>
                    </button>
                  ))
                )}
              </div>
            </div>
          ) : null}
        </div>

        <button
          type="button"
          className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100"
          aria-label={t("common.changeLanguage")}
          title={t("common.changeLanguage")}
          onClick={toggleLocale}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 8l6 6" />
            <path d="M4 14l6-6 2-3" />
            <path d="M2 5h12" />
            <path d="M7 2h1" />
            <path d="M22 22l-5-10-5 10" />
            <path d="M14 18h6" />
          </svg>
        </button>

        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-3 rounded-xl border-e border-slate-200 pe-4 transition-colors hover:bg-slate-50 sm:pe-6"
          >
            <div className={isRTL ? "text-right" : "text-left"}>
              <p className="text-sm font-bold text-slate-900">أحمد علي</p>
              <p className="text-[10px] font-medium text-slate-400">{t("common.systemManager")}</p>
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
            <div className="absolute start-0 top-12 z-40 w-[190px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  router.push("/admin/settings");
                }}
                className="flex w-full items-center gap-2 border-b border-slate-100 px-4 py-3 text-start text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                <Settings size={15} />
                {t("common.settings")}
              </button>
              <button
                type="button"
                onClick={() => {
                  authService.logout();
                  setProfileOpen(false);
                  router.push("/admin-login");
                }}
                className="flex w-full items-center gap-2 px-4 py-3 text-start text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-50"
              >
                <LogOut size={15} />
                {t("common.logout")}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
