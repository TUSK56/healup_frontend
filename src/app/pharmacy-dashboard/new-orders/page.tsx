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
        <div className="content" style={{ padding: "20px 24px 40px" }}>
          <PharmacyNewOrdersSection variant="page" />
        </div>
      </div>
    </div>
  );
}
