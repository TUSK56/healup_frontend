import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
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
