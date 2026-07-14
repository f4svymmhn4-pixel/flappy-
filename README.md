# BETIZ

Jeu mobile multijoueur temps réel : 5 joueurs, 5 manches, une question à choix
multiple par manche, le plus rapide gagne le plus de points. Chaque joueur
incarne un animal qui court vers la réponse choisie.

Flutter (Clean Architecture + MVVM + Riverpod + GoRouter) côté client,
Supabase (Postgres + Auth + Realtime + Storage) côté backend, Firebase pour
analytics / crash reporting / notifications push.

## Statut

Développement par étapes (voir `ARCHITECTURE.md` pour le détail de chaque
étape). Étape en cours : **1. Architecture**.

## Démarrage

Prérequis : Flutter 3.44+ (stable), un projet Supabase, un projet Firebase.

```sh
flutter pub get

# Copier le fichier d'exemple et renseigner les vraies valeurs Supabase
cp env/dev.json.example env/dev.json

# Générer lib/firebase_options.dart (nécessite le CLI flutterfire)
flutterfire configure

flutter run --dart-define-from-file=env/dev.json
```

## Qualité

```sh
flutter analyze
flutter test
```

## Structure

Voir `ARCHITECTURE.md`.
