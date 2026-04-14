'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FilePlus,
  List,
  Package,
  MapPin,
  Building2,
  Inbox,
  ClipboardList,
  Settings,
  LogOut,
  Users,
  Shield,
  FileText,
} from 'lucide-react';
import { authService } from '@/services/authService';

const patientLinks = [
  { href: '/dashboard', label: 'HealUp Dashboard', icon: LayoutDashboard },
  { href: '/requests/new', label: 'Create Request', icon: FilePlus },
  { href: '/requests', label: 'My Requests', icon: List },
  { href: '/orders', label: 'My Orders', icon: Package },
];

const pharmacyLinks = [
  { href: '/pharmacy/dashboard', label: 'HealUp Dashboard', icon: LayoutDashboard },
  { href: '/pharmacy/requests', label: 'Incoming Requests', icon: Inbox },
  { href: '/pharmacy/orders', label: 'Orders', icon: ClipboardList },
];

const adminLinks = [
  { href: '/admin/dashboard', label: 'HealUp Admin', icon: Shield },
  { href: '/admin/pharmacies', label: 'Pharmacy Approvals', icon: Building2 },
  { href: '/admin/patients', label: 'Patients', icon: Users },
  { href: '/admin/orders', label: 'Orders', icon: ClipboardList },
  { href: '/admin/financial', label: 'Financial Reports', icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();
  const path = pathname ?? '';
  const guard = authService.getGuard();

  const links = path.startsWith('/admin')
    ? adminLinks
    : path.startsWith('/pharmacy')
      ? pharmacyLinks
      : patientLinks;

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center border-b border-slate-200 px-6">
        <Link href="/" className="text-xl font-bold text-healup-primary">
          HealUp
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
              path === href ? 'bg-healup-primary text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-slate-200 p-4">
        <button
          onClick={() => {
            authService.logout();
            window.location.href = '/login';
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          <LogOut className="h-5 w-5" />
          HealUp Logout
        </button>
      </div>
    </aside>
  );
}
