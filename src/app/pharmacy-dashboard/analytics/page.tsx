"use client";

import PharmacySidebar from "@/components/pharmacy/PharmacySidebar";
import PharmacyTopNavbar from "@/components/pharmacy/PharmacyTopNavbar";
import PharmacyAnalyticsContent from "@/components/pharmacy/views/PharmacyAnalyticsContent";

export default function PharmacyAnalyticsPage() {
  return (
    <div className="pharmacyDashboard">
      <PharmacySidebar active="analytics" />
      <div className="main" style={{ padding: 0 }}>
        <PharmacyTopNavbar />
        <div className="pharmacy-content-shell">
          <PharmacyAnalyticsContent />
        </div>
      </div>
    </div>
  );
}
