import { bboxAround, destinationPoint, haversineDistanceM, lineStringLengthM } from './geo.util';

describe('geo.util', () => {
  it('computes ~0 distance for identical points', () => {
    const p = { lat: 44.8378, lon: -0.6506 };
    expect(haversineDistanceM(p, p)).toBeCloseTo(0, 3);
  });

  it('computes a known distance (Mérignac to Bordeaux center, ~7km)', () => {
    const merignac = { lat: 44.8378, lon: -0.6506 };
    const bordeaux = { lat: 44.8378, lon: -0.5723 };
    const d = haversineDistanceM(merignac, bordeaux);
    expect(d).toBeGreaterThan(5000);
    expect(d).toBeLessThan(10000);
  });

  it('destinationPoint moving north increases latitude and keeps longitude stable', () => {
    const start = { lat: 44.8378, lon: -0.6506 };
    const north = destinationPoint(start, 0, 1000);
    expect(north.lat).toBeGreaterThan(start.lat);
    expect(north.lon).toBeCloseTo(start.lon, 2);
  });

  it('destinationPoint distance round-trips through haversine', () => {
    const start = { lat: 44.8378, lon: -0.6506 };
    const dest = destinationPoint(start, 42, 5000);
    const back = haversineDistanceM(start, dest);
    expect(back).toBeCloseTo(5000, -1);
  });

  it('bboxAround returns a box that contains the center', () => {
    const center = { lat: 44.8378, lon: -0.6506 };
    const [minLon, minLat, maxLon, maxLat] = bboxAround(center, 2000);
    expect(center.lon).toBeGreaterThan(minLon);
    expect(center.lon).toBeLessThan(maxLon);
    expect(center.lat).toBeGreaterThan(minLat);
    expect(center.lat).toBeLessThan(maxLat);
  });

  it('lineStringLengthM sums segment distances', () => {
    const coords: Array<[number, number]> = [
      [-0.6506, 44.8378],
      [-0.64, 44.84],
      [-0.63, 44.845],
    ];
    const total = lineStringLengthM(coords);
    const d1 = haversineDistanceM({ lat: 44.8378, lon: -0.6506 }, { lat: 44.84, lon: -0.64 });
    const d2 = haversineDistanceM({ lat: 44.84, lon: -0.64 }, { lat: 44.845, lon: -0.63 });
    expect(total).toBeCloseTo(d1 + d2, 3);
  });
});
