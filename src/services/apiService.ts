import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

/** Backend base URL for server-side calls and for Next.js rewrites (see next.config.js). */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

/**
 * In the browser, call same-origin `/api/*` so Next.js proxies to the backend (avoids CORS).
 * On the server, use the absolute API URL.
 */
function resolveApiBaseURL(): string {
  if (typeof window !== 'undefined') {
    return '/api';
  }
  return `${API_URL}/api`;
}

export const api: AxiosInstance = axios.create({
  baseURL: resolveApiBaseURL(),
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/** Do not run global "logout redirect" on 401 for these routes — wrong password must surface on the form. */
function isUnauthenticatedAuthRequest(config: InternalAxiosRequestConfig | undefined): boolean {
  const url = config?.url ?? '';
  return (
    url === '/login' ||
    url.endsWith('/login') ||
    url.includes('/register/patient') ||
    url.includes('/register/pharmacy') ||
    url.includes('/otp/')
  );
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('healup_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !isUnauthenticatedAuthRequest(error.config)) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('healup_token');
        localStorage.removeItem('healup_user');
        localStorage.removeItem('healup_guard');
        const currentPath = window.location.pathname;
        if (currentPath.startsWith('/admin')) {
          window.location.href = '/admin-login';
        } else if (currentPath.startsWith('/pharmacy')) {
          window.location.href = '/pharmacy-login';
        } else {
          window.location.href = '/patient-login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
