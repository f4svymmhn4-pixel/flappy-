import { buildTcx } from './tcx.builder';

describe('buildTcx', () => {
  it('produces a course with trackpoints and a lap distance', () => {
    const xml = buildTcx(
      'Sortie test',
      [
        { lat: 44.8378, lon: -0.6506, ele: 12 },
        { lat: 44.84, lon: -0.64, ele: 15 },
      ],
      5000,
    );

    expect(xml).toContain('TrainingCenterDatabase');
    expect((xml.match(/<Trackpoint>/g) ?? []).length).toBe(2);
    expect(xml).toContain('<DistanceMeters>5000.0</DistanceMeters>');
    expect(xml).toContain('<Name>Sortie test</Name>');
  });
});
