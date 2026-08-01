'use client';

import { useRouteHistory } from '@/hooks/useRoutes';
import { RouteList } from '@/components/route/RouteList';

export default function HistoryPage() {
  const { data: routes, isLoading } = useRouteHistory();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Historique des sorties</h1>
      {isLoading ? (
        <p className="text-muted">Chargement…</p>
      ) : (
        <RouteList routes={routes ?? []} emptyLabel="Aucune sortie générée pour le moment." />
      )}
    </div>
  );
}
