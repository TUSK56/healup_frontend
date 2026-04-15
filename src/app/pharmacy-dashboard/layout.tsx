import type { Metadata } from "next";
import "./cart.css";
import "@/components/pharmacy/pharmacy-sidebar.css";

export const metadata: Metadata = {
  title: "Healup - ???? ????????",
  description: "???? ?????? ?????? ????????? - Healup",
};

export default function PharmacyDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
