'use client';

import { useDeepLinks } from '@/hooks/useRoutes';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const SUPPORT_BADGE: Record<string, { label: string; className: string }> = {
  full: { label: 'Lien direct', className: 'bg-brand-100 text-brand-800' },
  approximate: { label: 'Approximatif', className: 'bg-amber-100 text-amber-800' },
  manual_import: { label: 'Import manuel', className: 'bg-slate-200 text-slate-700' },
};

export function NavigationLinks({ routeId }: { routeId: string }) {
  const { data: links, isLoading } = useDeepLinks(routeId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ouvrir dans une autre app</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading && <p className="text-sm text-muted">Chargement…</p>}
        {links?.map((link) => {
          const badge = SUPPORT_BADGE[link.supportLevel];
          return (
            <div key={link.app} className="flex flex-col gap-2 rounded-xl border border-[rgb(var(--border))] p-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{link.label}</span>
                  <Badge className={badge.className}>{badge.label}</Badge>
                </div>
                <p className="text-xs text-muted">{link.note}</p>
              </div>
              {link.url && (
                <a href={link.url} target="_blank" rel="noreferrer">
                  <Button variant="outline" size="sm">
                    Ouvrir
                  </Button>
                </a>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
