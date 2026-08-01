import { buildGpx } from './gpx.builder';

describe('buildGpx', () => {
  it('produces a valid GPX document with all track points', () => {
    const xml = buildGpx('Boucle Mérignac', [
      { lat: 44.8378, lon: -0.6506, ele: 12 },
      { lat: 44.84, lon: -0.64, ele: 15 },
    ]);

    expect(xml).toContain('<?xml');
    expect(xml).toContain('<gpx');
    expect(xml).toContain('Boucle Mérignac');
    expect((xml.match(/<trkpt/g) ?? []).length).toBe(2);
    expect(xml).toContain('lat="44.837800"');
    expect(xml).toContain('<ele>12.0</ele>');
  });
});
