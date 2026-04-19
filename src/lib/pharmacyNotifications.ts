import { getNotifications, markManyNotificationsRead } from "@/lib/notificationCenter";

type PharmacyNotificationRow = {
  id: number;
  is_read: boolean;
  route?: string | null;
};

export async function consumePharmacyCurrentOrderNotifications(): Promise<void> {
  try {
    const rows = (await getNotifications({ force: true })) as PharmacyNotificationRow[];
    const targets = rows.filter(
      (n) =>
        !n.is_read &&
        String(n.route || "")
          .trim()
          .startsWith("/pharmacy-dashboard/current-orders")
    );

    if (targets.length === 0) return;

    await markManyNotificationsRead(targets.map((n) => n.id));

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("healup:notification"));
    }
  } catch {
    // best effort
  }
}