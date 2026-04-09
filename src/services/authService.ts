import api from './apiService';

export type Guard = 'user' | 'pharmacy';

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

export interface AuthResponse {
  message: string;
  user?: Record<string, unknown>;
  pharmacy?: Record<string, unknown>;
  token: string;
  token_type: string;
  expires_in: number;
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

  setSession(data: AuthResponse, guard: Guard) {
    if (typeof window === 'undefined') return;
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
