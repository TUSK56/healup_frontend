"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import PharmacySidebar from "@/components/pharmacy/PharmacySidebar";
import PharmacyTopNavbar from "@/components/pharmacy/PharmacyTopNavbar";
import api from "@/services/apiService";

export default function PharmacyNewOrdersPage() {
  const searchParams = useSearchParams();
  const openRequestId = searchParams.get("openRequestId");
  const [modalOpen, setModalOpen] = React.useState(false);
  const iframeVersion = React.useMemo(() => `20260430-ui-refresh-${Date.now()}`, []);

  React.useEffect(() => {
    void (async () => {
      try {
        await api.patch("/notifications/read-all");
      } catch {
        // no-op
      }
    })();
  }, []);

  React.useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      // PNG must be triggered from the top window — iframe blob/data-URL downloads are often blocked or mislabeled.
      if (event.data?.type === "healup-download-png") {
        const filename = event.data.filename as string | undefined;
        const dataUrl = event.data.dataUrl as string | undefined;
        if (!filename || !dataUrl || !dataUrl.startsWith("data:image/png")) return;
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = filename.toLowerCase().endsWith(".png") ? filename : `${filename}.png`;
        a.rel = "noopener";
        document.body.appendChild(a);
        a.click();
        a.remove();
        return;
      }

      // Prescription / image file from iframe (same-origin download fix)
      if (event.data?.type === "healup-download-file") {
        const filename = event.data.filename as string | undefined;
        const dataUrl = event.data.dataUrl as string | undefined;
        if (
          !filename ||
          !dataUrl ||
          (!dataUrl.startsWith("data:image/") &&
            !dataUrl.startsWith("data:application/pdf"))
        ) {
          return;
        }
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = filename;
        a.rel = "noopener";
        document.body.appendChild(a);
        a.click();
        a.remove();
        return;
      }

      if (event?.data?.type === "healup-price-modal") {
        const open = Boolean(event.data.open);
        if (open) {
          const y = window.scrollY;
          setModalOpen(true);
          requestAnimationFrame(() => {
            window.scrollTo({ top: y, left: 0, behavior: "auto" });
            requestAnimationFrame(() => {
              window.scrollTo({ top: y, left: 0, behavior: "auto" });
            });
          });
        } else {
          setModalOpen(false);
        }
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const iframeSrc = openRequestId
    ? `/pharmacy_orders_1.html?openRequestId=${encodeURIComponent(openRequestId)}&v=${iframeVersion}`
    : `/pharmacy_orders_1.html?v=${iframeVersion}`;

  return (
    <div className="pharmacyDashboard">
      <PharmacySidebar active="new-orders" />
      <div className="main" style={{ padding: 0 }}>
        <PharmacyTopNavbar />
        {modalOpen ? (
          <div
            aria-hidden
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(15, 23, 42, 0.52)",
              zIndex: 199,
              pointerEvents: "auto",
            }}
          />
        ) : null}
        <div
          className="pharmacy-content-shell"
          style={{ position: "relative", zIndex: modalOpen ? 201 : 50 }}
        >
          <iframe src={iframeSrc} title="Pharmacy New Orders" className="h-full w-full border-0" />
        </div>
      </div>
    </div>
  );
}
