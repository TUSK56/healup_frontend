import api from './apiService';

export interface PatientMe {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  date_of_birth?: string | null;
  avatar_url?: string | null;
}

export interface UpdatePatientMePayload {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  dateOfBirth?: string | null; // ISO
}

export interface ChangePatientPasswordPayload {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

export interface PatientAddress {
  id: number;
  label: string;
  icon_key: string;
  city?: string | null;
  district?: string | null;
  address_details?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  created_at?: string;
}

export interface CreatePatientAddressPayload {
  label: string;
  iconKey: string;
  city?: string | null;
  district?: string | null;
  addressDetails?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export const patientService = {
  async getMe() {
    const res = await api.get<{ data: PatientMe }>('/patient/me');
    return res.data;
  },

  async updateMe(payload: UpdatePatientMePayload) {
    const res = await api.patch<{ message: string; data: PatientMe }>('/patient/me', payload);
    return res.data;
  },

  async changePassword(payload: ChangePatientPasswordPayload) {
    const res = await api.post<{ message: string }>('/patient/change-password', payload);
    return res.data;
  },

  async uploadAvatar(file: File) {
    const form = new FormData();
    form.append('avatar', file);
    const res = await api.post<{ message: string; avatar_url: string }>('/patient/avatar', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  async listAddresses() {
    const res = await api.get<{ data: PatientAddress[] }>('/patient/addresses');
    return res.data;
  },

  async createAddress(payload: CreatePatientAddressPayload) {
    const body = {
      label: (payload.label || '').trim(),
      iconKey: (payload.iconKey || '').trim(),
      city: payload.city ?? null,
      district: payload.district ?? null,
      addressDetails: payload.addressDetails ?? null,
      latitude: payload.latitude ?? null,
      longitude: payload.longitude ?? null,
    };

    const res = await api.post<{ message: string; data: PatientAddress }>('/patient/addresses', body);
    return res.data;
  },

  async deleteAddress(id: number) {
    const res = await api.delete<{ message: string }>(`/patient/addresses/${id}`);
    return res.data;
  },
};

