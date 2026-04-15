"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { notificationService, type AppNotification } from "@/services/notificationService";
import { authService } from "@/services/authService";
import { formatRelativeTimeAr } from "@/lib/formatRelativeAr";

const ORDER_TYPES = new Set([
  "new_order",
  "patient_confirmed_order",
  "order_status_updated",
  "order_confirmed_by_pharmacy",
]);

export default function PharmacyTopNavbar() {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [open, setOpen] = useState(false);

  const pharmacyUser = authService.getUser();
  const pharmacyName =
    typeof pharmacyUser?.name === "string" ? pharmacyUser.name : "صيدليتك";

  const load = useCallback(async () => {
    try {
      const data = await notificationService.list();
      setNotifications(data.data);
    } catch {
      // Keep page usable if notifications API is unavailable.
    }
  }, []);

  useEffect(() => {
    void load();
    const onNotification = () => void load();
    window.addEventListener("healup:notification", onNotification);
    return () => window.removeEventListener("healup:notification", onNotification);
  }, [load]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const openAndFocus = () => {
    setOpen((v) => !v);
    void load();
  };

  const navigateTo = async (n: AppNotification) => {
    try {
      if (!n.is_read) {
        await notificationService.markRead(n.id);
        setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, is_read: true } : x)));
      }
    } catch {
      // still navigate
    }
    setOpen(false);
    const route = n.route || "/pharmacy-dashboard/new-orders";
    router.push(route.startsWith("/") ? route : `/${route}`);
  };

  const orderNotifications = useMemo(
    () =>
      notifications.filter((n) => ORDER_TYPES.has(n.type) || /طلب|order/i.test(n.message)),
    [notifications]
  );

  const listToShow = orderNotifications.length > 0 ? orderNotifications : notifications;

  const showOrderBellDot = useMemo(
    () =>
      notifications.some(
        (n) =>
          !n.is_read &&
          (ORDER_TYPES.has(n.type) || /طلب|order|طلبات/i.test(n.message) || /order/i.test(n.type))
      ),
    [notifications]
  );

  return (
    <header className="topbar">
      <div className="search-bar">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input type="text" placeholder="بحث عن مريض أو دواء..." />
      </div>

      <div className="topbar-right">
        <div ref={panelRef} style={{ position: "relative" }}>
          <button
            className="topbar-icon-btn"
            type="button"
            style={{ position: "relative" }}
            aria-expanded={open}
            aria-haspopup="true"
            onClick={openAndFocus}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            {showOrderBellDot ? <span className="bell-dot" /> : null}
          </button>

          {open ? (
            <div
              className="pharmacy-notif-panel"
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                left: 0,
                width: 320,
                maxHeight: 360,
                overflowY: "auto",
                background: "#fff",
                border: "1px solid var(--border, #e2e8f0)",
                borderRadius: 12,
                boxShadow: "0 12px 40px rgba(15,23,42,0.12)",
                zIndex: 60,
                textAlign: "right",
              }}
            >
              <div
                style={{
                  padding: "10px 14px",
                  borderBottom: "1px solid #f1f5f9",
                  fontWeight: 800,
                  fontSize: 13,
                  color: "#0f172a",
                }}
              >
                الإشعارات
              </div>
              {listToShow.length === 0 ? (
                <div style={{ padding: 20, color: "#64748b", fontSize: 13 }}>لا توجد إشعارات بعد.</div>
              ) : (
                listToShow.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => void navigateTo(n)}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "right",
                      padding: "12px 14px",
                      border: "none",
                      borderBottom: "1px solid #f8fafc",
                      background: n.is_read ? "#fff" : "#f0f7ff",
                      cursor: "pointer",
                      fontSize: 13,
                      color: "#0f172a",
                    }}
                  >
                    <div style={{ fontWeight: n.is_read ? 500 : 700, marginBottom: 4 }}>{n.message}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>{formatRelativeTimeAr(n.created_at)}</div>
                  </button>
                ))
              )}
              <div style={{ padding: 10, borderTop: "1px solid #f1f5f9" }}>
                <Link
                  href="/pharmacy-dashboard/new-orders"
                  onClick={() => setOpen(false)}
                  style={{ fontSize: 12, color: "#1a56db", fontWeight: 700 }}
                >
                  الانتقال إلى طلبات جديدة ←
                </Link>
              </div>
            </div>
          ) : null}
        </div>

        <Link href="/pharmacy-dashboard/profile-settings" className="profile">
          <div className="profile-info">
            <div className="profile-name">{pharmacyName}</div>
            <div className="profile-role">مدير الصيدلية</div>
          </div>
          <div className="profile-avatar">👨‍⚕️</div>
        </Link>
      </div>
    </header>
  );
}
