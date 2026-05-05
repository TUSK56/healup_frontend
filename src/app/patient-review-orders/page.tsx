"use client";

import PatientReviewOrdersContent from "@/components/patient/views/PatientReviewOrdersContent";
import PatientShell from "@/components/patient/PatientShell";

export default function PatientReviewOrdersPage() {
  return (
    <PatientShell active="orders">
      <PatientReviewOrdersContent />
    </PatientShell>
  );
}
