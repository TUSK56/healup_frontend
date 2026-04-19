/** @type {import('next').NextConfig} */
const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : '');

const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/pharmacy_orders_1.html',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
        ],
      },
      {
        source: '/pharmacy-dashboard/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0' },
        ],
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
