'use client';

import { useRoute, useToggleFavorite } from '@/hooks/useRoutes';
import { RouteMap } from '@/components/map/RouteMap';
import { RouteStats } from '@/components/route/RouteStats';
import { ScoreCard } from '@/components/route/ScoreCard';
import { PoiList } from '@/components/route/PoiList';
import { ExportMenu } from '@/components/route/ExportMenu';
import { NavigationLinks } from '@/components/route/NavigationLinks';
import { Button } from '@/components/ui/button';

export default function RouteDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data: route, isLoading, error } = useRoute(id);
  const toggleFavorite = useToggleFavorite();

  if (isLoading) return <div className="p-8 text-center text-muted">Chargement du parcours…</div>;
  if (error || !route) return <div className="p-8 text-center text-red-600">Parcours introuvable.</div>;

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{route.name}</h1>
        <Button variant={route.isFavorite ? 'primary' : 'outline'} onClick={() => toggleFavorite.mutate(id)}>
          {route.isFavorite ? '★ Favori' : '☆ Ajouter aux favoris'}
        </Button>
      </div>

      <RouteMap route={route.geojson} pois={route.pois} className="h-[420px] w-full overflow-hidden rounded-2xl" />

      <RouteStats route={route} />
      <ScoreCard route={route} />
      <PoiList pois={route.pois} />

      <div className="grid gap-6 sm:grid-cols-2">
        <ExportMenu routeId={id} />
        <NavigationLinks routeId={id} />
      </div>
    </div>
  );
}
