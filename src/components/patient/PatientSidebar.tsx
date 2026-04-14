"use client";

import Link from "next/link";
import { authService } from "@/services/authService";
import { getCart } from "@/lib/cartStorage";
import styles from "./PatientSidebar.module.css";

type Props = {
  open?: boolean;
  onClose?: () => void;
  mode?: "dynamic" | "static";
  active?: "home" | "cart" | "orders" | "history" | "profile";
};

export default function PatientSidebar({ open = true, onClose, mode = "dynamic", active = "home" }: Props) {
  if (mode === "dynamic" && !open) return null;

  const isLoggedIn = authService.getGuard() === "user" && !!authService.getToken();
  const item = (key: Props["active"], base: string) => (active === key ? `${base} ${styles.active}` : base);
  const cartCount = (getCart() ?? []).length;

  const sidebar = (
      <aside className={`${styles.panel} ${mode === "dynamic" ? styles.dynamicPanel : ""}`}>
        <div className={styles.header}>
          <Link href="/patient-home" className={styles.brandLink} onClick={onClose}>
            <span className={styles.logoIcon}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 3h6v3H9z" />
                <path d="M3 7h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z" />
                <line x1="12" y1="11" x2="12" y2="17" />
                <line x1="9" y1="14" x2="15" y2="14" />
              </svg>
            </span>
            <span className={styles.brand}>Healup</span>
          </Link>
          {mode === "dynamic" ? (
            <button type="button" onClick={onClose} className={styles.closeBtn}>
              ×
            </button>
          ) : null}
        </div>
        <nav className={styles.nav}>
          <Link href="/patient-home" className={item("home", styles.item)} onClick={onClose}>
            <span className={styles.icon}>▦</span>
            الرئيسية
          </Link>
          <Link href="/patient-cart" className={item("cart", styles.item)} onClick={onClose}>
            <span className={styles.icon}>🧺</span>
            سلة المشتريات
            {cartCount > 0 ? <span className={styles.badge}>{cartCount}</span> : null}
          </Link>
          <Link href="/patient-review-orders" className={item("orders", styles.item)} onClick={onClose}>
            <span className={styles.icon}>🧾</span>
            طلباتي
          </Link>
          <Link href="/patient-review-order-history" className={item("history", styles.item)} onClick={onClose}>
            <span className={styles.icon}>🕒</span>
            تاريخ الطلبات
          </Link>
          <Link href="/patient-profile" className={item("profile", styles.item)} onClick={onClose}>
            <span className={styles.icon}>👤</span>
            الملف الشخصي
          </Link>
        </nav>
        {isLoggedIn ? (
          <div className={styles.footer}>
            <button
              type="button"
              className={styles.logout}
              onClick={() => {
                authService.logout();
                onClose?.();
                window.location.assign("/patient-home");
              }}
            >
              تسجيل الخروج
            </button>
          </div>
        ) : (
          <div className={styles.footer}>
            <Link href="/patient-login" className={styles.loginLink} onClick={onClose}>
              تسجيل الدخول
            </Link>
          </div>
        )}
      </aside>
  );

  if (mode === "static") {
    return sidebar;
  }

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />
      {sidebar}
    </>
  );
}
