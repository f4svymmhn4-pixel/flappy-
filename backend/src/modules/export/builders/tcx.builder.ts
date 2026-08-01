import { create } from 'xmlbuilder2';
import { ExportPoint } from './gpx.builder';
import { haversineDistanceM } from '../../../common/geo/geo.util';

export function buildTcx(name: string, points: ExportPoint[], distanceM: number): string {
  const doc = create({ version: '1.0', encoding: 'UTF-8' }).ele('TrainingCenterDatabase', {
    xmlns: 'http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2',
  });

  const course = doc.ele('Courses').ele('Course');
  course.ele('Name').txt(name);

  const track = course.ele('Track');
  let cumulative = 0;
  for (let i = 0; i < points.length; i++) {
    if (i > 0) {
      cumulative += haversineDistanceM(
        { lat: points[i - 1].lat, lon: points[i - 1].lon },
        { lat: points[i].lat, lon: points[i].lon },
      );
    }
    const tp = track.ele('Trackpoint');
    const pos = tp.ele('Position');
    pos.ele('LatitudeDegrees').txt(points[i].lat.toFixed(6));
    pos.ele('LongitudeDegrees').txt(points[i].lon.toFixed(6));
    pos.up();
    if (points[i].ele !== undefined) tp.ele('AltitudeMeters').txt(points[i].ele!.toFixed(1));
    tp.ele('DistanceMeters').txt(cumulative.toFixed(1));
  }

  const lap = course.ele('Lap');
  lap.ele('TotalTimeSeconds').txt('0');
  lap.ele('DistanceMeters').txt(distanceM.toFixed(1));
  lap.ele('Intensity').txt('Active');

  return doc.end({ prettyPrint: true });
}
