"use client";

import Link from "next/link";
import { authService } from "@/services/authService";
import { getCart } from "@/lib/cartStorage";
import styles from "./PatientSidebar.module.css";
import HealupLogo from "@/components/HealupLogo";
import { useI18n } from "@/i18n/I18nContext";

type Props = {
  open?: boolean;
  onClose?: () => void;
  mode?: "dynamic" | "static";
  active?: "home" | "cart" | "orders" | "history" | "profile";
};

export default function PatientSidebar({ open = true, onClose, mode = "dynamic", active = "home" }: Props) {
  const { t } = useI18n();

  if (mode === "dynamic" && !open) return null;

  const isLoggedIn = authService.getGuard() === "user" && !!authService.getToken();
  const item = (key: Props["active"], base: string) => (active === key ? `${base} ${styles.active}` : base);
  const cartCount = (getCart() ?? []).length;

  const sidebar = (
      <aside className={`${styles.panel} ${mode === "dynamic" ? styles.dynamicPanel : ""}`}>
        <div className={styles.header}>
          <HealupLogo href="/patient-home" onClick={onClose} />
          {mode === "dynamic" ? (
            <button type="button" onClick={onClose} className={styles.closeBtn}>
              ×
            </button>
          ) : null}
        </div>
        <nav className={styles.nav}>
          <Link href="/patient-home" className={item("home", styles.item)} onClick={onClose}>
            <span className={styles.icon}>▦</span>
            {t("patient.nav.home")}
          </Link>
          <Link href="/patient-cart" className={item("cart", styles.item)} onClick={onClose}>
            <span className={styles.icon}>🧺</span>
            {t("patient.nav.cart")}
            {cartCount > 0 ? <span className={styles.badge}>{cartCount}</span> : null}
          </Link>
          <Link href="/patient-review-orders" className={item("orders", styles.item)} onClick={onClose}>
            <span className={styles.icon}>🧾</span>
            {t("patient.nav.orders")}
          </Link>
          <Link href="/patient-review-order-history" className={item("history", styles.item)} onClick={onClose}>
            <span className={styles.icon}>🕒</span>
            {t("patient.nav.history")}
          </Link>
          <Link href="/patient-profile" className={item("profile", styles.item)} onClick={onClose}>
            <span className={styles.icon}>👤</span>
            {t("patient.nav.profile")}
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
              {t("common.logout")}
            </button>
          </div>
        ) : (
          <div className={styles.footer}>
            <Link href="/patient-login" className={styles.loginLink} onClick={onClose}>
              {t("common.login")}
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
