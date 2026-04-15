"use client";

import PharmacySidebar from "@/components/pharmacy/PharmacySidebar";
import PharmacyTopNavbar from "@/components/pharmacy/PharmacyTopNavbar";
import PharmacyNewOrdersSection from "@/components/pharmacy/PharmacyNewOrdersSection";
import "./cart.css";

export default function PharmacyDashboardPage() {
  return (
    <div className="pharmacyDashboard">
      <PharmacySidebar active="home" />
      <div className="main" style={{ padding: 0 }}>
        <PharmacyTopNavbar />
        <div className="content" style={{ padding: "20px 24px 40px" }}>
          <PharmacyNewOrdersSection variant="home" homePreviewRows={8} />
        </div>
      </div>
    </div>
  );
}
