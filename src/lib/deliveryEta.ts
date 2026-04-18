const EARTH_KM = 6371;

function toRad(d: number) {
  return (d * Math.PI) / 180;
}

/** Great-circle distance in kilometres. */
export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_KM * c;
}

/**
 * Human-readable ETA range from route distance (km).
 * Uses ~22 km/h blended urban speed; clamps to a sensible window.
 */
export function formatDeliveryEtaRangeKm(distanceKm: number | null | undefined): string {
  if (distanceKm == null || !Number.isFinite(distanceKm) || distanceKm < 0) {
    return "سيتم التحديث عند توفر الموقع";
  }
  const travelMin = (distanceKm / 22) * 60;
  const low = Math.max(12, Math.round(travelMin * 0.75));
  const high = Math.min(95, Math.max(low + 5, Math.round(travelMin * 1.35)));
  return `${low} - ${high} دقيقة`;
}
