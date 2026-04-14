"use client";

import Link from "next/link";

type SidebarKey = "home" | "new-orders" | "current-orders" | "completed-orders" | "analytics" | "profile-settings";

export default function PharmacySidebar({ active }: { active: SidebarKey }) {
  const is = (key: SidebarKey) => (active === key ? "nav-item active" : "nav-item");

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <button className="logo-btn" type="button" aria-label="Healup logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <path d="M20 8h-4V6a2 2 0 00-2-2h-4a2 2 0 00-2 2v2H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V10a2 2 0 00-2-2z" />
            <path d="M12 8v8M8 12h8" />
          </svg>
        </button>
        <span className="logo-text">Healup</span>
      </div>

      <nav className="sidebar-nav">
        <Link className={is("home")} href="/pharmacy-dashboard">الرئيسية</Link>
        <Link className={is("new-orders")} href="/pharmacy-dashboard/new-orders">طلبات جديدة</Link>
        <Link className={is("current-orders")} href="/pharmacy-dashboard/current-orders">الطلبات الحالية</Link>
        <Link className={is("completed-orders")} href="/pharmacy-dashboard/completed-orders">الطلبات المكتملة</Link>
        <Link className={is("analytics")} href="/pharmacy-dashboard/analytics">التحليلات</Link>
      </nav>

      <div className="sidebar-footer">
        <Link className={is("profile-settings")} href="/pharmacy-dashboard/profile-settings">
          الإعدادات
        </Link>
      </div>
    </aside>
  );
}
