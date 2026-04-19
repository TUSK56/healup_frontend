"use client";



import Link from "next/link";

import React from "react";

import api from "@/services/apiService";
import HealupLogo from "@/components/HealupLogo";



type SidebarKey = "home" | "new-orders" | "current-orders" | "completed-orders" | "analytics" | "profile-settings";



export default function PharmacySidebar({ active }: { active: SidebarKey }) {

  const is = (key: SidebarKey) => (active === key ? "nav-item active" : "nav-item");

  const [incomingCount, setIncomingCount] = React.useState(0);



  React.useEffect(() => {

    const run = async () => {

      try {

        const res = await api.get<{ data: unknown[] }>("/pharmacy/requests");

        setIncomingCount(Array.isArray(res.data?.data) ? res.data.data.length : 0);

      } catch {

        setIncomingCount(0);

      }

    };

    void run();

    const t = window.setInterval(run, 60_000);

    return () => window.clearInterval(t);

  }, []);



  return (

    <aside className="sidebar">

      <div className="sidebar-logo">
        <HealupLogo href="/pharmacy-dashboard" />
      </div>



      <nav className="sidebar-nav">

        <Link className={is("home")} href="/pharmacy-dashboard">

          <div className="nav-icon">

            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">

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

              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">

                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 7V3.5L18.5 9H13zm-4 5h6v1.5H9V14zm0 3h4v1.5H9V17z" />

              </svg>

            </div>

            <span>طلبات جديدة</span>

          </div>

          <span className="nav-badge">{incomingCount}</span>

        </Link>

        <Link className={is("current-orders")} href="/pharmacy-dashboard/current-orders">

          <div className="nav-icon">

            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">

              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.5 5v5.25l4.5 2.67-.75 1.23L11 13V7h1.5z" />

            </svg>

          </div>

          <span>الطلبات الحالية</span>

        </Link>

        <Link className={is("completed-orders")} href="/pharmacy-dashboard/completed-orders">

          <div className="nav-icon">

            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">

              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5l-4-4 1.41-1.41L10 13.67l6.59-6.59L18 8.5l-8 8z" />

            </svg>

          </div>

          <span>الطلبات المكتملة</span>

        </Link>

        <Link className={is("analytics")} href="/pharmacy-dashboard/analytics">

          <div className="nav-icon">

            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">

              <path d="M5 20h2v-8H5v8zm4 0h2V4H9v16zm4 0h2v-5h-2v5zm4 0h2v-11h-2v11z" />

            </svg>

          </div>

          <span>التحليلات</span>

        </Link>

      </nav>



      <div className="sidebar-footer">

        <Link className={is("profile-settings")} href="/pharmacy-dashboard/profile-settings">

          <div className="nav-icon">

            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">

              <path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.49.49 0 00-.59-.22l-2.39.96a6.93 6.93 0 00-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />

            </svg>

          </div>

          <span>الإعدادات</span>

        </Link>

      </div>

    </aside>

  );

}

