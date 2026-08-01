export default () => ({
  port: parseInt(process.env.PORT ?? '4000', 10),
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  database: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    name: process.env.DB_NAME ?? 'bike_routes',
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'dev-secret-change-me',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '30d',
  },
  apis: {
    openRouteServiceKey: process.env.ORS_API_KEY ?? '',
    graphHopperKey: process.env.GRAPHHOPPER_API_KEY ?? '',
    openTripMapKey: process.env.OPENTRIPMAP_API_KEY ?? '',
    mapillaryKey: process.env.MAPILLARY_API_KEY ?? '',
    thunderforestKey: process.env.THUNDERFOREST_API_KEY ?? '',
    rideWithGpsKey: process.env.RIDEWITHGPS_API_KEY ?? '',
    overpassUrl: process.env.OVERPASS_URL ?? 'https://overpass-api.de/api/interpreter',
    openElevationUrl: process.env.OPEN_ELEVATION_URL ?? 'https://api.open-elevation.com/api/v1/lookup',
    graphHopperUrl: process.env.GRAPHHOPPER_URL ?? 'https://graphhopper.com/api/1',
    openRouteServiceUrl: process.env.ORS_URL ?? 'https://api.openrouteservice.org',
  },
});
