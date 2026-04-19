import api from "@/services/apiService";

export type AppNotification = {
  id: number;
  type: string;
  message: string;
  is_read: boolean;
  created_at?: string | null;
  route?: string | null;
};

let notificationsCache: AppNotification[] = [];
let cacheUpdatedAt = 0;
let inFlightPromise: Promise<AppNotification[]> | null = null;

const CACHE_TTL_MS = 10_000;

export function invalidateNotificationsCache() {
  cacheUpdatedAt = 0;
}

export async function getNotifications(options?: { force?: boolean }): Promise<AppNotification[]> {
  const force = Boolean(options?.force);
  const now = Date.now();
  if (!force && cacheUpdatedAt > 0 && now - cacheUpdatedAt < CACHE_TTL_MS) {
    return notificationsCache;
  }

  if (!force && inFlightPromise) {
    return inFlightPromise;
  }

  inFlightPromise = api
    .get<{ data?: AppNotification[] }>("/notifications")
    .then((res) => {
      const rows = Array.isArray(res.data?.data) ? res.data.data : [];
      notificationsCache = rows;
      cacheUpdatedAt = Date.now();
      return rows;
    })
    .finally(() => {
      inFlightPromise = null;
    });

  return inFlightPromise;
}

export async function markNotificationRead(id: number): Promise<void> {
  await api.patch(`/notifications/${id}/read`);
  notificationsCache = notificationsCache.map((n) => (n.id === id ? { ...n, is_read: true } : n));
  cacheUpdatedAt = Date.now();
}

export async function markManyNotificationsRead(ids: number[]): Promise<void> {
  if (!ids.length) return;
  await Promise.all(ids.map((id) => api.patch(`/notifications/${id}/read`).catch(() => null)));
  const idSet = new Set(ids);
  notificationsCache = notificationsCache.map((n) => (idSet.has(n.id) ? { ...n, is_read: true } : n));
  cacheUpdatedAt = Date.now();
}
