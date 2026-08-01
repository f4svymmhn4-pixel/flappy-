'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouteHistory } from '@/hooks/useRoutes';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function HomePage() {
  const { status } = useSession();
  const { data: recentRoutes } = useRouteHistory();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <section className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Le meilleur parcours vélo, <span className="text-brand-600">généré pour vous</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted">
          Analyse du réseau routier, des pistes cyclables, du dénivelé, des paysages et des points d’intérêt pour
          construire automatiquement une boucle — ou un aller simple — parfaitement adaptée à votre sortie.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/onboarding">
            <Button size="lg">Générer une sortie</Button>
          </Link>
          {status !== 'authenticated' && (
            <Link href="/login">
              <Button size="lg" variant="outline">
                Se connecter
              </Button>
            </Link>
          )}
        </div>
      </section>

      {status === 'authenticated' && recentRoutes && recentRoutes.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-4 text-xl font-semibold">Vos dernières sorties</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentRoutes.slice(0, 6).map((route) => (
              <Link key={route.id} href={`/routes/${route.id}`}>
                <Card className="cursor-pointer transition-transform hover:-translate-y-0.5">
                  <CardContent className="pt-5">
                    <p className="font-semibold">{route.name}</p>
                    <p className="text-sm text-muted">
                      {(route.distanceM / 1000).toFixed(1)} km · {route.ascentM}m D+ · {route.starRating}★
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
