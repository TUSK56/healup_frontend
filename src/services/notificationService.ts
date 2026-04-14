import api from "./apiService";

export interface AppNotification {
  id: number;
  type: string;
  message: string;
  is_read: boolean;
  created_at: string;
  route: string;
}

export const notificationService = {
  async list() {
    const res = await api.get<{ unread_count: number; data: AppNotification[] }>("/notifications");
    return res.data;
  },

  async markRead(id: number) {
    const res = await api.patch<{ message: string }>(`/notifications/${id}/read`);
    return res.data;
  },

  async markAllRead() {
    const res = await api.patch<{ message: string }>("/notifications/read-all");
    return res.data;
  },
};
