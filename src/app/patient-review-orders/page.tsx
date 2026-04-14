"use client";

import PatientReviewOrdersContent from "@/components/patient/views/PatientReviewOrdersContent";
import PatientShell from "@/components/patient/PatientShell";

export default function PatientReviewOrdersPage() {
  return (
    <PatientShell active="orders">
      <div className="patient-review-orders-original-size">
        <PatientReviewOrdersContent />
      </div>
    </PatientShell>
  );
}
