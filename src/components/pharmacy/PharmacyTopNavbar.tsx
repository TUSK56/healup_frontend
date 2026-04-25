"use client";

import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { LogOut, Settings } from "lucide-react";
import api from "@/services/apiService";
import { authService } from "@/services/authService";
import { readAvatar } from "@/lib/avatarStorage";
import { getNotifications, markNotificationRead } from "@/lib/notificationCenter";

type PharmacyNotification = {
  id: number;
  type: string;
  message: string;
  is_read: boolean;
  created_at?: string | null;
  route?: string | null;
};

function toArabicTime(value?: string | null): string {
  const v = (value || "").trim();
  if (!v) return "";
  const d = /[zZ]$/.test(v) || /[+-]\d\d:?\d\d$/.test(v) ? new Date(v) : new Date(`${v}Z`);
  if (!Number.isFinite(d.getTime())) return "";
  return d.toLocaleString("ar-EG", { dateStyle: "short", timeStyle: "short" });
}

export default function PharmacyTopNavbar() {
  const router = useRouter();
  const [avatar, setAvatar] = React.useState<string | null>(null);
  const [name, setName] = React.useState("صيدلية");
  const [open, setOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [loadingNotifs, setLoadingNotifs] = React.useState(false);
  const [unread, setUnread] = React.useState<PharmacyNotification[]>([]);
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const profileRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const loadNotifs = async () => {
      if (document.visibilityState !== "visible") return;
      setLoadingNotifs(true);
      try {
        const rows = (await getNotifications({ force: true })) as PharmacyNotification[];
        setUnread(
          rows
            .filter((x) => !x.is_read)
            .sort(
              (a, b) =>
                new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime()
            )
        );
      } catch {
        setUnread([]);
      } finally {
        setLoadingNotifs(false);
      }
    };
    void loadNotifs();
    const t = window.setInterval(loadNotifs, 45_000);

    const onRealtime = () => {
      void loadNotifs();
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        void loadNotifs();
      }
    };

    window.addEventListener("healup:notification", onRealtime as EventListener);
    window.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(t);
      window.removeEventListener("healup:notification", onRealtime as EventListener);
      window.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  React.useEffect(() => {
    if (!open && !profileOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      const notifEl = wrapRef.current;
      const profileEl = profileRef.current;
      const target = event.target as Node;

      if (notifEl && !notifEl.contains(target)) setOpen(false);
      if (profileEl && !profileEl.contains(target)) setProfileOpen(false);
    };

    window.addEventListener("mousedown", onPointerDown);
    return () => window.removeEventListener("mousedown", onPointerDown);
  }, [open, profileOpen]);

  React.useEffect(() => {
    const load = () => {
      try {
        const rawUser = localStorage.getItem("healup_user");
        const user = rawUser ? (JSON.parse(rawUser) as { id?: number | string; email?: string; name?: string }) : {};
        const identity = user?.id ?? user?.email;
        const avatarUrl = readAvatar("pharmacy", identity, { migrateLegacy: true });
        setAvatar(avatarUrl);
        setName(String(user?.name || "صيدلية"));
      } catch {
        setAvatar(null);
        setName("صيدلية");
      }
    };
    load();
    window.addEventListener("storage", load);
    window.addEventListener("healup:pharmacy-profile-updated", load as EventListener);
    return () => {
      window.removeEventListener("storage", load);
      window.removeEventListener("healup:pharmacy-profile-updated", load as EventListener);
    };
  }, []);

  return (
    <header className="pharmacy-topbar">
      <div className="search-bar">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input type="text" placeholder="بحث عن مريض أو دواء..." />
      </div>

      <div className="topbar-right">
        <div className="notif-wrap" ref={wrapRef}>
          <button
            className="topbar-icon-btn"
            type="button"
            style={{ position: "relative" }}
            onClick={() => setOpen((v) => !v)}
            title="الإشعارات"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            {unread.length > 0 ? <span className="bell-dot" /> : null}
          </button>

          {open ? (
            <div className="notif-popup">
              <div className="notif-popup-head">الإشعارات الجديدة ({unread.length})</div>
              <div className="notif-popup-body">
                {loadingNotifs ? (
                  <p className="notif-popup-empty">جاري تحميل الإشعارات...</p>
                ) : unread.length === 0 ? (
                  <p className="notif-popup-empty">لا توجد إشعارات جديدة.</p>
                ) : (
                  unread.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      className="notif-item"
                      onClick={() => {
                        void (async () => {
                          try {
                            await markNotificationRead(n.id);
                          } catch {
                            // non-blocking
                          }
                          setUnread((prev) => prev.filter((x) => x.id !== n.id));
                          setOpen(false);
                          router.push((n.route || "/pharmacy-dashboard").trim() || "/pharmacy-dashboard");
                        })();
                      }}
                    >
                      <div className="notif-item-msg">{n.message}</div>
                      <div className="notif-item-time">{toArabicTime(n.created_at)}</div>
                    </button>
                  ))
                )}
              </div>
            </div>
          ) : null}
        </div>

        <button className="topbar-icon-btn" type="button" title="تغيير اللغة">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 8l6 6" />
            <path d="M4 14l6-6 2-3" />
            <path d="M2 5h12" />
            <path d="M7 2h1" />
            <path d="M22 22l-5-10-5 10" />
            <path d="M14 18h6" />
          </svg>
        </button>

        <div style={{ width: 1, height: 32, background: "var(--border)", margin: "0 4px" }} />

        <div className="profile-menu-wrap" ref={profileRef}>
          <button
            type="button"
            className="profile profile-trigger"
            onClick={() => setProfileOpen((v) => !v)}
            title="قائمة الحساب"
          >
            <div className="profile-info">
              <div className="profile-name">{name}</div>
              <div className="profile-role">مدير الصيدلية</div>
            </div>
            <div className="profile-avatar" style={{ overflow: "hidden" }}>
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                "👨‍⚕️"
              )}
            </div>
          </button>

          {profileOpen ? (
            <div className="profile-popup">
              <div className="profile-popup-headline">
                <div className="profile-popup-headline-avatar" style={{ overflow: "hidden" }}>
                  {avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    "👨‍⚕️"
                  )}
                </div>
                <div className="profile-popup-headline-text">
                  <div className="profile-popup-headline-name">{name}</div>
                  <div className="profile-popup-headline-role">مدير الصيدلية</div>
                </div>
              </div>

              <Link
                href="/pharmacy-dashboard/profile-settings"
                className="profile-popup-item"
                onClick={() => setProfileOpen(false)}
              >
                <Settings size={15} />
                الإعدادات
              </Link>
              <button
                type="button"
                className="profile-popup-item profile-popup-item-danger"
                onClick={() => {
                  authService.logout();
                  setProfileOpen(false);
                  router.push("/pharmacy-login");
                }}
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
