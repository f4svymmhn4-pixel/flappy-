import { ExportPoint } from './gpx.builder';

export interface DeepLink {
  app: string;
  label: string;
  url: string | null;
  supportLevel: 'full' | 'approximate' | 'manual_import';
  note: string;
}

const GOOGLE_MAPS_MAX_WAYPOINTS = 23; // Google's "dir" web API caps intermediate waypoints

function sampleWaypoints(points: ExportPoint[], max: number): ExportPoint[] {
  if (points.length <= max) return points;
  const step = (points.length - 1) / (max - 1);
  return Array.from({ length: max }, (_, i) => points[Math.round(i * step)]);
}

/**
 * Builds "open this route in..." links. Only Google Maps and Apple Maps
 * expose a public URL scheme that can carry an actual path (as an ordered
 * waypoint list, not the exact polyline — both platforms cap waypoint count
 * and will re-route between them, so long/complex loops are approximated).
 * Komoot, Strava, Garmin Connect and Wahoo have no public "import this GPX
 * via URL" mechanism for third-party apps; for those we return `url: null`
 * and point the user at the GPX/TCX export + the platform's own manual
 * import screen instead of faking a working deep link.
 */
export function buildDeepLinks(points: ExportPoint[]): DeepLink[] {
  const sampled = sampleWaypoints(points, GOOGLE_MAPS_MAX_WAYPOINTS);
  const origin = sampled[0];
  const destination = sampled[sampled.length - 1];
  const waypoints = sampled.slice(1, -1);

  const googleUrl = new URL('https://www.google.com/maps/dir/');
  googleUrl.searchParams.set('api', '1');
  googleUrl.searchParams.set('origin', `${origin.lat},${origin.lon}`);
  googleUrl.searchParams.set('destination', `${destination.lat},${destination.lon}`);
  googleUrl.searchParams.set('travelmode', 'bicycling');
  if (waypoints.length) {
    googleUrl.searchParams.set('waypoints', waypoints.map((p) => `${p.lat},${p.lon}`).join('|'));
  }

  const appleParams = new URLSearchParams({
    saddr: `${origin.lat},${origin.lon}`,
    daddr: `${destination.lat},${destination.lon}`,
    dirflg: 'b',
  });

  return [
    {
      app: 'google_maps',
      label: 'Google Maps',
      url: googleUrl.toString(),
      supportLevel: waypoints.length > 0 ? 'approximate' : 'full',
      note:
        waypoints.length > 0
          ? "Google Maps limite le nombre de points de passage : l'itinéraire ouvert peut différer légèrement du tracé exact sur les portions entre les points échantillonnés."
          : 'Ouvre un itinéraire vélo direct entre le départ et l’arrivée.',
    },
    {
      app: 'apple_maps',
      label: 'Apple Plans',
      url: `https://maps.apple.com/?${appleParams.toString()}`,
      supportLevel: 'approximate',
      note:
        "Apple Plans ne supporte pas l'injection d'un tracé complet via URL : seuls le départ et l'arrivée sont transmis, Apple recalcule son propre itinéraire.",
    },
    {
      app: 'komoot',
      label: 'Komoot',
      url: null,
      supportLevel: 'manual_import',
      note: "Komoot n'expose pas d'API publique d'import de tracé par lien. Téléchargez le GPX et importez-le manuellement via komoot.com/plan.",
    },
    {
      app: 'garmin_connect',
      label: 'Garmin Connect',
      url: null,
      supportLevel: 'manual_import',
      note: "L'upload de parcours nécessite un partenariat développeur Garmin. Téléchargez le fichier FIT ou GPX et importez-le dans Garmin Connect > Parcours.",
    },
    {
      app: 'wahoo',
      label: 'Wahoo',
      url: null,
      supportLevel: 'manual_import',
      note: "Wahoo ne propose pas de deep link d'import public. Téléchargez le GPX/FIT et importez-le dans l'app Wahoo.",
    },
    {
      app: 'ridewithgps',
      label: 'RideWithGPS',
      url: null,
      supportLevel: 'manual_import',
      note: 'RideWithGPS propose une API de création de route pour les développeurs enregistrés (clé requise, non incluse par défaut) — sinon importez le GPX manuellement.',
    },
    {
      app: 'strava',
      label: 'Strava',
      url: null,
      supportLevel: 'manual_import',
      note: "Strava n'autorise l'ajout de routes que via l'app/le site, pas de deep link public. Téléchargez le GPX et créez la route depuis strava.com/routes/new.",
    },
  ];
}
