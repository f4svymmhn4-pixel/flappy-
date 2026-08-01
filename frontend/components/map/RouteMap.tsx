'use client';

import { useMemo, useRef } from 'react';
import Map, { Layer, Marker, Source, type MapRef } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Feature, LineString } from 'geojson';
import type { RoutePoi } from '@/lib/types';

const POI_ICONS: Record<string, string> = {
  viewpoint: '🌄',
  lake: '💧',
  vineyard: '🍇',
  monument: '🗿',
  castle: '🏰',
  bridge: '🌉',
  village: '🏘️',
  river: '🏞️',
  ocean: '🌊',
};

// Raster OSM basemap: no API key required. For heavier production traffic,
// swap the tile URL for a hosted provider (Thunderforest/OpenCycleMap with
// THUNDERFOREST_API_KEY) to respect OSM's tile usage policy.
const OSM_STYLE = {
  version: 8 as const,
  sources: {
    osm: {
      type: 'raster' as const,
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '&copy; OpenStreetMap contributors',
    },
  },
  layers: [{ id: 'osm', type: 'raster' as const, source: 'osm' }],
};

interface RouteMapProps {
  route: Feature<LineString>;
  pois?: RoutePoi[];
  className?: string;
}

export function RouteMap({ route, pois = [], className }: RouteMapProps) {
  const mapRef = useRef<MapRef>(null);

  const bounds = useMemo(() => {
    const coords = route.geometry.coordinates as Array<[number, number]>;
    const lons = coords.map((c) => c[0]);
    const lats = coords.map((c) => c[1]);
    return [
      [Math.min(...lons), Math.min(...lats)],
      [Math.max(...lons), Math.max(...lats)],
    ] as [[number, number], [number, number]];
  }, [route]);

  const start = route.geometry.coordinates[0] as [number, number];

  return (
    <div className={className}>
      <Map
        ref={mapRef}
        mapLib={maplibregl}
        initialViewState={{ bounds, fitBoundsOptions: { padding: 48 } }}
        style={{ width: '100%', height: '100%', borderRadius: '1rem' }}
        mapStyle={OSM_STYLE as unknown as string}
      >
        <Source id="route" type="geojson" data={route}>
          <Layer
            id="route-line"
            type="line"
            paint={{ 'line-color': '#0f8f56', 'line-width': 4, 'line-opacity': 0.9 }}
            layout={{ 'line-cap': 'round', 'line-join': 'round' }}
          />
        </Source>

        <Marker longitude={start[0]} latitude={start[1]} anchor="bottom">
          <div className="text-2xl drop-shadow">📍</div>
        </Marker>

        {pois.map((poi) => (
          <Marker key={poi.id} longitude={poi.lon} latitude={poi.lat} anchor="bottom">
            <div title={poi.name} className="cursor-pointer text-xl drop-shadow">
              {POI_ICONS[poi.category] ?? '📌'}
            </div>
          </Marker>
        ))}
      </Map>
    </div>
  );
}
