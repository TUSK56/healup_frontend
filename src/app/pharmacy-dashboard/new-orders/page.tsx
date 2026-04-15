"use client";

import PharmacySidebar from "@/components/pharmacy/PharmacySidebar";
import PharmacyTopNavbar from "@/components/pharmacy/PharmacyTopNavbar";

export default function PharmacyNewOrdersPage() {
  return (
    <div className="pharmacyDashboard">
      <PharmacySidebar active="new-orders" />
      <div className="main" style={{ padding: 0 }}>
        <PharmacyTopNavbar />
        <div className="pharmacy-content-shell">
          <iframe src="/pharmacy_orders_1.html" title="Pharmacy Orders 1" className="h-full w-full border-0" />
        </div>
      </div>
    </div>
  );
}
