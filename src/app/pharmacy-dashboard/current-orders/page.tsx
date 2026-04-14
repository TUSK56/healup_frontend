"use client";

import PharmacySidebar from "@/components/pharmacy/PharmacySidebar";
import PharmacyTopNavbar from "@/components/pharmacy/PharmacyTopNavbar";
import PharmacyCurrentOrdersContent from "@/components/pharmacy/views/PharmacyCurrentOrdersContent";

export default function PharmacyCurrentOrdersPage() {
  return (
    <div className="pharmacyDashboard">
      <PharmacySidebar active="current-orders" />

      <div className="main" style={{ padding: 0 }}>
        <PharmacyTopNavbar />
        <div className="pharmacy-content-shell">
          <PharmacyCurrentOrdersContent />
        </div>
      </div>
    </div>
  );
}
