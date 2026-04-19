/** @type {import('next').NextConfig} */
const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : '');

const nextConfig = {
  reactStrictMode: true,
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
