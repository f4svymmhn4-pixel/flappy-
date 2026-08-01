'use client';

import { useRouteHistory } from '@/hooks/useRoutes';
import { RouteList } from '@/components/route/RouteList';

export default function FavoritesPage() {
  const { data: routes, isLoading } = useRouteHistory(true);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Mes favoris</h1>
      {isLoading ? (
        <p className="text-muted">Chargement…</p>
      ) : (
        <RouteList routes={routes ?? []} emptyLabel="Aucun favori pour le moment." />
      )}
    </div>
  );
}
