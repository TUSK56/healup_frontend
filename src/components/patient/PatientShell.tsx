"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { Bell, ShoppingCart, UserCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PatientSidebar from "./PatientSidebar";
import styles from "./PatientSidebar.module.css";
import { notificationService, type AppNotification } from "@/services/notificationService";
import { authService } from "@/services/authService";

type ActiveKey = "home" | "cart" | "orders" | "history" | "profile";

export default function PatientShell({ children, active }: { children: ReactNode; active: ActiveKey }) {
  const showSharedNavbar = active !== "home";
  const router = useRouter();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.is_read).length,
    [notifications]
  );

  useEffect(() => {
    const load = async () => {
      if (authService.isGuest() || authService.getGuard() !== "user" || !authService.getToken()) {
        setNotifications([]);
        return;
      }
      try {
        const data = await notificationService.list();
        setNotifications(data.data);
      } catch {
        // Keep navigation usable even if notifications API is unavailable.
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
      router.push("/patient-review-orders");
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

    router.push(latest.route || "/patient-review-orders");
  };

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
              <button type="button" onClick={openLatestNotification} className={styles.topbarIconBtn} aria-label="notifications">
                <Bell size={20} />
                {unreadCount > 0 ? <span className={styles.topbarDot} /> : null}
              </button>
              <Link href="/patient-profile" className={`${styles.topbarIconBtn} ${styles.topbarIconBtnActive}`} aria-label="profile">
                <UserCircle2 size={20} />
              </Link>
            </div>
          </header>
        ) : null}
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}
