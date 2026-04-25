"use client";

import { Suspense } from "react";
import PatientOrderTrackingView from "@/components/patient/views/PatientOrderTrackingView";
import { useLocale } from "@/contexts/LocaleContext";

function TrackingFallback() {
  const { dir } = useLocale();
  return (
    <div className="patient-order-tracking-wrap min-h-[40vh] bg-slate-50 px-4 py-10 text-center text-slate-500" dir={dir}>
      جاري التحميل…
    </div>
  );
}

export default function PatientOrderTrackingContent() {
  return (
    <Suspense fallback={<TrackingFallback />}>
      <PatientOrderTrackingView />
    </Suspense>
  );
}
