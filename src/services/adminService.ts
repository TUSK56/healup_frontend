import api from "./apiService";

export type AdminPharmacy = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  license_number?: string | null;
  city?: string | null;
  district?: string | null;
  address_details?: string | null;
  status: "pending" | "approved" | "disabled" | string;
  created_at: string;
};

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role: "patient" | string;
  created_at: string;
};

export type AdminOrder = {
  id: number;
  status: string;
  total_price: number;
  created_at: string;
  patient?: {
    id: number;
    name: string;
    phone?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  } | null;
  pharmacy?: {
    id: number;
    name: string;
    city?: string | null;
    district?: string | null;
    address_details?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  } | null;
  items?: Array<{
    medicine_name: string;
    quantity: number;
    price: number;
  }>;
};

export type AdminNotification = {
  id: number;
  type: string;
  message: string;
  is_read: boolean;
  created_at: string;
  route?: string | null;
};

export const adminService = {
  async listPharmacies() {
    const res = await api.get<{ data: AdminPharmacy[] }>("/admin/pharmacies");
    return res.data.data;
  },

  async approvePharmacy(id: number) {
    const res = await api.patch<{ message: string }>(`/admin/pharmacies/${id}/approve`);
    return res.data;
  },

  async disablePharmacy(id: number) {
    const res = await api.patch<{ message: string }>(`/admin/pharmacies/${id}/disable`);
    return res.data;
  },

  async listUsers() {
    const res = await api.get<{ data: AdminUser[] }>("/admin/users");
    return res.data.data;
  },

  async listOrders() {
    const res = await api.get<{ data: AdminOrder[] }>("/admin/orders");
    return res.data.data;
  },

  async listNotifications() {
    const res = await api.get<{ unread_count: number; data: AdminNotification[] }>("/notifications");
    return res.data;
  },

  async markNotificationRead(id: number) {
    const res = await api.patch<{ message: string }>(`/notifications/${id}/read`);
    return res.data;
  },

  async markAllNotificationsRead() {
    const res = await api.patch<{ message: string }>("/notifications/read-all");
    return res.data;
  },
};
