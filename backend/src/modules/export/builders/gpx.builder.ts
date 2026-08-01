import { create } from 'xmlbuilder2';

export interface ExportPoint {
  lat: number;
  lon: number;
  ele?: number;
}

export function buildGpx(name: string, points: ExportPoint[]): string {
  const doc = create({ version: '1.0', encoding: 'UTF-8' })
    .ele('gpx', {
      version: '1.1',
      creator: 'Bike Route Generator',
      xmlns: 'http://www.topografix.com/GPX/1/1',
    })
    .ele('metadata')
    .ele('name')
    .txt(name)
    .up()
    .up();

  const trk = doc.ele('trk').ele('name').txt(name).up().ele('trkseg');
  for (const p of points) {
    const pt = trk.ele('trkpt', { lat: p.lat.toFixed(6), lon: p.lon.toFixed(6) });
    if (p.ele !== undefined) pt.ele('ele').txt(p.ele.toFixed(1));
  }

  return doc.end({ prettyPrint: true });
}
