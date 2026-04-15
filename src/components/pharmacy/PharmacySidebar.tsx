"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { authService } from "@/services/authService";
import { orderService, type Order } from "@/services/orderService";
import { pharmacyPortalService } from "@/services/pharmacyPortalService";
import { countActionableNewOrders, readDismissed } from "@/components/pharmacy/pharmacyNewOrdersShared";

type SidebarKey = "home" | "new-orders" | "current-orders" | "completed-orders" | "analytics" | "profile-settings";

export default function PharmacySidebar({ active }: { active: SidebarKey }) {
  const is = (key: SidebarKey) => (active === key ? "nav-item active" : "nav-item");
  const [newBadge, setNewBadge] = useState<number | null>(null);

  useEffect(() => {
    if (authService.getGuard() !== "pharmacy" || !authService.getToken()) {
      setNewBadge(null);
      return;
    }
    const load = async () => {
      try {
        const [ordersRes, reqRes] = await Promise.all([
          orderService.list().catch(() => ({ data: [] as Order[] })),
          pharmacyPortalService.incomingRequests().catch(() => ({ data: [] })),
        ]);
        const orders = ordersRes.data ?? [];
        const incoming = reqRes.data ?? [];
        const pendingPurchase = orders.filter((o) => o.status === "pending_pharmacy_confirmation");
        const dismissed = readDismissed();
        const n = countActionableNewOrders(incoming, pendingPurchase, dismissed);
        setNewBadge(n > 0 ? n : null);
      } catch {
        setNewBadge(null);
      }
    };
    void load();
    const on = () => void load();
    window.addEventListener("healup:notification", on);
    return () => window.removeEventListener("healup:notification", on);
  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Link href="/pharmacy-dashboard" className="logo-btn" aria-label="Healup">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <path d="M20 8h-4V6a2 2 0 00-2-2h-4a2 2 0 00-2 2v2H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V10a2 2 0 00-2-2z" />
            <path d="M12 8v8M8 12h8" />
          </svg>
        </Link>
        <Link href="/pharmacy-dashboard" className="logo-text" style={{ textDecoration: "none", color: "inherit" }}>
          Healup
        </Link>
      </div>

      <nav className="sidebar-nav">
        <Link className={is("home")} href="/pharmacy-dashboard">
          <div className="nav-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="nav-svg-fill">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
          <span>الرئيسية</span>
        </Link>

        <Link className={is("new-orders")} href="/pharmacy-dashboard/new-orders" style={{ justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div className="nav-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="nav-svg-fill">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 7V3.5L18.5 9H13zm-4 5h6v1.5H9V14zm0 3h4v1.5H9V17z" />
              </svg>
            </div>
            <span>طلبات جديدة</span>
          </div>
          {newBadge != null ? <span className="nav-badge">{newBadge > 99 ? "99+" : newBadge}</span> : null}
        </Link>

        <Link className={is("current-orders")} href="/pharmacy-dashboard/current-orders">
          <div className="nav-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="nav-svg-fill">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.5 5v5.25l4.5 2.67-.75 1.23L11 13V7h1.5z" />
            </svg>
          </div>
          <span>الطلبات الحالية</span>
        </Link>

        <Link className={is("completed-orders")} href="/pharmacy-dashboard/completed-orders">
          <div className="nav-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="nav-svg-fill">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5l-4-4 1.41-1.41L10 13.67l6.59-6.59L18 8.5l-8 8z" />
            </svg>
          </div>
          <span>الطلبات المكتملة</span>
        </Link>

        <Link className={is("analytics")} href="/pharmacy-dashboard/analytics">
          <div className="nav-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="nav-svg-fill">
              <path d="M5 20h2v-8H5v8zm4 0h2V4H9v16zm4 0h2v-5h-2v5zm4 0h2v-11h-2v11z" />
            </svg>
          </div>
          <span>التحليلات</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        <Link className={is("profile-settings")} href="/pharmacy-dashboard/profile-settings">
          <div className="nav-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="nav-svg-fill">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.49.49 0 00-.59-.22l-2.39.96a6.93 6.93 0 00-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
            </svg>
          </div>
          <span>الإعدادات</span>
        </Link>
      </div>
    </aside>
  );
}
