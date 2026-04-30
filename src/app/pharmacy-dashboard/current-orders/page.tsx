"use client";

import PharmacySidebar from "@/components/pharmacy/PharmacySidebar";
import PharmacyTopNavbar from "@/components/pharmacy/PharmacyTopNavbar";
import PharmacyCurrentOrdersContent from "@/components/pharmacy/views/PharmacyCurrentOrdersContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
