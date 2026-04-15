"use client";

import type { ReactNode } from "react";
import { Bell, ShoppingCart, UserCircle2 } from "lucide-react";
import Link from "next/link";
import PatientSidebar from "./PatientSidebar";
import styles from "./PatientSidebar.module.css";

type ActiveKey = "home" | "cart" | "orders" | "history" | "profile";

export default function PatientShell({ children, active }: { children: ReactNode; active: ActiveKey }) {
  const showSharedNavbar = active !== "home";

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
              <Link href="/patient-review-orders" className={styles.topbarIconBtn} aria-label="notifications">
                <Bell size={20} />
              </Link>
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
