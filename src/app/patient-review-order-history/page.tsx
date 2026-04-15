"use client";

import PatientReviewOrderHistoryContent from "@/components/patient/views/PatientReviewOrderHistoryContent";
import PatientShell from "@/components/patient/PatientShell";

export default function PatientReviewOrderHistoryPage() {
  return (
    <PatientShell active="history">
      <PatientReviewOrderHistoryContent />
    </PatientShell>
  );
}
