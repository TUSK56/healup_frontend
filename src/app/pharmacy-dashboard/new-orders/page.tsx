"use client";

import PharmacySidebar from "@/components/pharmacy/PharmacySidebar";
import PharmacyTopNavbar from "@/components/pharmacy/PharmacyTopNavbar";
import PharmacyNewOrdersSection from "@/components/pharmacy/PharmacyNewOrdersSection";

export default function PharmacyNewOrdersPage() {
  return (
    <div className="pharmacyDashboard">
      <PharmacySidebar active="new-orders" />
      <div className="main" style={{ padding: 0 }}>
        <PharmacyTopNavbar />
        <div className="pharmacy-content-shell">
          <PharmacyNewOrdersSection variant="page" />
        </div>
      </div>
    </div>
  );
}
