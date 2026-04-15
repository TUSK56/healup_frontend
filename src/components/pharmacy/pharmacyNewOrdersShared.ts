import type { Order } from "@/services/orderService";
import type { IncomingMedicineRequestRow } from "@/services/pharmacyPortalService";

export const DISMISS_KEY = "healup_pharmacy_dismissed_requests";

export function readDismissed(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(DISMISS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as unknown;
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "number") : [];
  } catch {
    return [];
  }
}

export function writeDismissed(ids: number[]) {
  sessionStorage.setItem(DISMISS_KEY, JSON.stringify(ids));
}

export type UnifiedRow =
  | {
      kind: "medicine";
      key: string;
      patientName: string;
      medicineLabel: string;
      hasRx: boolean;
      rxUrl: string | null;
      timeIso: string;
      requestId: number;
      medicines: IncomingMedicineRequestRow["request"]["medicines"];
    }
  | {
      kind: "purchase";
      key: string;
      patientName: string;
      medicineLabel: string;
      timeIso: string;
      order: Order;
    };

export function buildUnifiedRows(
  incoming: IncomingMedicineRequestRow[],
  pendingPurchase: Order[],
  dismissed: number[]
): UnifiedRow[] {
  const list: UnifiedRow[] = [];
  for (const row of incoming) {
    if (dismissed.includes(row.request.id)) continue;
    const meds = row.request.medicines.map((m) => `${m.medicine_name} ×${m.quantity}`).join("، ");
    const rx = row.request.prescription_url;
    list.push({
      kind: "medicine",
      key: `m-${row.request.id}`,
      patientName: row.request.patient?.name ?? "مريض",
      medicineLabel: meds || (rx ? "وصفة طبية" : "—"),
      hasRx: !!rx,
      rxUrl: rx,
      timeIso: row.request.created_at,
      requestId: row.request.id,
      medicines: row.request.medicines,
    });
  }
  for (const o of pendingPurchase) {
    const meds = o.items?.map((i) => `${i.medicine_name} ×${i.quantity}`).join("، ") ?? "—";
    list.push({
      kind: "purchase",
      key: `p-${o.id}`,
      patientName: o.patient?.name ?? "مريض",
      medicineLabel: meds,
      timeIso: o.created_at,
      order: o,
    });
  }
  return list.sort((a, b) => new Date(b.timeIso).getTime() - new Date(a.timeIso).getTime());
}

/** Count of medicine requests not dismissed + pending purchase orders (matches table rows). */
export function countActionableNewOrders(
  incoming: IncomingMedicineRequestRow[],
  pendingPurchase: Order[],
  dismissed: number[]
): number {
  const incomingCount = incoming.filter((r) => !dismissed.includes(r.request.id)).length;
  return incomingCount + pendingPurchase.length;
}
