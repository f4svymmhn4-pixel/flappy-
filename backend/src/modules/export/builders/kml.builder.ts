import { create } from 'xmlbuilder2';
import { ExportPoint } from './gpx.builder';

export function buildKml(name: string, points: ExportPoint[]): string {
  const coordinates = points.map((p) => `${p.lon.toFixed(6)},${p.lat.toFixed(6)},${p.ele ?? 0}`).join(' ');

  const doc = create({ version: '1.0', encoding: 'UTF-8' })
    .ele('kml', { xmlns: 'http://www.opengis.net/kml/2.2' })
    .ele('Document');

  doc.ele('name').txt(name);
  const placemark = doc.ele('Placemark');
  placemark.ele('name').txt(name);
  placemark.ele('LineString').ele('tessellate').txt('1').up().ele('coordinates').txt(coordinates);

  return doc.end({ prettyPrint: true });
}
