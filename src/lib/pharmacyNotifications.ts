import api from "@/services/apiService";

type PharmacyNotificationRow = {
  id: number;
  is_read: boolean;
  route?: string | null;
};

export async function consumePharmacyCurrentOrderNotifications(): Promise<void> {
  try {
    const res = await api.get<{ data?: PharmacyNotificationRow[] }>("/notifications");
    const rows = Array.isArray(res.data?.data) ? res.data.data : [];
    const targets = rows.filter(
      (n) =>
        !n.is_read &&
        String(n.route || "")
          .trim()
          .startsWith("/pharmacy-dashboard/current-orders")
    );

    if (targets.length === 0) return;

    await Promise.all(
      targets.map((n) =>
        api.patch(`/notifications/${n.id}/read`).catch(() => {
          // best effort
        })
      )
    );

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("healup:notification"));
    }
  } catch {
    // best effort
  }
}