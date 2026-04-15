"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PharmacySidebar from "@/components/pharmacy/PharmacySidebar";
import PharmacyTopNavbar from "@/components/pharmacy/PharmacyTopNavbar";
import { orderService, type Order } from "@/services/orderService";
import PharmacyIncomingRequestsSection from "@/components/pharmacy/PharmacyIncomingRequestsSection";

export default function PharmacyNewOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [busyId, setBusyId] = useState<number | null>(null);

  const pendingOrders = useMemo(
    () => orders.filter((order) => order.status === "pending_pharmacy_confirmation"),
    [orders]
  );

  const loadOrders = async () => {
    try {
      const data = await orderService.list();
      setOrders(data.data);
    } catch {
      setOrders([]);
    }
  };

  useEffect(() => {
    loadOrders();
    const onNotification = () => loadOrders();
    window.addEventListener("healup:notification", onNotification);
    return () => window.removeEventListener("healup:notification", onNotification);
  }, []);

  const handleStatus = async (orderId: number, status: "confirmed" | "rejected") => {
    setBusyId(orderId);
    try {
      await orderService.updateStatus(orderId, status);
      await loadOrders();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="pharmacyDashboard">
      <PharmacySidebar active="new-orders" />
      <div className="main" style={{ padding: 0 }}>
        <PharmacyTopNavbar />
        <div className="pharmacy-content-shell">
          <div style={{ padding: 16 }}>
            <PharmacyIncomingRequestsSection />
            <h2 style={{ marginBottom: 12, fontWeight: 700 }}>طلبات شراء بانتظار موافقتك ({pendingOrders.length})</h2>
            <p style={{ marginBottom: 12, fontSize: 14, color: "#64748b" }}>
              بعد أن يختار المريض عرض صيدليتك ويُنشئ طلباً، يظهر الطلب هنا للموافقة أو الرفض.
            </p>
            <div className="section-card">
              <table className="orders-table" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>رقم الطلب</th>
                    <th>المريض</th>
                    <th>الإجمالي</th>
                    <th>العمليات</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingOrders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.patient?.name ?? "—"}</td>
                      <td>{order.total_price.toFixed(2)} ج.م</td>
                      <td>
                        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                          <button
                            type="button"
                            className="pill pill-green"
                            disabled={busyId === order.id}
                            onClick={() => handleStatus(order.id, "confirmed")}
                          >
                            موافقة
                          </button>
                          <button
                            type="button"
                            className="pill pill-red"
                            disabled={busyId === order.id}
                            onClick={() => handleStatus(order.id, "rejected")}
                          >
                            رفض
                          </button>
                          <button
                            type="button"
                            className="pill"
                            onClick={() => router.push("/pharmacy-dashboard/current-orders")}
                          >
                            عرض التفاصيل
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {pendingOrders.length === 0 ? <p style={{ textAlign: "center", padding: 18 }}>لا يوجد طلبات جديدة.</p> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
