import type { RouteRecord } from '@/lib/types';
import { Card, CardContent } from '../ui/card';

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  return h > 0 ? `${h}h${m.toString().padStart(2, '0')}` : `${m}min`;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}

function Bar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-muted">
        <span>{label}</span>
        <span>{value.toFixed(0)}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
        <div className="h-2 rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

export function RouteStats({ route }: { route: RouteRecord }) {
  return (
    <Card>
      <CardContent className="space-y-6 pt-5">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          <Stat label="Distance" value={`${(route.distanceM / 1000).toFixed(1)} km`} />
          <Stat label="Temps estimé" value={formatDuration(route.durationS)} />
          <Stat label="D+" value={`${route.ascentM} m`} />
          <Stat label="D-" value={`${route.descentM} m`} />
          <Stat label="Vitesse moy." value={`${route.avgSpeedKmh} km/h`} />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-semibold">Profil</p>
            <Bar label="Plat" value={route.pctFlat} color="#64748b" />
            <Bar label="Montée" value={route.pctClimb} color="#dc2626" />
            <Bar label="Descente" value={route.pctDescent} color="#0f8f56" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold">Type de voies</p>
            <Bar label="Pistes cyclables" value={route.pctBikeLane} color="#1bb06a" />
            <Bar label="Routes secondaires" value={route.pctSecondary} color="#3b82f6" />
            <Bar label="Départementales" value={route.pctDepartmental} color="#f59e0b" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
