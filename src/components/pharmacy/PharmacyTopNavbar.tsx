"use client";

import Link from "next/link";
import React from "react";
import api from "@/services/apiService";

export default function PharmacyTopNavbar() {
  const [avatar, setAvatar] = React.useState<string | null>(null);
  const [name, setName] = React.useState("صيدلية");
  const [notifUnread, setNotifUnread] = React.useState(0);

  React.useEffect(() => {
    const loadNotifs = async () => {
      try {
        const res = await api.get<{
          data: Array<{ type: string; is_read: boolean }>;
        }>("/notifications");
        const rows = res.data?.data || [];
        const n = rows.filter((x) => x.type === "new_request" && !x.is_read).length;
        setNotifUnread(n);
      } catch {
        setNotifUnread(0);
      }
    };
    void loadNotifs();
    const t = window.setInterval(loadNotifs, 30_000);
    return () => window.clearInterval(t);
  }, []);

  React.useEffect(() => {
    const load = () => {
      try {
        const avatarUrl = localStorage.getItem("healup_pharmacy_avatar");
        const rawUser = localStorage.getItem("healup_user");
        const user = rawUser ? JSON.parse(rawUser) : {};
        setAvatar(avatarUrl);
        setName(String(user?.name || "صيدلية"));
      } catch {
        setAvatar(null);
        setName("صيدلية");
      }
    };
    load();
    window.addEventListener("storage", load);
    window.addEventListener("healup:pharmacy-profile-updated", load as EventListener);
    return () => {
      window.removeEventListener("storage", load);
      window.removeEventListener("healup:pharmacy-profile-updated", load as EventListener);
    };
  }, []);

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
        <button
          className="topbar-icon-btn"
          type="button"
          style={{ position: "relative" }}
          onClick={() => {
            void (async () => {
              try {
                await api.patch("/notifications/read-all");
                setNotifUnread(0);
              } catch {
                // no-op
              }
            })();
          }}
          title="الإشعارات"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          {notifUnread > 0 ? <span className="bell-dot" /> : null}
        </button>

        <button className="topbar-icon-btn" type="button" title="تغيير اللغة">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 8l6 6" />
            <path d="M4 14l6-6 2-3" />
            <path d="M2 5h12" />
            <path d="M7 2h1" />
            <path d="M22 22l-5-10-5 10" />
            <path d="M14 18h6" />
          </svg>
        </button>

        <div style={{ width: 1, height: 32, background: "var(--border)", margin: "0 4px" }} />

        <Link href="/pharmacy-dashboard/profile-settings" className="profile">
          <div className="profile-info">
            <div className="profile-name">{name}</div>
            <div className="profile-role">مدير الصيدلية</div>
          </div>
          <div className="profile-avatar" style={{ overflow: "hidden" }}>
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              "👨‍⚕️"
            )}
          </div>
        </Link>
      </div>
    </header>
  );
}
