"use client";

import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { LogOut, Settings } from "lucide-react";
import api from "@/services/apiService";
import { authService } from "@/services/authService";
import { readAvatar } from "@/lib/avatarStorage";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useI18n } from "@/i18n/I18nContext";

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
  const { t } = useI18n();
  const [avatar, setAvatar] = React.useState<string | null>(null);
  const [name, setName] = React.useState("Pharmacy");
  const [open, setOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [loadingNotifs, setLoadingNotifs] = React.useState(false);
  const [unread, setUnread] = React.useState<PharmacyNotification[]>([]);
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const profileRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const loadNotifs = async () => {
      setLoadingNotifs(true);
      try {
        const res = await api.get<{
          data: PharmacyNotification[];
        }>("/notifications");
        const rows = res.data?.data || [];
        setUnread(rows.filter((x) => !x.is_read));
      } catch {
        setUnread([]);
      } finally {
        setLoadingNotifs(false);
      }
    };
    void loadNotifs();
    const t = window.setInterval(loadNotifs, 30_000);

    const onRealtime = () => {
      void loadNotifs();
    };

    window.addEventListener("healup:notification", onRealtime as EventListener);
    return () => {
      window.clearInterval(t);
      window.removeEventListener("healup:notification", onRealtime as EventListener);
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
        setName(String(user?.name || t("pharmacy.defaultName")));
      } catch {
        setAvatar(null);
        setName(t("pharmacy.defaultName"));
      }
    };
    window.addEventListener("storage", load);
    window.addEventListener("healup:pharmacy-profile-updated", load as EventListener);
    load();
    return () => {
      window.removeEventListener("storage", load);
      window.removeEventListener("healup:pharmacy-profile-updated", load as EventListener);
    };
  }, [t]);

  return (
    <header className="pharmacy-topbar">
      <div className="search-bar">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input type="text" placeholder={t("pharmacy.searchPlaceholder")} />
      </div>

      <div className="topbar-right">
        <div className="notif-wrap" ref={wrapRef}>
          <button
            className="topbar-icon-btn"
            type="button"
            style={{ position: "relative" }}
            onClick={() => setOpen((v) => !v)}
            title={t("common.notifications")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            {unread.length > 0 ? <span className="bell-dot" /> : null}
          </button>

          {open ? (
            <div className="notif-popup">
              <div className="notif-popup-head">{t("common.newNotifications")}</div>
              <div className="notif-popup-body">
                {loadingNotifs ? (
                  <p className="notif-popup-empty">{t("common.loadingNotifications")}</p>
                ) : unread.length === 0 ? (
                  <p className="notif-popup-empty">{t("common.noNotifications")}</p>
                ) : (
                  unread.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      className="notif-item"
                      onClick={() => {
                        void (async () => {
                          try {
                            await api.patch(`/notifications/${n.id}/read`);
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

        <LanguageSwitcher compact />

        <div style={{ width: 1, height: 32, background: "var(--border)", margin: "0 4px" }} />

        <div className="profile-menu-wrap" ref={profileRef}>
          <button
            type="button"
            className="profile profile-trigger"
            onClick={() => setProfileOpen((v) => !v)}
            title="Account menu"
          >
            <div className="profile-info">
              <div className="profile-name">{name}</div>
              <div className="profile-role">{t("pharmacy.managerRole")}</div>
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
                  <div className="profile-popup-headline-role">{t("pharmacy.managerRole")}</div>
                </div>
              </div>

              <Link
                href="/pharmacy-dashboard/profile-settings"
                className="profile-popup-item"
                onClick={() => setProfileOpen(false)}
              >
                <Settings size={15} />
                {t("common.settings")}
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
                {t("common.logout")}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
