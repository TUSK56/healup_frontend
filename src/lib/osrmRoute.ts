/**
 * Driving directions along roads via OSRM demo server (same data as OpenStreetMap).
 * Coordinates returned as [lat, lng] for Leaflet.
 */

export type LatLngTuple = [number, number];

function decodeOsrmCoordinates(geometry: { coordinates: number[][] } | undefined): LatLngTuple[] {
  if (!geometry?.coordinates?.length) return [];
  return geometry.coordinates.map((c) => {
    const lon = Number(c[0]);
    const lat = Number(c[1]);
    return [lat, lon] as LatLngTuple;
  });
}

/**
 * Fetches a driving route between two points. Falls back to null on failure (caller uses straight line).
 */
export async function fetchOsrmDrivingRoute(
  from: LatLngTuple,
  to: LatLngTuple,
  signal?: AbortSignal,
): Promise<LatLngTuple[] | null> {
  const [lat1, lon1] = from;
  const [lat2, lon2] = to;
  if (![lat1, lon1, lat2, lon2].every((x) => Number.isFinite(x))) return null;

  const url = `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=full&geometries=geojson`;
  const res = await fetch(url, { signal });
  if (!res.ok) return null;
  const data = (await res.json()) as {
    routes?: Array<{ geometry?: { coordinates: number[][] } }>;
  };
  const coords = data?.routes?.[0]?.geometry;
  const path = decodeOsrmCoordinates(coords);
  return path.length >= 2 ? path : null;
}
