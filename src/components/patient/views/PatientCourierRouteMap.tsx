"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import { CircleMarker, MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet";
import { haversineKm } from "@/lib/deliveryEta";
import { fetchOsrmDrivingRoute, type LatLngTuple } from "@/lib/osrmRoute";

function bearingDeg(a: LatLngTuple, b: LatLngTuple): number {
  const [lat1, lon1] = a;
  const [lat2, lon2] = b;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const y = Math.sin(toRad(lon2 - lon1)) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(toRad(lon2 - lon1));
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

function interpolate(a: LatLngTuple, b: LatLngTuple, t: number): LatLngTuple {
  const k = Math.min(1, Math.max(0, t));
  return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
}

/** Total path length in km (sum of segment haversine). */
function pathLengthKm(path: LatLngTuple[]): number {
  if (path.length < 2) return 0;
  let s = 0;
  for (let i = 0; i < path.length - 1; i += 1) {
    s += haversineKm(path[i][0], path[i][1], path[i + 1][0], path[i + 1][1]);
  }
  return s;
}

function positionAlongPath(path: LatLngTuple[], distanceKm: number): { pos: LatLngTuple; bearing: number } {
  if (path.length < 2) return { pos: path[0], bearing: 0 };
  let remaining = Math.max(0, distanceKm);
  for (let i = 0; i < path.length - 1; i += 1) {
    const a = path[i];
    const b = path[i + 1];
    const segKm = haversineKm(a[0], a[1], b[0], b[1]);
    if (segKm < 1e-9) continue;
    if (remaining <= segKm) {
      const t = remaining / segKm;
      return { pos: interpolate(a, b, t), bearing: bearingDeg(a, b) };
    }
    remaining -= segKm;
  }
  const a = path[path.length - 2];
  const b = path[path.length - 1];
  return { pos: b, bearing: bearingDeg(a, b) };
}

function makeCarIcon(rotationDeg: number) {
  return L.divIcon({
    className: "healup-courier-car-marker",
    html: `<div style="transform:rotate(${rotationDeg}deg);font-size:22px;line-height:1;filter:drop-shadow(0 1px 2px rgba(0,0,0,.25))">🚗</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function makePatientPinIcon() {
  return L.divIcon({
    className: "healup-patient-pin-marker",
    html: `<div style="position:relative;width:22px;height:22px;background:#ef4444;border:2px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 6px rgba(0,0,0,.28)"><div style="position:absolute;left:6px;top:6px;width:6px;height:6px;background:#fff;border-radius:9999px"></div></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 22],
  });
}

function FitRouteBounds({ path }: { path: LatLngTuple[] }) {
  const map = useMap();
  useEffect(() => {
    if (path.length < 2) return;
    const b = L.latLngBounds(path.map(([lat, lng]) => [lat, lng]));
    map.fitBounds(b, { padding: [52, 52], maxZoom: 16 });
  }, [map, path]);
  return null;
}

function CourierAlongPath({
  path,
  delivery,
  lockAtEnd,
  runOnceToDestination,
  onReachedDestination,
}: {
  path: LatLngTuple[];
  delivery: boolean;
  lockAtEnd: boolean;
  /** If true, car drives once pharmacy→patient then stops (no loop). */
  runOnceToDestination?: boolean;
  /** Fired once when runOnceToDestination reaches the patient. */
  onReachedDestination?: () => void;
}) {
  const [distKm, setDistKm] = useState(0);
  const pathOrdered = useMemo(() => {
    if (path.length < 2) return path;
    return delivery ? path : [...path].reverse();
  }, [path, delivery]);

  const totalKm = useMemo(() => pathLengthKm(pathOrdered), [pathOrdered]);
  const durationSec = useMemo(() => {
    if (totalKm <= 0) return 45;
    const roadMinutes = (totalKm / 28) * 60;
    return Math.min(140, Math.max(38, roadMinutes * 1.15));
  }, [totalKm]);

  const lastTs = useRef<number | null>(null);
  const reachedRef = useRef(false);
  const distAcc = useRef(0);
  const onReachedDestinationRef = useRef(onReachedDestination);

  useEffect(() => {
    onReachedDestinationRef.current = onReachedDestination;
  }, [onReachedDestination]);

  useEffect(() => {
    reachedRef.current = false;
    distAcc.current = 0;
    setDistKm(0);
  }, [pathOrdered, totalKm]);

  useEffect(() => {
    if (lockAtEnd) {
      distAcc.current = totalKm;
      setDistKm(totalKm);
      return;
    }
    if (pathOrdered.length < 2 || totalKm <= 0) return;

    let raf = 0;
    const tick = (ts: number) => {
      if (lastTs.current == null) lastTs.current = ts;
      const dt = Math.min(0.05, (ts - lastTs.current) / 1000);
      lastTs.current = ts;

      const speed = totalKm / durationSec;
      const once = Boolean(runOnceToDestination && onReachedDestination);

      if (once) {
        distAcc.current = Math.min(totalKm, distAcc.current + speed * dt);
        setDistKm(distAcc.current);
        if (distAcc.current >= totalKm - 1e-9 && !reachedRef.current) {
          reachedRef.current = true;
          onReachedDestinationRef.current?.();
          return;
        }
        raf = requestAnimationFrame(tick);
        return;
      }

      distAcc.current += speed * dt;
      if (distAcc.current >= totalKm) distAcc.current = 0;
      setDistKm(distAcc.current);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      lastTs.current = null;
    };
  }, [pathOrdered, totalKm, durationSec, lockAtEnd, runOnceToDestination, onReachedDestination]);

  const { pos, bearing } = useMemo(() => {
    if (pathOrdered.length < 2) return { pos: pathOrdered[0], bearing: 0 };
    const d = lockAtEnd ? totalKm : distKm;
    return positionAlongPath(pathOrdered, d);
  }, [pathOrdered, distKm, totalKm, lockAtEnd]);

  const icon = useMemo(() => makeCarIcon(bearing - 88), [bearing]);

  if (pathOrdered.length < 2) return null;
  return <Marker position={pos} icon={icon} />;
}

type Props = {
  pharmacy: LatLngTuple;
  patient: LatLngTuple;
  delivery: boolean;
  /** When true, car parks at destination (order completed). */
  lockCarAtDestination?: boolean;
  /** Delivery only: animate once to patient then invoke callback (mark delivered). */
  runDeliveryOnce?: boolean;
  onCarReachDestination?: () => void;
};

export default function PatientCourierRouteMap({
  pharmacy,
  patient,
  delivery,
  lockCarAtDestination = false,
  runDeliveryOnce = false,
  onCarReachDestination,
}: Props) {
  const valid =
    Number.isFinite(pharmacy[0]) &&
    Number.isFinite(pharmacy[1]) &&
    Number.isFinite(patient[0]) &&
    Number.isFinite(patient[1]);

  const [roadPath, setRoadPath] = useState<LatLngTuple[] | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState(false);

  useEffect(() => {
    if (!valid) return;
    const ctrl = new AbortController();
    let cancelled = false;
    (async () => {
      setRouteLoading(true);
      setRouteError(false);
      try {
        const from = delivery ? pharmacy : patient;
        const to = delivery ? patient : pharmacy;
        const path = await fetchOsrmDrivingRoute(from, to, ctrl.signal);
        if (!cancelled) {
          setRoadPath(path && path.length >= 2 ? path : [from, to]);
          if (!path) setRouteError(true);
        }
      } catch {
        if (!cancelled) {
          setRoadPath([delivery ? pharmacy : patient, delivery ? patient : pharmacy]);
          setRouteError(true);
        }
      } finally {
        if (!cancelled) setRouteLoading(false);
      }
    })();
    return () => {
      cancelled = true;
      ctrl.abort();
    };
  }, [valid, pharmacy[0], pharmacy[1], patient[0], patient[1], delivery]);

  const path = roadPath ?? (valid ? [pharmacy, patient] : []);
  const patientPinIcon = useMemo(() => makePatientPinIcon(), []);
  const center = useMemo(() => {
    if (path.length < 2) return pharmacy;
    const mid = Math.floor(path.length / 2);
    return path[mid];
  }, [path, pharmacy]);

  if (!valid) {
    return (
      <div className="flex h-[400px] items-center justify-center bg-slate-100 text-center text-sm text-slate-500">
        لا تتوفر إحداثيات كافية لعرض الخريطة.
      </div>
    );
  }

  return (
    <div className="patientCourierRouteMap relative h-[400px] w-full overflow-hidden rounded-2xl border border-slate-100">
      {routeLoading ? (
        <div className="absolute inset-0 z-[500] flex items-center justify-center bg-white/70 text-sm font-bold text-slate-600">
          جاري تحميل مسار التوصيل…
        </div>
      ) : null}
      <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }} attributionControl={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom={19} />
        <Polyline positions={path} pathOptions={{ color: "#1a56db", weight: 5, opacity: 0.88 }} />
        <CircleMarker
          center={pharmacy}
          pathOptions={{ color: "#2563eb", fillColor: "#2563eb", fillOpacity: 1, weight: 2 }}
          radius={8}
        />
        <Marker position={patient} icon={patientPinIcon} />
        {path.length >= 2 ? (
          <CourierAlongPath
            path={path}
            delivery={delivery}
            lockAtEnd={lockCarAtDestination}
            runOnceToDestination={Boolean(runDeliveryOnce && delivery && onCarReachDestination)}
            onReachedDestination={onCarReachDestination}
          />
        ) : null}
        <FitRouteBounds path={path} />
      </MapContainer>
      {routeError ? (
        <p className="absolute bottom-1 left-0 right-0 z-[400] bg-amber-50/95 py-1 text-center text-[10px] font-bold text-amber-900">
          تعذر تحميل المسار الدقيق؛ يُعرض خط تقريبي مؤقتًا.
        </p>
      ) : null}
      <style jsx global>{`
        .patientCourierRouteMap .leaflet-div-icon {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}
