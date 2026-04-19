"use client";

import type { ReactNode } from "react";
import React from "react";
import { Bell, LogOut, Settings, ShoppingCart, UserCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PatientSidebar from "./PatientSidebar";
import styles from "./PatientSidebar.module.css";
import { patientService } from "@/services/patientService";
import api from "@/services/apiService";
import { authService } from "@/services/authService";
import { isAvatarStorageKey, readAvatar, writeAvatar } from "@/lib/avatarStorage";

type ActiveKey = "home" | "cart" | "orders" | "history" | "profile";

type PatientNotification = {
  id: number;
  type: string;
  message: string;
  is_read: boolean;
  created_at: string;
  route?: string | null;
};

function toArabicTime(value?: string | null): string {
  const v = (value || "").trim();
  if (!v) return "";
  const d = /[zZ]$/.test(v) || /[+-]\d\d:?\d\d$/.test(v) ? new Date(v) : new Date(`${v}Z`);
  if (!Number.isFinite(d.getTime())) return "";
  return d.toLocaleString("ar-EG", { dateStyle: "short", timeStyle: "short" });
}

function parseRequestId(route: string): number | null {
  const q = route.split("?")[1] || "";
  const params = new URLSearchParams(q);
  const raw = params.get("requestId") || params.get("requestid") || params.get("request_id");
  const n = Number(raw || "0");
  return Number.isFinite(n) && n > 0 ? n : null;
}

export default function PatientShell({ children, active }: { children: ReactNode; active: ActiveKey }) {
  const router = useRouter();
  const showSharedNavbar = active !== "home";
  const [avatar, setAvatar] = React.useState<string | null>(null);
  const [notificationOpen, setNotificationOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [loadingNotifications, setLoadingNotifications] = React.useState(false);
  const [unreadNotifications, setUnreadNotifications] = React.useState<PatientNotification[]>([]);
  const notifWrapRef = React.useRef<HTMLDivElement | null>(null);
  const profileWrapRef = React.useRef<HTMLDivElement | null>(null);

  const loadNotifications = React.useCallback(async () => {
    setLoadingNotifications(true);
    try {
      const res = await api.get<{ unread_count?: number; data?: PatientNotification[] }>("/notifications");
      const rows = Array.isArray(res.data?.data) ? res.data.data : [];
      setUnreadNotifications(rows.filter((x) => !x.is_read));
    } catch {
      setUnreadNotifications([]);
    } finally {
      setLoadingNotifications(false);
    }
  }, []);

  const resolveTargetRoute = React.useCallback(async (notification: PatientNotification): Promise<string> => {
    const rawRoute = (notification.route || "").trim();
    const lowerType = (notification.type || "").toLowerCase();

    if (rawRoute.startsWith("/patient_after_pharmacy_confirmation.html")) {
      return rawRoute;
    }

    const requestId = parseRequestId(rawRoute);

    if (lowerType === "new_offer" && requestId) {
      try {
        const offersRes = await api.get<{ offers?: Array<{ response?: { id?: number } }> }>(`/requests/${requestId}/offers`);
        const offers = Array.isArray(offersRes.data?.offers) ? offersRes.data.offers : [];
        const responseId = Number(offers[0]?.response?.id || 0);
        if (Number.isFinite(responseId) && responseId > 0) {
          return `/patient_after_pharmacy_confirmation.html?requestId=${encodeURIComponent(String(requestId))}&responseId=${encodeURIComponent(String(responseId))}`;
        }
      } catch {
        // fallback below
      }

      return `/patient-review-orders?requestId=${encodeURIComponent(String(requestId))}`;
    }

    if (rawRoute.startsWith("/patient-offers") && requestId) {
      try {
        const offersRes = await api.get<{ offers?: Array<{ response?: { id?: number } }> }>(`/requests/${requestId}/offers`);
        const offers = Array.isArray(offersRes.data?.offers) ? offersRes.data.offers : [];
        const responseId = Number(offers[0]?.response?.id || 0);
        if (Number.isFinite(responseId) && responseId > 0) {
          return `/patient_after_pharmacy_confirmation.html?requestId=${encodeURIComponent(String(requestId))}&responseId=${encodeURIComponent(String(responseId))}`;
        }
      } catch {
        // fallback below
      }
      return `/patient-review-orders?requestId=${encodeURIComponent(String(requestId))}`;
    }

    return rawRoute || "/patient-review-orders";
  }, []);

  const onOpenNotification = React.useCallback(async (notification: PatientNotification) => {
    try {
      await api.patch(`/notifications/${notification.id}/read`);
    } catch {
      // best effort, continue navigation
    }

    setUnreadNotifications((prev) => prev.filter((x) => x.id !== notification.id));
    setNotificationOpen(false);

    const target = await resolveTargetRoute(notification);
    router.push(target);
  }, [resolveTargetRoute, router]);

  React.useEffect(() => {
    const load = async () => {
      let identity: number | string | undefined;
      try {
        const rawUser = localStorage.getItem("healup_user");
        const user = rawUser ? (JSON.parse(rawUser) as { id?: number | string; email?: string }) : {};
        identity = user?.id ?? user?.email;
      } catch {
        identity = undefined;
      }

      const localAvatar = readAvatar("patient", identity, { includeBackup: true, migrateLegacy: true });
      setAvatar(localAvatar);

      if (localAvatar) return;
      try {
        const me = await patientService.getMe();
        const fromApi = me?.data?.avatar_url || null;
        if (fromApi && fromApi.length > 10) {
          writeAvatar("patient", fromApi, me?.data?.id ?? me?.data?.email);
          setAvatar(fromApi);
        }
      } catch {
        // ignore non-critical avatar fetch errors
      }
    };
    void load();
    const onStorage = (e: StorageEvent) => {
      if (isAvatarStorageKey(e.key, "patient", undefined, { includeBackup: true })) void load();
    };
    const onCustom = () => {
      void load();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("healup:patient-profile-updated", onCustom as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("healup:patient-profile-updated", onCustom as EventListener);
    };
  }, []);

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
    if (!notificationOpen && !profileOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      const notifEl = notifWrapRef.current;
      const profileEl = profileWrapRef.current;
      if (notifEl && !notifEl.contains(target)) setNotificationOpen(false);
      if (profileEl && !profileEl.contains(target)) setProfileOpen(false);
    };

    window.addEventListener("mousedown", onPointerDown);
    return () => window.removeEventListener("mousedown", onPointerDown);
  }, [notificationOpen, profileOpen]);

  return (
    <div className={styles.shell}>
      <PatientSidebar mode="static" active={active} />
      <main className={`${styles.shellMain} ${showSharedNavbar ? styles.withTopbar : styles.homeMain}`}>
        {showSharedNavbar ? (
          <header className={styles.topbar}>
            <div className={styles.topbarActions}>
              <Link href="/patient-cart" className={styles.topbarIconBtn} aria-label="cart">
                <ShoppingCart size={20} />
              </Link>
              <div className={styles.notificationWrap} ref={notifWrapRef}>
                <button
                  type="button"
                  className={styles.topbarIconBtn}
                  aria-label="notifications"
                  onClick={() => setNotificationOpen((v) => !v)}
                >
                  <Bell size={20} />
                  {unreadNotifications.length > 0 ? <span className={styles.notificationDot} /> : null}
                </button>

                {notificationOpen ? (
                  <div className={styles.notificationPopup} role="dialog" aria-label="new notifications">
                    <div className={styles.notificationHeader}>الإشعارات الجديدة</div>
                    <div className={styles.notificationList}>
                      {loadingNotifications ? (
                        <p className={styles.notificationEmpty}>جاري تحميل الإشعارات...</p>
                      ) : unreadNotifications.length === 0 ? (
                        <p className={styles.notificationEmpty}>لا توجد إشعارات جديدة.</p>
                      ) : (
                        unreadNotifications.map((n) => (
                          <button
                            key={n.id}
                            type="button"
                            className={styles.notificationItem}
                            onClick={() => void onOpenNotification(n)}
                          >
                            <span className={styles.notificationItemMessage}>{n.message}</span>
                            <span className={styles.notificationItemTime}>{toArabicTime(n.created_at)}</span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
              <div className={styles.profileWrap} ref={profileWrapRef}>
                <button
                  type="button"
                  className={`${styles.topbarIconBtn} ${styles.topbarIconBtnActive}`}
                  aria-label="profile"
                  onClick={() => setProfileOpen((v) => !v)}
                >
                  {avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatar} alt="" style={{ width: 22, height: 22, borderRadius: 9999, objectFit: "cover" }} />
                  ) : (
                    <UserCircle2 size={20} />
                  )}
                </button>

                {profileOpen ? (
                  <div className={styles.profilePopup} role="dialog" aria-label="profile menu">
                    <Link
                      href="/patient-profile"
                      className={styles.profilePopupItem}
                      onClick={() => setProfileOpen(false)}
                    >
                      <Settings size={15} />
                      الإعدادات
                    </Link>
                    <button
                      type="button"
                      className={`${styles.profilePopupItem} ${styles.profilePopupItemDanger}`}
                      onClick={() => {
                        authService.logout();
                        setProfileOpen(false);
                        router.push("/patient-login");
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
        ) : null}
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}
