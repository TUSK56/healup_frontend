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
};
