import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';
import "leaflet/dist/leaflet.css";
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'HealUp - Medicine Request Platform',
  description: 'HealUp connects patients with pharmacies to find rare medicines.',
};

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700', '900'],
  display: 'swap',
  variable: '--font-cairo',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className={`${cairo.variable} ${cairo.className}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
