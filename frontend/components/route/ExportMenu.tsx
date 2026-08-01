'use client';

import { useState } from 'react';
import { downloadExport } from '@/lib/api';
import { useApiToken } from '@/hooks/useApiToken';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const FORMATS: Array<{ format: string; label: string }> = [
  { format: 'gpx', label: 'GPX' },
  { format: 'tcx', label: 'TCX' },
  { format: 'fit', label: 'FIT' },
  { format: 'geojson', label: 'GeoJSON' },
  { format: 'kml', label: 'KML' },
];

export function ExportMenu({ routeId }: { routeId: string }) {
  const token = useApiToken();
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async (format: string) => {
    setPending(format);
    setError(null);
    try {
      await downloadExport(routeId, format, token);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setPending(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exporter</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {FORMATS.map(({ format, label }) => (
            <Button
              key={format}
              variant="outline"
              size="sm"
              disabled={pending === format}
              onClick={() => handleExport(format)}
            >
              {pending === format ? '…' : label}
            </Button>
          ))}
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        {FORMATS.some((f) => f.format === 'fit') && (
          <p className="mt-2 text-xs text-muted">
            Le FIT couvre le strict nécessaire (position, altitude, distance) pour l’import d’un parcours — pas les
            points de manœuvre ni les champs développeur.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
