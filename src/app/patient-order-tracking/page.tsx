"use client";

import PatientOrderTrackingContent from "@/components/patient/views/PatientOrderTrackingContent";
import PatientShell from "@/components/patient/PatientShell";

export default function PatientOrderTrackingPage() {
  return (
    <PatientShell active="orders">
      <PatientOrderTrackingContent />
    </PatientShell>
  );
}
