import api from "./apiService";

export interface IncomingRequestMedicine {
  id: number;
  medicine_name: string;
  quantity: number;
}

export interface IncomingMedicineRequestRow {
  request: {
    id: number;
    status: string;
    expires_at: string;
    medicines: IncomingRequestMedicine[];
  };
  distance_km: number | null;
}

export interface SubmitOfferMedicine {
  medicine_name: string;
  available: boolean;
  quantity_available: number;
  price: number;
}

export const pharmacyPortalService = {
  async incomingRequests() {
    const res = await api.get<{ data: IncomingMedicineRequestRow[] }>("/pharmacy/requests");
    return res.data;
  },

  async submitOffer(body: {
    request_id: number;
    delivery_fee: number;
    medicines: SubmitOfferMedicine[];
  }) {
    const res = await api.post<{ message: string }>("/pharmacy/respond", body);
    return res.data;
  },
};
