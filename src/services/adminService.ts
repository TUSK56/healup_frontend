import api from "./apiService";

export interface AdminPharmacyRow {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  license_number: string | null;
  status: string;
  created_at: string;
}

export interface AdminUserRow {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  created_at: string;
}

export interface AdminOrderRow {
  id: number;
  status: string;
  total_price: number;
  created_at: string;
  patient: { id: number; name: string } | null;
  pharmacy: { id: number; name: string } | null;
  items: { medicine_name: string; quantity: number; price: number }[];
}

export const adminService = {
  async listPharmacies() {
    const res = await api.get<{ data: AdminPharmacyRow[] }>("/admin/pharmacies");
    return res.data;
  },

  async listUsers() {
    const res = await api.get<{ data: AdminUserRow[] }>("/admin/users");
    return res.data;
  },

  async listOrders() {
    const res = await api.get<{ data: AdminOrderRow[] }>("/admin/orders");
    return res.data;
  },

  async approvePharmacy(id: number) {
    const res = await api.patch<{ message: string }>(`/admin/pharmacies/${id}/approve`);
    return res.data;
  },

  async disablePharmacy(id: number) {
    const res = await api.patch<{ message: string }>(`/admin/pharmacies/${id}/disable`);
    return res.data;
  },
};
