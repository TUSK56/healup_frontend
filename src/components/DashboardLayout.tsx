'use client';

import Sidebar from './Sidebar';
import RealtimeBridge from './RealtimeBridge';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50">
      <RealtimeBridge />
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
