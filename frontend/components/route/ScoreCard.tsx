import type { RouteRecord } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const CRITERIA_LABELS: Record<string, string> = {
  beauty: 'Beauté',
  safety: 'Sécurité',
  flow: 'Fluidité',
  tourism: 'Intérêt touristique',
  surfaceQuality: 'Qualité du bitume',
  funFactor: 'Plaisir de pilotage',
  variety: 'Variété',
};

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="text-2xl" aria-label={`${rating} sur 5 étoiles`}>
      {Array.from({ length: 5 }, (_, i) => (i < full ? '⭐' : i === full && half ? '✨' : '☆')).join('')}
    </span>
  );
}

export function ScoreCard({ route }: { route: RouteRecord }) {
  const breakdown = route.scoreBreakdown;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Qualité du parcours</CardTitle>
        <div className="flex items-center gap-2">
          <Stars rating={route.starRating} />
          <span className="text-lg font-bold">{route.scoreTotal}/100</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted">{route.starExplanation}</p>
        <div className="space-y-3">
          {Object.entries(CRITERIA_LABELS).map(([key, label]) => {
            const value = (breakdown as unknown as Record<string, number>)[key] ?? 0;
            const explanation = breakdown.explanations?.[key];
            return (
              <div key={key}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium">{label}</span>
                  <span className="text-muted">{value}/100</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-800">
                  <div className="h-1.5 rounded-full bg-brand-500" style={{ width: `${value}%` }} />
                </div>
                {explanation && <p className="mt-1 text-xs text-muted">{explanation}</p>}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
