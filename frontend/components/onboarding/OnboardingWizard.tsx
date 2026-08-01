'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { OptionCard } from '../ui/option-card';
import { Switch } from '../ui/switch';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useGenerateRoute } from '@/hooks/useRoutes';
import type {
  BikeType,
  Difficulty,
  ElevationProfile,
  GenerateRoutePayload,
  Priority,
} from '@/lib/types';

const BIKE_OPTIONS: Array<{ value: BikeType; label: string; icon: string; description: string }> = [
  { value: 'road', label: 'Vélo de route', icon: '🚴', description: 'Bitume parfait uniquement' },
  { value: 'gravel', label: 'Gravel', icon: '🚵', description: 'Chemins blancs, voies vertes' },
  { value: 'mtb', label: 'VTT', icon: '⛰️', description: 'Tout terrain autorisé' },
  { value: 'electric', label: 'Vélo électrique', icon: '🔋', description: 'Assistance électrique' },
  { value: 'city', label: 'Ville', icon: '🏙️', description: 'Balade urbaine' },
];

const DISTANCE_PRESETS = [20, 30, 40, 50, 60, 80, 100, 120, 150];

const DIFFICULTY_OPTIONS: Array<{ value: Difficulty; label: string }> = [
  { value: 'very_easy', label: 'Très facile' },
  { value: 'easy', label: 'Facile' },
  { value: 'medium', label: 'Moyenne' },
  { value: 'sporty', label: 'Sportive' },
  { value: 'very_sporty', label: 'Très sportive' },
];

const ELEVATION_OPTIONS: Array<{ value: ElevationProfile; label: string }> = [
  { value: 'very_flat', label: 'Très plat' },
  { value: 'flat', label: 'Plat' },
  { value: 'some_hills', label: 'Quelques côtes' },
  { value: 'rolling', label: 'Vallonné' },
  { value: 'mountain', label: 'Montagne' },
  { value: 'custom', label: 'Personnalisé (m D+)' },
];

const PRIORITY_OPTIONS: Array<{ value: Priority; label: string; icon: string }> = [
  { value: 'tourism', label: 'Curiosité touristique', icon: '🏛️' },
  { value: 'performance', label: 'Performance', icon: '⚡' },
  { value: 'scenery', label: 'Beauté du paysage', icon: '🌄' },
  { value: 'quiet_roads', label: 'Routes calmes', icon: '🤫' },
  { value: 'max_bike_lanes', label: 'Maximum de pistes cyclables', icon: '🚲' },
  { value: 'climbing', label: 'Montées', icon: '⛰️' },
  { value: 'descent', label: 'Descentes', icon: '⬇️' },
  { value: 'training', label: 'Entraînement', icon: '💪' },
  { value: 'leisure', label: 'Balade', icon: '🌿' },
];

const DEFAULT_ADDRESS = '29 Avenue François Mitterrand, 33700 Mérignac, France';

type StartMode = 'default' | 'address' | 'gps';

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const geolocation = useGeolocation();
  const generateRoute = useGenerateRoute();

  const [startMode, setStartMode] = useState<StartMode>('default');
  const [address, setAddress] = useState(DEFAULT_ADDRESS);

  const [bikeType, setBikeType] = useState<BikeType>('road');
  const [distanceKm, setDistanceKm] = useState(40);
  const [customDistance, setCustomDistance] = useState(false);
  const [durationMinutes, setDurationMinutes] = useState<number | undefined>(undefined);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [elevationProfile, setElevationProfile] = useState<ElevationProfile>('rolling');
  const [elevationCustomM, setElevationCustomM] = useState(500);
  const [priority, setPriority] = useState<Priority>('scenery');
  const [isLoop, setIsLoop] = useState(true);

  const [avoid, setAvoid] = useState({
    avoidGravel: bikeType === 'road',
    avoidDirt: bikeType === 'road',
    avoidForest: false,
    avoidCityCenter: true,
    avoidTraffic: true,
    avoidTrunkRoads: true,
    avoidNoBikeLane: false,
    avoidIndustrial: true,
    avoidRoadworks: true,
  });

  const [extra, setExtra] = useState({
    followBikeLanes: true,
    preferSmallRoads: true,
    avoidTrafficLights: false,
    avoidStopSigns: false,
    preferRiverside: false,
    preferVineyards: false,
    preferViewpoints: true,
    preferLakes: false,
    preferOcean: false,
  });

  const steps = ['Vélo', 'Distance & temps', 'Difficulté & dénivelé', 'Priorité', 'Préférences', 'Départ'];

  const payload: GenerateRoutePayload = useMemo(
    () => ({
      start:
        startMode === 'gps' && geolocation.lat && geolocation.lon
          ? { lat: geolocation.lat, lon: geolocation.lon }
          : { address: startMode === 'address' ? address : DEFAULT_ADDRESS },
      bikeType,
      distanceKm,
      durationMinutes,
      difficulty,
      elevationProfile,
      elevationCustomM: elevationProfile === 'custom' ? elevationCustomM : undefined,
      priority,
      isLoop,
      ...avoid,
      ...extra,
    }),
    [startMode, geolocation.lat, geolocation.lon, address, bikeType, distanceKm, durationMinutes, difficulty, elevationProfile, elevationCustomM, priority, isLoop, avoid, extra],
  );

  const handleGenerate = async () => {
    const route = await generateRoute.mutateAsync(payload);
    router.push(`/routes/${route.id}`);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center gap-2">
        {steps.map((label, i) => (
          <div key={label} className="flex flex-1 flex-col items-center gap-1">
            <div
              className={`h-1.5 w-full rounded-full ${i <= step ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-800'}`}
            />
            <span className="hidden text-[11px] text-muted sm:block">{label}</span>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[step]}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {BIKE_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  selected={bikeType === opt.value}
                  onClick={() => {
                    setBikeType(opt.value);
                    if (opt.value === 'road') {
                      setAvoid((a) => ({ ...a, avoidGravel: true, avoidDirt: true }));
                    }
                  }}
                  icon={opt.icon}
                  label={opt.label}
                  description={opt.description}
                />
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <p className="mb-2 text-sm font-medium">Distance</p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {DISTANCE_PRESETS.map((d) => (
                    <OptionCard
                      key={d}
                      selected={!customDistance && distanceKm === d}
                      onClick={() => {
                        setCustomDistance(false);
                        setDistanceKm(d);
                      }}
                      label={`${d} km`}
                    />
                  ))}
                  <OptionCard selected={customDistance} onClick={() => setCustomDistance(true)} label="Personnalisé" />
                </div>
                {customDistance && (
                  <input
                    type="number"
                    min={1}
                    max={400}
                    value={distanceKm}
                    onChange={(e) => setDistanceKm(Number(e.target.value))}
                    className="mt-3 w-32 rounded-lg border border-[rgb(var(--border))] bg-transparent px-3 py-2"
                  />
                )}
              </div>

              <div>
                <p className="mb-2 text-sm font-medium">Temps estimé souhaité (optionnel)</p>
                <div className="flex flex-wrap gap-2">
                  {[60, 90, 120, 180, 240].map((m) => (
                    <OptionCard
                      key={m}
                      selected={durationMinutes === m}
                      onClick={() => setDurationMinutes(m)}
                      label={m < 120 ? `${m}min` : `${Math.floor(m / 60)}h${m % 60 || ''}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <p className="mb-2 text-sm font-medium">Difficulté</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {DIFFICULTY_OPTIONS.map((opt) => (
                    <OptionCard
                      key={opt.value}
                      selected={difficulty === opt.value}
                      onClick={() => setDifficulty(opt.value)}
                      label={opt.label}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">Dénivelé</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {ELEVATION_OPTIONS.map((opt) => (
                    <OptionCard
                      key={opt.value}
                      selected={elevationProfile === opt.value}
                      onClick={() => setElevationProfile(opt.value)}
                      label={opt.label}
                    />
                  ))}
                </div>
                {elevationProfile === 'custom' && (
                  <input
                    type="number"
                    min={0}
                    value={elevationCustomM}
                    onChange={(e) => setElevationCustomM(Number(e.target.value))}
                    className="mt-3 w-32 rounded-lg border border-[rgb(var(--border))] bg-transparent px-3 py-2"
                  />
                )}
              </div>
              <Switch
                checked={isLoop}
                onChange={setIsLoop}
                label="Boucle (retour au point de départ)"
                description="Désactivez pour un aller simple"
              />
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {PRIORITY_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  selected={priority === opt.value}
                  onClick={() => setPriority(opt.value)}
                  icon={opt.icon}
                  label={opt.label}
                />
              ))}
            </div>
          )}

          {step === 4 && (
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="mb-1 text-sm font-semibold">Éviter</p>
                <Switch checked={avoid.avoidGravel} onChange={(v) => setAvoid((a) => ({ ...a, avoidGravel: v }))} label="Gravier" />
                <Switch checked={avoid.avoidDirt} onChange={(v) => setAvoid((a) => ({ ...a, avoidDirt: v }))} label="Terre" />
                <Switch checked={avoid.avoidForest} onChange={(v) => setAvoid((a) => ({ ...a, avoidForest: v }))} label="Forêt" />
                <Switch checked={avoid.avoidCityCenter} onChange={(v) => setAvoid((a) => ({ ...a, avoidCityCenter: v }))} label="Centre-ville" />
                <Switch checked={avoid.avoidTraffic} onChange={(v) => setAvoid((a) => ({ ...a, avoidTraffic: v }))} label="Trafic" />
                <Switch checked={avoid.avoidTrunkRoads} onChange={(v) => setAvoid((a) => ({ ...a, avoidTrunkRoads: v }))} label="Grandes nationales" />
                <Switch checked={avoid.avoidNoBikeLane} onChange={(v) => setAvoid((a) => ({ ...a, avoidNoBikeLane: v }))} label="Routes sans bande cyclable" />
                <Switch checked={avoid.avoidIndustrial} onChange={(v) => setAvoid((a) => ({ ...a, avoidIndustrial: v }))} label="Zones industrielles" />
                <Switch checked={avoid.avoidRoadworks} onChange={(v) => setAvoid((a) => ({ ...a, avoidRoadworks: v }))} label="Travaux" />
              </div>
              <div>
                <p className="mb-1 text-sm font-semibold">Préférences supplémentaires</p>
                <Switch checked={extra.followBikeLanes} onChange={(v) => setExtra((s) => ({ ...s, followBikeLanes: v }))} label="Suivre les pistes cyclables dès que pertinent" />
                <Switch checked={extra.preferSmallRoads} onChange={(v) => setExtra((s) => ({ ...s, preferSmallRoads: v }))} label="Privilégier les petites routes" />
                <Switch checked={extra.avoidTrafficLights} onChange={(v) => setExtra((s) => ({ ...s, avoidTrafficLights: v }))} label="Éviter les feux rouges" />
                <Switch checked={extra.avoidStopSigns} onChange={(v) => setExtra((s) => ({ ...s, avoidStopSigns: v }))} label="Éviter les stops fréquents" />
                <Switch checked={extra.preferRiverside} onChange={(v) => setExtra((s) => ({ ...s, preferRiverside: v }))} label="Privilégier les bords de rivière" />
                <Switch checked={extra.preferVineyards} onChange={(v) => setExtra((s) => ({ ...s, preferVineyards: v }))} label="Passer dans les vignobles" />
                <Switch checked={extra.preferViewpoints} onChange={(v) => setExtra((s) => ({ ...s, preferViewpoints: v }))} label="Passer par les meilleurs panoramas" />
                <Switch checked={extra.preferLakes} onChange={(v) => setExtra((s) => ({ ...s, preferLakes: v }))} label="Passer près des lacs" />
                <Switch checked={extra.preferOcean} onChange={(v) => setExtra((s) => ({ ...s, preferOcean: v }))} label="Longer l’océan lorsque c’est possible" />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-3">
              <OptionCard
                selected={startMode === 'default'}
                onClick={() => setStartMode('default')}
                label="Mon adresse par défaut"
                description={DEFAULT_ADDRESS}
              />
              <OptionCard
                selected={startMode === 'gps'}
                onClick={() => {
                  setStartMode('gps');
                  geolocation.locate();
                }}
                label="Ma position GPS actuelle"
                description={
                  geolocation.loading
                    ? 'Localisation en cours…'
                    : geolocation.lat
                      ? `${geolocation.lat.toFixed(4)}, ${geolocation.lon?.toFixed(4)}`
                      : geolocation.error ?? 'Utiliser le GPS du navigateur'
                }
              />
              <OptionCard
                selected={startMode === 'address'}
                onClick={() => setStartMode('address')}
                label="Autre adresse"
              />
              {startMode === 'address' && (
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Tapez une adresse…"
                  className="w-full rounded-lg border border-[rgb(var(--border))] bg-transparent px-3 py-2"
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          Précédent
        </Button>
        {step < steps.length - 1 ? (
          <Button onClick={() => setStep((s) => s + 1)}>Suivant</Button>
        ) : (
          <Button onClick={handleGenerate} disabled={generateRoute.isPending}>
            {generateRoute.isPending ? 'Génération en cours…' : 'Générer mon parcours'}
          </Button>
        )}
      </div>

      {generateRoute.isError && (
        <p className="mt-3 text-sm text-red-600">
          Erreur lors de la génération : {(generateRoute.error as Error).message}
        </p>
      )}
    </div>
  );
}
