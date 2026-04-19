import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const DEV_FALLBACK_API_URL = 'https://healup1.runasp.net';
const resolvedApiUrl = API_URL || (process.env.NODE_ENV === 'development' ? DEV_FALLBACK_API_URL : '');

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  if (!API_URL) {
    console.warn('NEXT_PUBLIC_API_URL is not set in production; API calls will use relative /api routes.');
  }
  if (API_URL && /localhost|127\.0\.0\.1/i.test(API_URL)) {
    console.warn(`NEXT_PUBLIC_API_URL points to a local address in production: ${API_URL}`);
  }
}

export const api: AxiosInstance = axios.create({
  baseURL: `${resolvedApiUrl}/api`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

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
    if (error.response?.status === 401) {
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
