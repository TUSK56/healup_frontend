import type { Metadata } from "next";
import "@/components/pharmacy/pharmacy-sidebar.css";
import RealtimeBridge from "@/components/RealtimeBridge";

export const metadata: Metadata = {
  title: "Healup - ???? ????????",
  description: "???? ?????? ?????? ????????? - Healup",
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
