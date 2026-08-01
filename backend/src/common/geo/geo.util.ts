const EARTH_RADIUS_M = 6371000;

export interface LatLon {
  lat: number;
  lon: number;
}

export function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function toDegrees(rad: number): number {
  return (rad * 180) / Math.PI;
}

/** Great-circle distance in meters between two points. */
export function haversineDistanceM(a: LatLon, b: LatLon): number {
  const dLat = toRadians(b.lat - a.lat);
  const dLon = toRadians(b.lon - a.lon);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Destination point given a start, bearing (degrees) and distance (meters). */
export function destinationPoint(start: LatLon, bearingDeg: number, distanceM: number): LatLon {
  const angularDistance = distanceM / EARTH_RADIUS_M;
  const bearing = toRadians(bearingDeg);
  const lat1 = toRadians(start.lat);
  const lon1 = toRadians(start.lon);

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(angularDistance) +
      Math.cos(lat1) * Math.sin(angularDistance) * Math.cos(bearing),
  );
  const lon2 =
    lon1 +
    Math.atan2(
      Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(lat1),
      Math.cos(angularDistance) - Math.sin(lat1) * Math.sin(lat2),
    );

  return { lat: toDegrees(lat2), lon: ((toDegrees(lon2) + 540) % 360) - 180 };
}

/** Bounding box [minLon, minLat, maxLon, maxLat] around a point, padded by radiusM. */
export function bboxAround(center: LatLon, radiusM: number): [number, number, number, number] {
  const north = destinationPoint(center, 0, radiusM);
  const east = destinationPoint(center, 90, radiusM);
  const south = destinationPoint(center, 180, radiusM);
  const west = destinationPoint(center, 270, radiusM);
  return [west.lon, south.lat, east.lon, north.lat];
}

/** Total length in meters of a GeoJSON LineString made of [lon, lat] pairs. */
export function lineStringLengthM(coordinates: Array<[number, number]>): number {
  let total = 0;
  for (let i = 1; i < coordinates.length; i++) {
    const [lon1, lat1] = coordinates[i - 1];
    const [lon2, lat2] = coordinates[i];
    total += haversineDistanceM({ lat: lat1, lon: lon1 }, { lat: lat2, lon: lon2 });
  }
  return total;
}
