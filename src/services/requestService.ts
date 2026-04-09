import api from './apiService';

export interface MedicineItem {
  medicine_name: string;
  quantity: number;
}

export interface CreateRequestPayload {
  prescription_url?: string;
  medicines: MedicineItem[];
}

export interface Request {
  id: number;
  patient_id: number;
  prescription_url: string | null;
  status: string;
  expires_at: string;
  created_at: string;
  medicines?: { id: number; medicine_name: string; quantity: number }[];
}

export interface Offer {
  response: {
    id: number;
    pharmacy_id: number;
    delivery_fee: number;
    pharmacy?: { id: number; name: string; latitude?: number; longitude?: number };
    response_medicines?: { medicine_name: string; available: boolean; quantity_available: number; price: number }[];
  };
  distance_km: number | null;
}

export const requestService = {
  async create(data: CreateRequestPayload, prescriptionFile?: File) {
    const formData = new FormData();
    formData.append('medicines', JSON.stringify(data.medicines));
    if (data.prescription_url) formData.append('prescription_url', data.prescription_url);
    if (prescriptionFile) formData.append('prescription', prescriptionFile);
    const res = await api.post<{ message: string; request: Request }>('/requests', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  async list() {
    const res = await api.get<{ data: Request[] }>('/requests');
    return res.data;
  },

  async get(id: number) {
    const res = await api.get<Request>(`/requests/${id}`);
    return res.data;
  },

  async delete(id: number) {
    const res = await api.delete(`/requests/${id}`);
    return res.data;
  },

  async getOffers(requestId: number) {
    const res = await api.get<{ request: Request; offers: Offer[] }>(`/requests/${requestId}/offers`);
    return res.data;
  },
};
