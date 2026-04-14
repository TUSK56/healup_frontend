"use client";

import { Suspense } from "react";
import PatientReviewOrderHistoryContent from "@/components/patient/views/PatientReviewOrderHistoryContent";
import PatientShell from "@/components/patient/PatientShell";

export default function PatientReviewOrderHistoryPage() {
  return (
    <PatientShell active="history">
      <Suspense fallback={<div className="p-8 text-center text-slate-500">جاري التحميل...</div>}>
        <PatientReviewOrderHistoryContent />
      </Suspense>
    </PatientShell>
  );
}
