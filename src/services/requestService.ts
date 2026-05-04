import axios from 'axios';
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

  async downloadInvoice(requestId: number): Promise<Blob> {
    try {
      const res = await api.get<ArrayBuffer>(`/requests/${requestId}/invoice`, {
        responseType: 'arraybuffer',
        headers: { Accept: 'application/pdf, application/octet-stream;q=0.9, */*;q=0.8' },
      });
      const buf = res.data;
      if (!buf || buf.byteLength === 0) {
        throw new Error('empty_invoice');
      }
      const u8 = new Uint8Array(buf.slice(0, 4));
      const magicPdf = u8[0] === 0x25 && u8[1] === 0x50 && u8[2] === 0x44 && u8[3] === 0x46;
      if (magicPdf) return new Blob([buf], { type: 'application/pdf' });
      const head = new TextDecoder().decode(buf.slice(0, 512)).trimStart();
      if (head.startsWith('{') || head.startsWith('[')) {
        try {
          const j = JSON.parse(new TextDecoder().decode(buf)) as { message?: string };
          throw new Error(j?.message || 'invoice_not_ready');
        } catch (e) {
          if (e instanceof SyntaxError) throw new Error('invoice_not_pdf');
          throw e;
        }
      }
      return new Blob([buf], { type: 'application/pdf' });
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data instanceof ArrayBuffer) {
        const ab = err.response.data as ArrayBuffer;
        if (ab.byteLength > 0) {
          const raw = new TextDecoder().decode(ab.slice(0, Math.min(1024, ab.byteLength))).trimStart();
          if (raw.startsWith('{')) {
            try {
              const j = JSON.parse(new TextDecoder().decode(ab)) as { message?: string };
              throw new Error(j?.message || 'HealUp: تعذر تحميل الفاتورة.');
            } catch (e) {
              if (e instanceof SyntaxError) {
                throw err;
              }
              throw e;
            }
          }
        }
      }
      throw err;
    }
  },
};
