import { buildKml } from './kml.builder';

describe('buildKml', () => {
  it('produces a Placemark LineString with lon,lat,ele coordinates', () => {
    const xml = buildKml('Boucle', [
      { lat: 44.8378, lon: -0.6506, ele: 12 },
      { lat: 44.84, lon: -0.64, ele: 15 },
    ]);

    expect(xml).toContain('<kml');
    expect(xml).toContain('<LineString>');
    expect(xml).toContain('-0.650600,44.837800,12');
    expect(xml).toContain('-0.640000,44.840000,15');
  });
});
