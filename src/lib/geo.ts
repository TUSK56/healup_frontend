/** Great-circle distance in km (WGS84 sphere approximation). */
export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/** Rough urban ETA (≈25 km/h blended). */
export function estimateDriveMinutes(km: number): number {
  if (!Number.isFinite(km) || km <= 0) return 12;
  return Math.round(Math.min(120, Math.max(8, (km / 25) * 60)));
}
