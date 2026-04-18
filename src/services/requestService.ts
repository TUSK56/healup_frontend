import api from './apiService';

export interface MedicineItem {
  medicine_name: string;
  quantity: number;
}

export interface CreateRequestPayload {
  prescription_url?: string;
  medicines: MedicineItem[];
  estimated_total?: number;
}

export interface Request {
  id: number;
  patient_id: number;
  prescription_url: string | null;
  estimated_total?: number | null;
  has_offers?: boolean;
  latest_offer_response_id?: number | null;
  /** From GET /requests list: pharmacy on the latest offer, when any. */
  latest_pharmacy_name?: string | null;
  /** Grand total (medicines + standard delivery + VAT) from latest offer prices; null if not computable. */
  latest_offer_grand_total?: number | null;
  /** True when latest_offer_grand_total is based on pharmacy line prices (not cart estimate). */
  uses_latest_offer_pricing?: boolean;
  status: string;
  expires_at: string;
  created_at: string;
  medicines?: { id: number; medicine_name: string; quantity: number }[];
}

export interface Offer {
  distance_km?: number | null;
  response: {
    id: number;
    pharmacy_id: number;
    delivery_fee: number;
    pharmacy?: {
      id: number;
      name: string;
      phone?: string | null;
      city?: string | null;
      district?: string | null;
      address_details?: string | null;
      latitude?: number | null;
      longitude?: number | null;
    };
    response_medicines?: { medicine_name: string; available: boolean; quantity_available: number; price: number }[];
  };
}

export const requestService = {
  async create(data: CreateRequestPayload, prescriptionFile?: File) {
    const formData = new FormData();
    formData.append('medicines', JSON.stringify(data.medicines));
    if (data.prescription_url) formData.append('prescription_url', data.prescription_url);
    if (typeof data.estimated_total === 'number') formData.append('estimated_total', String(data.estimated_total));
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

  async downloadInvoice(requestId: number) {
    const res = await api.get<Blob>(`/requests/${requestId}/invoice`, { responseType: 'blob' });
    return res.data;
  },
};
