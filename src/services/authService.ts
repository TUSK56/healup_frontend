import api from './apiService';
import { AxiosError } from 'axios';

export type Guard = 'user' | 'pharmacy' | 'admin';

export interface PatientRegister {
  name: string;
  email: string;
  phone?: string;
  city?: string;
  district?: string;
  addressDetails?: string;
  password: string;
  passwordConfirmation: string;
  latitude?: number;
  longitude?: number;
}

export interface PharmacyRegister {
  name: string;
  email: string;
  phone?: string;
  licenseNumber?: string;
  responsiblePharmacistName?: string;
  city?: string;
  district?: string;
  addressDetails?: string;
  password: string;
  passwordConfirmation: string;
  latitude?: number;
  longitude?: number;
}

export interface LoginPayload {
  email: string;
  password: string;
  guard: Guard;
}

export interface OtpSendPayload {
  identifier: string;
  /** Narrows OTP lookup — maps `user` to patient accounts on the server */
  guard?: Guard | 'patient' | 'admin';
}

export interface OtpVerifyPayload {
  identifier: string;
  otp: string;
}

export interface OtpResponse {
  message: string;
  identifier: string;
  otp?: string;
  verified?: boolean;
}

export interface AuthResponse {
  message: string;
  user?: Record<string, unknown>;
  pharmacy?: Record<string, unknown>;
  token: string;
  token_type: string;
  expires_in?: number;
}

interface ApiErrorPayload {
  message?: string;
  errors?: Record<string, string[]>;
}

export const authService = {
  async registerPatient(data: PatientRegister) {
    const res = await api.post<AuthResponse>('/register/patient', data);
    return res.data;
  },

  async registerPharmacy(data: PharmacyRegister) {
    const res = await api.post<AuthResponse>('/register/pharmacy', data);
    return res.data;
  },

  async login(data: LoginPayload) {
    const res = await api.post<AuthResponse>('/login', data);
    return res.data;
  },

  async sendOtp(data: OtpSendPayload) {
    const raw = data.guard;
    const guard =
      raw === 'user'
        ? 'patient'
        : raw === undefined
          ? undefined
          : raw === 'patient'
            ? 'patient'
            : raw === 'admin'
              ? 'admin'
              : raw;
    const res = await api.post<OtpResponse>('/otp/send', {
      identifier: data.identifier,
      ...(guard ? { guard } : {}),
    });
    return res.data;
  },

  async verifyOtp(data: OtpVerifyPayload) {
    const res = await api.post<OtpResponse>('/otp/verify', data);
    return res.data;
  },

  async resetPasswordAfterOtp(data: {
    identifier: string;
    guard: 'patient' | 'pharmacy' | 'admin';
    newPassword: string;
    newPasswordConfirmation: string;
  }) {
    const res = await api.post<{ message: string }>('/password/reset-after-otp', {
      identifier: data.identifier,
      guard: data.guard,
      newPassword: data.newPassword,
      newPasswordConfirmation: data.newPasswordConfirmation,
    });
    return res.data;
  },

  setSession(data: AuthResponse, guard: Guard) {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('healup_guest');
    localStorage.setItem('healup_token', data.token);
    localStorage.setItem('healup_guard', guard);
    const entity = guard === 'pharmacy' ? data.pharmacy : data.user;
    localStorage.setItem('healup_user', JSON.stringify(entity || {}));
  },

  logout() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('healup_token');
    localStorage.removeItem('healup_user');
    localStorage.removeItem('healup_guard');
    localStorage.removeItem('healup_guest');
  },

  setGuestSession() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('healup_token');
    localStorage.removeItem('healup_user');
    localStorage.removeItem('healup_guard');
    localStorage.setItem('healup_guest', 'true');
  },

  isGuest(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('healup_guest') === 'true';
  },

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('healup_token');
  },

  getUser(): Record<string, unknown> | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem('healup_user');
    return raw ? JSON.parse(raw) : null;
  },

  getGuard(): Guard | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('healup_guard') as Guard | null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};

export function getAuthErrorMessage(error: unknown, fallbackMessage: string): string {
  const axiosError = error as AxiosError<ApiErrorPayload>;
  const payload = axiosError.response?.data;

  if (payload?.errors && typeof payload.errors === 'object') {
    const firstFieldErrors = Object.values(payload.errors).find(
      (messages) => Array.isArray(messages) && messages.length > 0
    );
    if (firstFieldErrors?.[0]) {
      return firstFieldErrors[0];
    }
  }

  if (payload?.message) {
    return payload.message;
  }

  return fallbackMessage;
}
