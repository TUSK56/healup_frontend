"use client";

import { Suspense } from "react";
import PatientOrderConfirmationContent from "@/components/patient/views/PatientOrderConfirmationContent";
import PatientShell from "@/components/patient/PatientShell";

export default function PatientOrderConfirmationPage() {
  return (
    <PatientShell active="orders">
      <Suspense fallback={<div className="p-8 text-center text-slate-500">جاري التحميل...</div>}>
        <PatientOrderConfirmationContent />
      </Suspense>
    </PatientShell>
  );
}
