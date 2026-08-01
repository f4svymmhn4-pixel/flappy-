# Bike Route Generator

Une application web qui génère automatiquement les meilleurs parcours vélo
autour de votre domicile — boucle ou aller simple — en analysant le réseau
routier, les pistes cyclables, le revêtement, le dénivelé, les paysages et les
points d'intérêt, puis en notant chaque itinéraire possible pour choisir le
meilleur.

Adresse de départ par défaut : **29 Avenue François Mitterrand, 33700
Mérignac, France** — ou votre position GPS actuelle.

## Sommaire

- [Architecture](#architecture)
- [Choix techniques](#choix-techniques)
- [APIs utilisées, coûts et limites](#apis-utilisées-coûts-et-limites)
- [Démarrage rapide (Docker)](#démarrage-rapide-docker)
- [Développement local (sans Docker)](#développement-local-sans-docker)
- [Variables d'environnement](#variables-denvironnement)
- [Structure du projet](#structure-du-projet)
- [Tests](#tests)
- [Déploiement en production](#déploiement-en-production)
- [Limites connues et roadmap](#limites-connues-et-roadmap)

## Architecture

```
┌─────────────┐      ┌──────────────┐      ┌──────────────────────┐
│  Frontend   │──────▶│   Backend    │──────▶│  PostgreSQL + PostGIS │
│  Next.js    │  REST │   NestJS     │  SQL  │  (routes, favoris,    │
│  MapLibre   │◀──────│  TypeORM     │◀──────│  historique, prefs)   │
└─────────────┘      └──────┬───────┘      └──────────────────────┘
                             │
              ┌──────────────┼───────────────────────────────┐
              ▼              ▼               ▼               ▼
      OpenRouteService  GraphHopper    Overpass API    Open-Elevation
      (routage + score)  (secours)   (POI, zones à    (dénivelé de
                                        éviter)          secours)
                             │
                     Wikipedia / OpenTripMap
                       (enrichissement POI)
```

- **Frontend** (`/frontend`) — Next.js 14 (App Router), TypeScript, Tailwind
  CSS, composants shadcn-style écrits à la main (pas de dépendance Radix pour
  garder le bundle léger), MapLibre GL JS via `react-map-gl`, React Query pour
  la gestion des requêtes, Auth.js (NextAuth) pour l'authentification.
- **Backend** (`/backend`) — NestJS, TypeScript, TypeORM. Modules dédiés :
  `auth`, `users`, `bikes`, `preferences`, `routing` (génération + scoring),
  `poi`, `elevation`, `export`, `favorites`.
- **Base de données** (`/database`) — PostgreSQL 16 + PostGIS. Schéma en SQL
  brut (`database/init/*.sql`), monté dans le conteneur Postgres au premier
  démarrage — c'est la source de vérité du schéma (TypeORM `synchronize` est
  désactivé pour ne pas entrer en conflit avec les colonnes géométriques).

## Choix techniques

### Pourquoi ces choix

- **MapLibre GL JS + tuiles OSM brutes** plutôt que Google Maps/Mapbox : pas
  de clé API obligatoire, pas de coût, licence libre. Le style par défaut
  utilise les tuiles raster `tile.openstreetmap.org` (usage personnel/dev) ;
  passez à Thunderforest (OpenCycleMap) avec une clé pour un usage plus
  intensif ou en production (voir `.env.example`).
- **OpenRouteService en priorité, GraphHopper en secours** : ORS est la seule
  API gratuite grand public qui expose à la fois `options.round_trip` (pour
  générer une vraie boucle) et `extra_info` (surface, type de voie, pente,
  "suitability" cyclable, verdure, bruit) — c'est ce deuxième point qui rend
  le moteur "intelligent" plutôt que purement plus-court-chemin. GraphHopper
  ne fournit pas cette granularité ; en secours, le score se limite donc à la
  distance/dénivelé (voir `ScoringService` et le commentaire dans
  `graphhopper.client.ts`).
- **TypeORM plutôt que Prisma** : Prisma ne supporte pas nativement les
  colonnes `geometry` PostGIS ; TypeORM les gère en natif (colonne `geometry`
  + `ST_GeomFromGeoJSON` généré automatiquement à l'insertion).
- **JWT + Auth.js Credentials** plutôt que Clerk : évite une dépendance à un
  service tiers payant pour un projet auto-hébergeable de bout en bout. Le
  backend NestJS émet le JWT (bcrypt + Passport), le frontend le stocke via
  la session Auth.js.

### Comment le moteur "note" un parcours

`ScoringService` calcule 7 sous-scores (beauté, sécurité, fluidité, intérêt
touristique, qualité du revêtement, plaisir de pilotage, variété) à partir des
couches `extra_info` d'ORS et des POI trouvés à proximité, pondérés selon la
priorité choisie (tourisme, performance, paysage...). Le total (0-100) donne
la note en étoiles (0 à 5, par pas de 0,5) et une explication textuelle du
critère dominant. Voir `backend/src/modules/routing/scoring/scoring.service.ts`.

Le "bending" intelligent : si vos préférences demandent des lacs / vignobles /
panoramas / bords de rivière / littoral, le service interroge Overpass pour
trouver des candidats à proximité, puis construit l'itinéraire en passant
explicitement par les 1-2 meilleurs plutôt que de faire un `round_trip` aveugle
(`route-generation.service.ts`). C'est une heuristique de "bending vers les
POI", pas un moteur de recherche de graphe réécrit from scratch — ORS reste le
moteur de routage sous-jacent.

## APIs utilisées, coûts et limites

| API | Usage | Coût | Limite connue |
|---|---|---|---|
| **OpenRouteService** | Routage, boucle (`round_trip`), géocodage, extra_info (surface/pente/suitability/verdure/bruit) | Gratuit avec clé | 2000 req/jour (directions), 500 req/jour (round_trip) |
| **GraphHopper** | Secours si ORS indisponible/quota dépassé | Gratuit avec clé | 500 req/jour ; pas d'extra_info détaillé → score dégradé |
| **Overpass API** | POI (belvédères, lacs, vignobles, châteaux...) + zones industrielles à éviter | Gratuit, sans clé | Instance publique rate-limitée ; auto-hébergement recommandé en prod |
| **Open-Elevation** | Dénivelé de secours si le fournisseur de routage n'en renvoie pas | Gratuit, sans clé | Instance publique rate-limitée |
| **Wikipedia REST API** | Description + photo des POI | Gratuit, sans clé | Aucune (usage raisonnable) |
| **OpenTripMap** | Photos de POI en complément de Wikipedia | Gratuit avec clé | 1000 req/jour |
| **Mapillary** | Réservé pour une future vue "street-level" | Gratuit avec clé | Non branché dans l'UI pour l'instant |
| **Thunderforest / OpenCycleMap** | Fond de carte cyclable alternatif | Gratuit avec clé | 150 000 tuiles/mois |
| **Geovelo** | — | — | **Pas d'API publique en libre-service** : nécessite un partenariat commercial. Non intégré (voir roadmap). |
| **RideWithGPS** | Création de route via API | Gratuit pour développeurs enregistrés | Nécessite une clé d'app développeur ; sans clé, export GPX + import manuel |

## Démarrage rapide (Docker)

Prérequis : Docker + Docker Compose.

```bash
cp .env.example .env
# Éditez .env : au minimum JWT_SECRET, NEXTAUTH_SECRET, et ORS_API_KEY
# (créez une clé gratuite sur https://openrouteservice.org/dev/#/signup)

docker compose up --build
```

- Frontend : http://localhost:3000
- Backend : http://localhost:4000/api
- PostgreSQL/PostGIS : localhost:5432

Le schéma SQL (`database/init/*.sql`) est appliqué automatiquement au premier
démarrage du conteneur `postgres`.

## Développement local (sans Docker)

```bash
# 1. Base de données
docker run -d --name bike-postgres -p 5432:5432 \
  -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=bike_routes \
  postgis/postgis:16-3.4-alpine
psql postgresql://postgres:postgres@localhost:5432/bike_routes \
  -f database/init/001_extensions.sql
psql postgresql://postgres:postgres@localhost:5432/bike_routes \
  -f database/init/002_schema.sql

# 2. Backend
cd backend
cp .env.example .env   # renseignez ORS_API_KEY etc.
npm install
npm run start:dev      # http://localhost:4000/api

# 3. Frontend (autre terminal)
cd frontend
cp .env.example .env.local
npm install
npm run dev             # http://localhost:3000
```

## Variables d'environnement

Voir `.env.example` (racine, pour Docker Compose), `backend/.env.example` et
`frontend/.env.example` (dev local). Aucune clé n'est codée en dur dans le
code — tout passe par `ConfigService` (backend) ou `process.env` (frontend).

## Structure du projet

```
/frontend
  /app              # Pages App Router (onboarding, routes/[id], history, favorites, login...)
  /components       # ui/, onboarding/, map/, route/, layout/
  /hooks            # useGeolocation, useRoutes (React Query), useApiToken
  /lib              # api.ts, auth.ts, types.ts, theme-provider.tsx
/backend
  /src
    /entities       # User, Bike, Preferences, Route, RouteStats (TypeORM)
    /modules
      /auth         # JWT, bcrypt, Passport
      /users /bikes /preferences /favorites
      /routing      # génération, scoring, providers ORS/GraphHopper, geocoding
      /poi          # Overpass + Wikipedia + OpenTripMap
      /elevation    # Open-Elevation (secours)
      /export       # GPX / TCX / KML / GeoJSON / FIT + deep links
    /common/geo     # calculs géographiques (haversine, bearing, bbox)
/database
  /init             # 001_extensions.sql, 002_schema.sql (PostGIS)
```

## Tests

```bash
cd backend
npm test           # Jest — géométrie, scoring, extraction extra_info,
                    # export GPX/TCX/KML/FIT, deep links
```

Les tests couvrent les fonctions critiques et pures (calculs géographiques,
moteur de score, parsing des `extra_info` ORS, générateurs de fichiers
d'export, construction des deep links) — pas d'appels réseau réels vers les
APIs tierces (ORS/Overpass/etc. sont mockables via leurs clients dédiés).

## Déploiement en production

### Option A — Vercel (frontend) + Railway (backend + Postgres)

1. **Railway** : créez un service PostgreSQL avec l'image
   `postgis/postgis:16-3.4-alpine` (Railway permet une image Docker
   personnalisée), exécutez les scripts `database/init/*.sql` une fois via
   `psql`, puis déployez `/backend` comme service Docker (utilise le
   `Dockerfile` fourni). Renseignez toutes les variables de
   `backend/.env.example` dans les "Variables" du service Railway.
2. **Vercel** : déployez `/frontend`. Renseignez `NEXT_PUBLIC_API_URL` (URL
   publique du backend Railway), `NEXTAUTH_URL` (URL Vercel), `NEXTAUTH_SECRET`.
3. Mettez à jour `FRONTEND_URL` côté backend avec l'URL Vercel (CORS).

### Option B — VPS avec Docker Compose

```bash
git clone <repo> && cd bike-route-generator
cp .env.example .env   # valeurs de production, secrets forts
docker compose up -d --build
```

Ajoutez un reverse proxy (Caddy/Nginx/Traefik) devant les ports 3000/4000
pour le TLS et servez le tout derrière un nom de domaine. Pensez à limiter
l'exposition du port PostgreSQL (5432) à l'extérieur en production.

## Limites connues et roadmap

- **Geovelo** : pas d'API publique en libre-service, nécessite un partenariat
  — non intégré.
- **Deep links Komoot / Strava / Garmin Connect / Wahoo** : ces plateformes
  n'exposent pas d'import de tracé par simple URL ; l'app fournit l'export
  GPX/TCX/FIT et un lien vers l'import manuel de chaque plateforme plutôt que
  de simuler un lien qui ne fonctionnerait pas réellement.
- **Export FIT** : encodeur minimal maison (identifiant fichier, course, lap,
  points position/altitude/distance) — pas de points de manœuvre ni de champs
  développeur.
- **Aller simple (non-boucle)** : la destination est projetée à une distance
  et un cap approximatifs puis routée via ORS ; ce n'est pas encore optimisé
  pour viser un point d'intérêt précis comme le fait le mode boucle.
- **Next.js 14.2.x** : des CVE plus récentes (SSRF via rewrites, disclosure de
  Server Functions) ne sont corrigées qu'à partir de Next 15/16, qui changent
  l'API des routes dynamiques (`params` devient une Promise). Migration
  recommandée avant une mise en production à fort trafic.
- **Mapillary** : clé documentée mais pas encore branchée dans l'UI (vue
  street-level prévue).
