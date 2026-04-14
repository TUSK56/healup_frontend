"use client";

import { Suspense } from "react";
import PatientOrderTrackingContent from "@/components/patient/views/PatientOrderTrackingContent";
import PatientShell from "@/components/patient/PatientShell";

export default function PatientOrderTrackingPage() {
  return (
    <PatientShell active="orders">
      <Suspense fallback={<div className="p-8 text-center text-slate-500">جاري التحميل...</div>}>
        <PatientOrderTrackingContent />
      </Suspense>
    </PatientShell>
  );
}
