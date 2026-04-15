"use client";

import Link from "next/link";

export default function PharmacyTopNavbar() {
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
