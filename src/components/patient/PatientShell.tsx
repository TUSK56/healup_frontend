"use client";

import type { ReactNode } from "react";
import React from "react";
import { Bell, ShoppingCart, UserCircle2 } from "lucide-react";
import Link from "next/link";
import PatientSidebar from "./PatientSidebar";
import styles from "./PatientSidebar.module.css";

type ActiveKey = "home" | "cart" | "orders" | "history" | "profile";

export default function PatientShell({ children, active }: { children: ReactNode; active: ActiveKey }) {
  const showSharedNavbar = active !== "home";
  const [avatar, setAvatar] = React.useState<string | null>(null);

  React.useEffect(() => {
    const load = () => {
      const v = localStorage.getItem("healup_patient_avatar");
      setAvatar(v && v.length > 10 ? v : null);
    };
    load();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "healup_patient_avatar") load();
    };
    const onCustom = () => load();
    window.addEventListener("storage", onStorage);
    window.addEventListener("healup:patient-profile-updated", onCustom as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("healup:patient-profile-updated", onCustom as EventListener);
    };
  }, []);

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
                {avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatar} alt="" style={{ width: 22, height: 22, borderRadius: 9999, objectFit: "cover" }} />
                ) : (
                  <UserCircle2 size={20} />
                )}
              </Link>
            </div>
          </header>
        ) : null}
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}
