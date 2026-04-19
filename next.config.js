/** @type {import('next').NextConfig} */
const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : '');

const noCacheHeaders = [
  { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0' },
  { key: 'Pragma', value: 'no-cache' },
  { key: 'Expires', value: '0' },
];

const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/pharmacy_orders_1.html',
        headers: noCacheHeaders,
      },
      {
        source: '/pharmacy-dashboard/:path*',
        headers: noCacheHeaders,
      },
      {
        source: '/patient-home',
        headers: noCacheHeaders,
      },
      {
        source: '/patient-cart',
        headers: noCacheHeaders,
      },
      {
        source: '/patient-order-confirmation/:path*',
        headers: noCacheHeaders,
      },
      {
        source: '/patient-order-tracking',
        headers: noCacheHeaders,
      },
      {
        source: '/patient-profile',
        headers: noCacheHeaders,
      },
      {
        source: '/patient-review-order-history',
        headers: noCacheHeaders,
      },
      {
        source: '/patient-review-orders',
        headers: noCacheHeaders,
      },
      {
        source: '/admin/:path*',
        headers: noCacheHeaders,
      },
      {
        source: '/admin-login',
        headers: noCacheHeaders,
      },
    ];
  },
  async rewrites() {
    if (!apiBaseUrl) {
      return [];
    }

    return [
      { source: '/api/:path*', destination: `${apiBaseUrl}/api/:path*` },
    ];
  },
};

module.exports = nextConfig;
