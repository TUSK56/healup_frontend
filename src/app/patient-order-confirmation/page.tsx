"use client";

import PatientOrderConfirmationContent from "@/components/patient/views/PatientOrderConfirmationContent";
import PatientShell from "@/components/patient/PatientShell";

export default function PatientOrderConfirmationPage() {
  return (
    <PatientShell active="orders">
      <PatientOrderConfirmationContent />
    </PatientShell>
  );
}
