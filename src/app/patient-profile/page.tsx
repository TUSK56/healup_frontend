"use client";

import PatientProfileContent from "@/components/patient/views/PatientProfileContent";
import PatientShell from "@/components/patient/PatientShell";

export default function PatientProfilePage() {
  return (
    <PatientShell active="profile">
      <PatientProfileContent />
    </PatientShell>
  );
}
