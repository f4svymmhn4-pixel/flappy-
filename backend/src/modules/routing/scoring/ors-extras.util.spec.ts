import { extractSegments, OrsExtras } from './ors-extras.util';

describe('extractSegments', () => {
  const coordinates: Array<[number, number, number?]> = [
    [-0.6506, 44.8378, 10],
    [-0.645, 44.84, 12],
    [-0.64, 44.845, 15],
    [-0.635, 44.85, 18],
  ];

  it('splits distance according to the surface layer ranges', () => {
    const extras: OrsExtras = {
      surface: { values: [[0, 2, 3 /* asphalt */], [2, 3, 10 /* gravel */]] },
    };
    const segments = extractSegments(coordinates, extras);
    expect(segments).toHaveLength(2);
    expect(segments[0].surface).toBe('asphalt');
    expect(segments[1].surface).toBe('gravel');
    expect(segments[0].distanceM).toBeGreaterThan(0);
    expect(segments[1].distanceM).toBeGreaterThan(0);
  });

  it('falls back to a single whole-route segment when no extras are present', () => {
    const segments = extractSegments(coordinates, {});
    expect(segments).toHaveLength(1);
    expect(segments[0].distanceM).toBeGreaterThan(0);
  });

  it('reads steepness and suitability values alongside surface', () => {
    const extras: OrsExtras = {
      surface: { values: [[0, 3, 1]] },
      steepness: { values: [[0, 3, 2]] },
      suitability: { values: [[0, 3, 8]] },
    };
    const segments = extractSegments(coordinates, extras);
    expect(segments[0].steepness).toBe(2);
    expect(segments[0].suitability).toBe(8);
  });
});
