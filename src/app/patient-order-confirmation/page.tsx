"use client";

import { Suspense } from "react";
import PatientOrderConfirmationContent from "@/components/patient/views/PatientOrderConfirmationContent";
import PatientShell from "@/components/patient/PatientShell";

function OrderConfirmationFallback() {
  return (
    <div className="patient-order-confirmation-wrap min-h-[40vh] bg-[#F8FAFC] px-4 py-8 rtl">
      <div className="mx-auto max-w-3xl rounded-3xl border border-gray-100 bg-white p-10 text-center text-gray-500 shadow-sm">
        جاري التحميل…
      </div>
    </div>
  );
}

export default function PatientOrderConfirmationPage() {
  return (
    <PatientShell active="orders">
      <Suspense fallback={<OrderConfirmationFallback />}>
        <PatientOrderConfirmationContent />
      </Suspense>
    </PatientShell>
  );
}
