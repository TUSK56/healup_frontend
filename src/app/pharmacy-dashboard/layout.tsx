import type { Metadata } from "next";
import "@/components/pharmacy/pharmacy-sidebar.css";
import RealtimeBridge from "@/components/RealtimeBridge";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Healup - Pharmacy Dashboard",
  description: "Manage pharmacy orders and analytics - Healup",
};

export default function PharmacyDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <RealtimeBridge />
      {children}
    </>
  );
}
