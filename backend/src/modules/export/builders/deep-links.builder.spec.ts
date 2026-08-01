import { buildDeepLinks } from './deep-links.builder';

describe('buildDeepLinks', () => {
  const points = Array.from({ length: 40 }, (_, i) => ({ lat: 44.8 + i * 0.001, lon: -0.6 + i * 0.001 }));

  it('builds a working Google Maps bicycling URL sampled to the waypoint cap', () => {
    const links = buildDeepLinks(points);
    const google = links.find((l) => l.app === 'google_maps')!;
    expect(google.url).toContain('travelmode=bicycling');
    expect(google.supportLevel).toBe('approximate');

    const url = new URL(google.url!);
    const waypointCount = url.searchParams.get('waypoints')!.split('|').length;
    expect(waypointCount).toBeLessThanOrEqual(23);
  });

  it('is honest about platforms with no public deep-link import (null url, manual_import)', () => {
    const links = buildDeepLinks(points);
    for (const app of ['komoot', 'garmin_connect', 'wahoo', 'ridewithgps', 'strava']) {
      const link = links.find((l) => l.app === app)!;
      expect(link.url).toBeNull();
      expect(link.supportLevel).toBe('manual_import');
      expect(link.note.length).toBeGreaterThan(0);
    }
  });

  it('reports full support for a direct origin-destination hop with no intermediate waypoints', () => {
    const directRoute = [points[0], points[points.length - 1]];
    const links = buildDeepLinks(directRoute);
    const google = links.find((l) => l.app === 'google_maps')!;
    expect(google.supportLevel).toBe('full');
    expect(new URL(google.url!).searchParams.has('waypoints')).toBe(false);
  });
});
