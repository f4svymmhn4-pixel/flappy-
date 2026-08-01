'use client';

import Link from 'next/link';
import { useDeleteRoute, useToggleFavorite } from '@/hooks/useRoutes';
import type { RouteRecord } from '@/lib/types';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

export function RouteList({ routes, emptyLabel }: { routes: RouteRecord[]; emptyLabel: string }) {
  const toggleFavorite = useToggleFavorite();
  const deleteRoute = useDeleteRoute();

  if (routes.length === 0) {
    return <p className="py-12 text-center text-muted">{emptyLabel}</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {routes.map((route) => (
        <Card key={route.id}>
          <CardContent className="space-y-2 pt-5">
            <Link href={`/routes/${route.id}`} className="font-semibold hover:underline">
              {route.name}
            </Link>
            <p className="text-sm text-muted">
              {(route.distanceM / 1000).toFixed(1)} km · {route.ascentM}m D+ · {route.avgSpeedKmh} km/h ·{' '}
              {route.starRating}★
            </p>
            <p className="text-xs text-muted">{new Date(route.createdAt).toLocaleDateString('fr-FR')}</p>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => toggleFavorite.mutate(route.id)}>
                {route.isFavorite ? '★' : '☆'}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => deleteRoute.mutate(route.id)}>
                Supprimer
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
