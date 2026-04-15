"use client";

import { useEffect, useRef } from "react";
import { estimateDriveMinutes, haversineKm } from "@/lib/geo";

type Props = {
  pharmacyLat: number;
  pharmacyLng: number;
  patientLat: number;
  patientLng: number;
  animateDelivery: boolean;
};

export default function PatientDeliveryMap({
  pharmacyLat,
  pharmacyLng,
  patientLat,
  patientLng,
  animateDelivery,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let cancelled = false;
    const mapBox: { map: import("leaflet").Map | null } = { map: null };
    let stepTimer: ReturnType<typeof setInterval> | null = null;

    void (async () => {
      const L = await import("leaflet");
      await import("leaflet/dist/leaflet.css");

      // Next/webpack: fix default marker assets
      type IconProto = typeof L.Icon.Default.prototype & { _getIconUrl?: unknown };
      delete (L.Icon.Default.prototype as IconProto)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      if (cancelled || !containerRef.current) return;

      const map = L.map(containerRef.current, { zoomControl: true }).setView(
        [(pharmacyLat + patientLat) / 2, (pharmacyLng + patientLng) / 2],
        13
      );
      mapBox.map = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      L.marker([pharmacyLat, pharmacyLng]).addTo(map).bindTooltip("الصيدلية");
      L.marker([patientLat, patientLng]).addTo(map).bindTooltip("موقعك");
      L.polyline(
        [
          [pharmacyLat, pharmacyLng],
          [patientLat, patientLng],
        ],
        { color: "#0456AE", weight: 4, opacity: 0.55 }
      ).addTo(map);

      const bounds = L.latLngBounds(L.latLng(pharmacyLat, pharmacyLng), L.latLng(patientLat, patientLng));
      map.fitBounds(bounds, { padding: [28, 28] });

      if (animateDelivery && !cancelled) {
        const km = haversineKm(pharmacyLat, pharmacyLng, patientLat, patientLng);
        const etaMin = estimateDriveMinutes(km);
        const courier = L.marker([pharmacyLat, pharmacyLng])
          .addTo(map)
          .bindTooltip("مندوب التوصيل", { permanent: false });

        const steps = 72;
        const durationMs = Math.min(55_000, Math.max(14_000, etaMin * 900));
        const stepMs = Math.max(80, Math.floor(durationMs / steps));
        let step = 0;
        stepTimer = setInterval(() => {
          if (cancelled || !mapBox.map) return;
          const t = Math.min(1, step / steps);
          const lat = pharmacyLat + (patientLat - pharmacyLat) * t;
          const lng = pharmacyLng + (patientLng - pharmacyLng) * t;
          courier.setLatLng([lat, lng]);
          step++;
          if (t >= 1 && stepTimer) {
            clearInterval(stepTimer);
            stepTimer = null;
          }
        }, stepMs);
      }

      setTimeout(() => map.invalidateSize(), 200);
    })();

    return () => {
      cancelled = true;
      if (stepTimer) {
        clearInterval(stepTimer);
        stepTimer = null;
      }
      if (mapBox.map) {
        mapBox.map.remove();
        mapBox.map = null;
      }
    };
  }, [pharmacyLat, pharmacyLng, patientLat, patientLng, animateDelivery]);

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
      <div ref={containerRef} className="h-[280px] w-full bg-slate-100" dir="ltr" />
      <p className="bg-white px-4 py-2 text-center text-xs text-slate-500">
        خريطة OpenStreetMap — المسار تقريبي والوقت مبني على المسافة.
      </p>
    </div>
  );
}
