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

export const adminService = {
  async listPharmacies() {
    const res = await api.get<{ data: AdminPharmacyRow[] }>("/admin/pharmacies");
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
