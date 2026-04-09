/**
 * Session storage keys and helpers for cart, pending search, prescription
 */

export const STORAGE_KEYS = {
  CART: "healup_cart",
  PENDING_DRUG: "healup_pending_drug",
  PRESCRIPTION: "healup_prescription",
} as const;

export interface PendingDrug {
  name: string;
  type?: "tablets" | "drink";
  strength?: string;
  tabletCount?: string;
  drinkType?: string;
  volume?: string;
}

export interface CartItemData {
  id: string;
  name: string;
  desc: string;
  price: number;
  qty: number;
  emoji: string;
  gradient: string;
}

export interface PrescriptionData {
  imageBase64: string;
  addedAt: number;
}

export function getCart(): CartItemData[] | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(STORAGE_KEYS.CART);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CartItemData[];
  } catch {
    return null;
  }
}

export function setCart(items: CartItemData[]): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
}

export function getPendingDrug(): PendingDrug | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(STORAGE_KEYS.PENDING_DRUG);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PendingDrug;
  } catch {
    return null;
  }
}

export function setPendingDrug(drug: PendingDrug): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEYS.PENDING_DRUG, JSON.stringify(drug));
}

export function clearPendingDrug(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEYS.PENDING_DRUG);
}

export function getPrescription(): PrescriptionData | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(STORAGE_KEYS.PRESCRIPTION);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PrescriptionData;
  } catch {
    return null;
  }
}

export function setPrescription(imageBase64: string): void {
  if (typeof window === "undefined") return;
  const data: PrescriptionData = { imageBase64, addedAt: Date.now() };
  sessionStorage.setItem(STORAGE_KEYS.PRESCRIPTION, JSON.stringify(data));
}

export function clearPrescription(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEYS.PRESCRIPTION);
}
