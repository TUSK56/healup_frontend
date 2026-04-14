import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import RealtimeBridge from '@/components/RealtimeBridge';
import './globals.css';

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
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${cairo.className}`}>
      <body>
        <RealtimeBridge />
        {children}
      </body>
    </html>
  );
}
