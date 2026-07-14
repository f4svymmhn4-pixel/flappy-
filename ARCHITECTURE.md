# Architecture BETIZ

## Principes

- **Clean Architecture** en 3 couches par feature : `domain` (entités,
  contrats de repository, use cases — zéro dépendance Flutter/Supabase),
  `data` (implémentations concrètes : modèles sérialisables, data sources
  Supabase, implémentation des repositories), `presentation` (controllers
  Riverpod = ViewModels, écrans, widgets).
- **MVVM** : chaque écran a un controller Riverpod (`NotifierProvider` /
  `AsyncNotifierProvider`) qui expose un état immuable ; le widget ne
  contient aucune logique métier, uniquement du rendu et des callbacks vers
  le controller.
- **Riverpod** pour l'injection de dépendances et la gestion d'état — pas de
  service locator, pas de singleton global mutable. Toute dépendance
  traverse un `Provider`.
- **GoRouter** pour la navigation déclarative ; toutes les routes sont
  définies dans `lib/app/router`.
- **Result<T>** (`lib/core/error/result.dart`) au lieu d'exceptions non
  gérées entre les couches : chaque repository/use case retourne
  `Result<T>`, jamais un `throw` qui remonterait jusqu'à l'UI.

## Arborescence

```
lib/
  main.dart                # point d'entrée, délègue à bootstrap.dart
  bootstrap.dart           # init Firebase (best-effort) + Supabase + runApp
  app/
    app.dart                # MaterialApp.router racine
    router/                 # GoRouter, chemins de routes
    theme/                  # couleurs, typographie, spacing, ThemeData
  core/                     # code transverse, sans dépendance à une feature
    config/                 # Env (dart-define)
    error/                  # Failure, Exception, Result<T>
    logging/                # AppLogger
    network/                # NetworkInfo, provider du client Supabase
    widgets/                # widgets partagés (ex. PlaceholderScreen)
  features/
    <feature>/
      domain/
        entities/
        repositories/        # interfaces abstraites
        usecases/
      data/
        models/               # DTOs + (dé)sérialisation JSON
        datasources/          # appels Supabase bruts
        repositories/         # implémentation des interfaces domain
      presentation/
        controllers/          # Riverpod Notifiers = ViewModel
        screens/
        widgets/
```

Features prévues : `splash`, `onboarding` (pseudo), `home`, `lobby`
(matchmaking public/privé), `game` (boucle de partie), `shop`, `profile`,
`questions` (consommé par `game`), `animals` (référentiel des 50 animaux,
consommé par `shop`/`game`/`profile`).

## Gestion des erreurs

- Les *data sources* sont les seules autorisées à `throw` (types définis
  dans `core/error/exceptions.dart`).
- Les *repositories* attrapent ces exceptions et retournent un
  `Result<T>.failure(...)` avec le `Failure` approprié
  (`core/error/failure.dart`).
- Les *controllers* exposent un état qui inclut toujours un cas d'erreur
  explicite (jamais un `throw` non catché vers l'UI).
- `NetworkInfo` (`core/network/network_info.dart`) est vérifié avant tout
  appel réseau pour retourner un `NetworkFailure` immédiat plutôt que
  d'attendre un timeout.

## Configuration & secrets

- Aucune valeur sensible en dur dans le code. `Env`
  (`core/config/env.dart`) lit des constantes de compilation injectées via
  `--dart-define-from-file=env/dev.json` (voir `env/dev.json.example`).
  La clé anonyme Supabase est publique par conception (protégée par les
  policies RLS côté base) ; aucun secret serveur ne doit vivre côté client.
- `lib/firebase_options.dart` est généré localement par
  `flutterfire configure` et n'est pas versionné (voir `.gitignore`) — il
  diffère par développeur/environnement Firebase.

## Style de code

- Lint strict : `analysis_options.yaml` étend `flutter_lints` avec des
  règles supplémentaires (`strict-casts`, `strict-inference`,
  `strict-raw-types`, imports relatifs, imports triés, pas de
  `print`, etc.). `flutter analyze` doit rester à zéro warning avant tout
  merge.
- Pas de commentaire qui explique le "quoi" (le code doit être
  auto-descriptif) ; un commentaire n'est écrit que pour une contrainte non
  évidente (ex. pourquoi Firebase est initialisé en best-effort).

## Tests

- `test/unit/` : logique pure (domain, `Result`, mappers).
- `test/widget/` : rendu d'écrans isolés avec `ProviderScope(overrides: …)`.
- `test/integration/` (à venir, étape Tests) : parcours complets sur
  device/emulator via `integration_test`.
- Chaque nouvelle feature doit arriver avec ses tests dans le même commit ;
  aucune PR de logique métier sans test associé.

## Étapes de livraison

1. **Architecture** *(cette étape)* — squelette Clean Architecture, thème,
   router, gestion d'erreurs, config, tests d'exemple.
2. **Base de données Supabase** — schéma Postgres, RLS, migrations, seed.
3. **Backend** — RPC/Edge Functions (scoring, matchmaking, anti-triche).
4. **Frontend** — écrans réels (pseudo, accueil, sélection animal/difficulté).
5. **Temps réel** — channels Supabase Realtime (presence lobby, sync partie).
6. **Matchmaking** — file publique par difficulté, salons privés par code,
   reconnexion.
7. **Gameplay** — boucle de partie (5 manches x 10s), scoring, classement.
8. **Animations** — déplacement des animaux, transitions de classement,
   micro-interactions.
9. **Boutique** — catalogue des 50 animaux, coûts en jetons, achats.
10. **Profil** — stats, historique, animaux débloqués.
11. **Tests** — couverture unit/widget/integration complète.
12. **Optimisation** — performance, batterie, latence réseau.
13. **Préparation stores** — icônes, splash natif, métadonnées, signing.

Chaque étape est validée (`flutter analyze` + `flutter test` verts) avant de
passer à la suivante.
