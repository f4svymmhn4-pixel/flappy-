import Image from 'next/image';
import type { RoutePoi } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

const CATEGORY_LABELS: Record<string, string> = {
  viewpoint: 'Point de vue',
  lake: 'Lac',
  vineyard: 'Vignoble',
  monument: 'Monument',
  castle: 'Château',
  bridge: 'Pont',
  village: 'Village',
  river: 'Rivière',
  ocean: 'Littoral',
};

export function PoiList({ pois }: { pois: RoutePoi[] }) {
  if (pois.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Les plus beaux points du parcours</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        {pois.map((poi) => (
          <div key={poi.id} className="flex gap-3 rounded-xl border border-[rgb(var(--border))] p-3">
            {poi.photoUrl ? (
              <Image
                src={poi.photoUrl}
                alt={poi.name}
                width={72}
                height={72}
                className="h-18 w-18 shrink-0 rounded-lg object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-18 w-18 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-2xl dark:bg-slate-800">
                📷
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate font-medium">{poi.name}</p>
                <Badge>{CATEGORY_LABELS[poi.category] ?? poi.category}</Badge>
              </div>
              <p className="text-xs text-muted">à {(poi.distanceFromStartM / 1000).toFixed(1)} km du départ</p>
              {poi.description && <p className="mt-1 line-clamp-2 text-sm text-muted">{poi.description}</p>}
              {poi.wikipediaUrl && (
                <a
                  href={poi.wikipediaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-medium text-brand-600 hover:underline"
                >
                  En savoir plus →
                </a>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
