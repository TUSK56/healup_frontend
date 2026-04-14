"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { notificationService, type AppNotification } from "@/services/notificationService";

export default function PharmacyTopNavbar() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.is_read).length,
    [notifications]
  );

  useEffect(() => {
    const load = async () => {
      try {
        const data = await notificationService.list();
        setNotifications(data.data);
      } catch {
        // Keep page usable if notifications API is unavailable.
      }
    };

    load();
    const onNotification = () => load();
    window.addEventListener("healup:notification", onNotification);
    return () => window.removeEventListener("healup:notification", onNotification);
  }, []);

  const openLatestNotification = async () => {
    const latest = notifications.find((item) => !item.is_read) ?? notifications[0];
    if (!latest) {
      router.push("/pharmacy-dashboard/new-orders");
      return;
    }

    try {
      if (!latest.is_read) {
        await notificationService.markRead(latest.id);
        setNotifications((prev) =>
          prev.map((item) => (item.id === latest.id ? { ...item, is_read: true } : item))
        );
      }
    } catch {
      // Navigate even if mark-read fails.
    }

    router.push(latest.route || "/pharmacy-dashboard/new-orders");
  };

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
        <button className="topbar-icon-btn" type="button" style={{ position: "relative" }} onClick={openLatestNotification}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          {unreadCount > 0 ? <span className="bell-dot" /> : null}
        </button>
        <Link href="/pharmacy-dashboard/profile-settings" className="profile">
          <div className="profile-info">
            <div className="profile-name">صيدلية النهدي</div>
            <div className="profile-role">مدير الصيدلية</div>
          </div>
          <div className="profile-avatar">👨‍⚕️</div>
        </Link>
      </div>
    </header>
  );
}
