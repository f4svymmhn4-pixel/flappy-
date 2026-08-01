import { Injectable } from '@nestjs/common';
import type { Feature, LineString } from 'geojson';
import { buildGpx, ExportPoint } from './builders/gpx.builder';
import { buildTcx } from './builders/tcx.builder';
import { buildKml } from './builders/kml.builder';
import { buildFit } from './builders/fit.builder';
import { buildDeepLinks, DeepLink } from './builders/deep-links.builder';

export type ExportFormat = 'gpx' | 'tcx' | 'kml' | 'geojson' | 'fit';

export interface ExportResult {
  contentType: string;
  filename: string;
  body: string | Buffer;
}

@Injectable()
export class ExportService {
  private toPoints(geojson: Feature<LineString>): ExportPoint[] {
    return (geojson.geometry.coordinates as Array<[number, number, number?]>).map(([lon, lat, ele]) => ({
      lat,
      lon,
      ele,
    }));
  }

  export(
    format: ExportFormat,
    routeName: string,
    geojson: Feature<LineString>,
    distanceM: number,
  ): ExportResult {
    const points = this.toPoints(geojson);
    const safeName = routeName.replace(/[^a-z0-9-_]+/gi, '_');

    switch (format) {
      case 'gpx':
        return {
          contentType: 'application/gpx+xml',
          filename: `${safeName}.gpx`,
          body: buildGpx(routeName, points),
        };
      case 'tcx':
        return {
          contentType: 'application/vnd.garmin.tcx+xml',
          filename: `${safeName}.tcx`,
          body: buildTcx(routeName, points, distanceM),
        };
      case 'kml':
        return {
          contentType: 'application/vnd.google-earth.kml+xml',
          filename: `${safeName}.kml`,
          body: buildKml(routeName, points),
        };
      case 'fit':
        return {
          contentType: 'application/vnd.ant.fit',
          filename: `${safeName}.fit`,
          body: buildFit(routeName, points, distanceM),
        };
      case 'geojson':
      default:
        return {
          contentType: 'application/geo+json',
          filename: `${safeName}.geojson`,
          body: JSON.stringify(geojson, null, 2),
        };
    }
  }

  deepLinks(geojson: Feature<LineString>): DeepLink[] {
    return buildDeepLinks(this.toPoints(geojson));
  }
}
