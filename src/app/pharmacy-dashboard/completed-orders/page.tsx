"use client";

import PharmacySidebar from "@/components/pharmacy/PharmacySidebar";
import PharmacyTopNavbar from "@/components/pharmacy/PharmacyTopNavbar";
import PharmacyCompletedOrdersContent from "@/components/pharmacy/views/PharmacyCompletedOrdersContent";

export default function PharmacyCompletedOrdersPage() {
  return (
    <div className="pharmacyDashboard">
      <PharmacySidebar active="completed-orders" />
      <div className="main" style={{ padding: 0 }}>
        <PharmacyTopNavbar />
        <div className="pharmacy-content-shell">
          <PharmacyCompletedOrdersContent />
        </div>
      </div>
    </div>
  );
}
