import api from "./apiService";

export interface PharmacyMe {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  license_number: string | null;
  responsible_pharmacist_name: string | null;
  city: string | null;
  district: string | null;
  address_details: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface UpdatePharmacyMePayload {
  phone: string | null;
  email: string;
  city: string | null;
  district: string | null;
  addressDetails: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface ChangePharmacyPasswordPayload {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

/** Request rows: pharmacy sent an offer, patient has not created an order yet. */
export type AwaitingPatientOrderRow = {
  request_id: number;
  response_id: number;
  created_at: string;
  patient_name?: string | null;
  medicines?: Array<{ medicine_name: string; quantity: number }>;
};

export const pharmacyService = {
  async getAwaitingPatientOrders() {
    const { data } = await api.get<{ data: AwaitingPatientOrderRow[] }>("/pharmacy/awaiting-patient-orders");
    return data.data ?? [];
  },

  async getMe() {
    const { data } = await api.get<{ data: PharmacyMe }>("/pharmacy/me");
    return data.data;
  },

  async updateMe(payload: UpdatePharmacyMePayload) {
    const { data } = await api.patch<{ data: PharmacyMe }>("/pharmacy/me", {
      phone: payload.phone,
      email: payload.email,
      city: payload.city,
      district: payload.district,
      addressDetails: payload.addressDetails,
      latitude: payload.latitude,
      longitude: payload.longitude,
    });
    return data.data;
  },

  async changePassword(payload: ChangePharmacyPasswordPayload) {
    await api.post("/pharmacy/change-password", {
      currentPassword: payload.currentPassword,
      newPassword: payload.newPassword,
      newPasswordConfirmation: payload.newPasswordConfirmation,
    });
  },
};

