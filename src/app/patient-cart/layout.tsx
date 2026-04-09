import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Healup - سلة المشتريات",
  description: "سلة مشتريات الأدوية - Healup",
};

export default function PatientCartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
