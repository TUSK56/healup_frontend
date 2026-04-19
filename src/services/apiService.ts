import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const PRIMARY_API_URL = 'https://healup2.runasp.net';

function normalizeApiUrl(url?: string | null): string {
  const raw = String(url || '').trim();
  if (!raw) return PRIMARY_API_URL;
  return raw.replace(/healup1\.runasp\.net/gi, 'healup2.runasp.net').replace(/\/$/, '');
}

const resolvedApiUrl = normalizeApiUrl(API_URL);
const REQUEST_TIMEOUT_MS = 12000;
const MAX_GET_RETRIES = 2;

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retryCount?: number;
};

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
  timeout: REQUEST_TIMEOUT_MS,
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

    const storedApiUrl = localStorage.getItem('healup_api_url');
    if (storedApiUrl && /healup1\.runasp\.net/i.test(storedApiUrl)) {
      localStorage.setItem('healup_api_url', normalizeApiUrl(storedApiUrl));
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config as RetryableRequestConfig | undefined;
    const method = String(config?.method || 'get').toLowerCase();
    const status = error.response?.status;
    const isTransientGatewayError = status === 502 || status === 503 || status === 504 || status === 408;
    const isNetworkOrTimeout = !error.response;
    const retryCount = config?._retryCount || 0;
    const shouldRetry =
      Boolean(config) &&
      method === 'get' &&
      (isTransientGatewayError || isNetworkOrTimeout) &&
      retryCount < MAX_GET_RETRIES;

    if (shouldRetry && config) {
      config._retryCount = retryCount + 1;
      const delayMs = 350 * Math.pow(2, retryCount);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      return api(config);
    }

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
