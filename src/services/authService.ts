import api from './apiService';
import { AxiosError } from 'axios';

export type Guard = 'user' | 'pharmacy' | 'admin';

export interface PatientRegister {
  name: string;
  email: string;
  phone?: string;
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
    const guard =
      data.guard === 'user' ? 'patient' : data.guard === 'pharmacy' ? 'pharmacy' : 'admin';
    const res = await api.post<AuthResponse>('/login', {
      email: data.email,
      password: data.password,
      guard,
    });
    return res.data;
  },

  async sendOtp(data: OtpSendPayload) {
    const res = await api.post<OtpResponse>('/otp/send', data);
    return res.data;
  },

  async verifyOtp(data: OtpVerifyPayload) {
    const res = await api.post<OtpResponse>('/otp/verify', data);
    return res.data;
  },

  setSession(data: AuthResponse, guard: Guard) {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('healup_guest');
    localStorage.setItem('healup_token', data.token);
    localStorage.setItem('healup_guard', guard);
    const entity = guard === 'pharmacy' ? data.pharmacy : data.user;
    localStorage.setItem('healup_user', JSON.stringify(entity || {}));
    const expMs = decodeJwtExpMs(data.token);
    if (expMs != null) {
      localStorage.setItem('healup_token_expires_at', String(expMs));
    } else {
      localStorage.removeItem('healup_token_expires_at');
    }
  },

  logout() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('healup_token');
    localStorage.removeItem('healup_user');
    localStorage.removeItem('healup_guard');
    localStorage.removeItem('healup_guest');
    localStorage.removeItem('healup_token_expires_at');
  },

  setGuestSession() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('healup_token');
    localStorage.removeItem('healup_user');
    localStorage.removeItem('healup_guard');
    localStorage.removeItem('healup_token_expires_at');
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

/** Client-side JWT `exp` (ms since epoch), for diagnostics / future refresh UX. */
function decodeJwtExpMs(token: string): number | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4;
    if (pad) base64 += '='.repeat(4 - pad);
    const json = atob(base64);
    const payload = JSON.parse(json) as { exp?: number };
    return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function getAuthErrorMessage(error: unknown, fallbackMessage: string): string {
  const axiosError = error as AxiosError<ApiErrorPayload>;
  if (!axiosError.response && axiosError.message === 'Network Error') {
    return 'تعذر الاتصال بالخادم. تأكد من تشغيل واجهة HealUp API وإعداد NEXT_PUBLIC_API_URL.';
  }
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
