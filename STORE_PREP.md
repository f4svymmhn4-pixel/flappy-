# Préparation App Store / Google Play

État : le code est prêt à être *construit* pour la publication ; ce qui
suit est tout ce qui reste et qui ne peut pas être fait dans ce dépôt
(comptes développeur, clés de signature, visuels finaux, formulaires des
stores).

## 1. Identité de l'app

- **Bundle ID / Application ID** : `com.betiz.betiz` (défini dans
  `android/app/build.gradle.kts` et via `PRODUCT_BUNDLE_IDENTIFIER` côté
  iOS). À changer avant publication si `com.betiz` n'est pas le domaine
  réellement détenu par l'éditeur — l'ID ne peut plus être modifié après
  la première soumission.
- **Nom affiché** : "Betiz" (`CFBundleDisplayName` / `android:label`).
- **Version** : pilotée par `pubspec.yaml` (`version: X.Y.Z+N`) — `X.Y.Z`
  devient `CFBundleShortVersionString`/`versionName`, `N` devient
  `CFBundleVersion`/`versionCode`. Incrémenter `N` à chaque soumission.

## 2. Signature

### Android

1. Générer un keystore d'upload (une seule fois, à conserver précieusement —
   sa perte empêche toute mise à jour future de l'app) :
   ```sh
   keytool -genkey -v -keystore upload-keystore.jks -keyalg RSA \
     -keysize 2048 -validity 10000 -alias upload
   ```
2. Copier `android/key.properties.example` vers `android/key.properties`
   (déjà exclu du contrôle de version) et renseigner les vraies valeurs.
3. `android/app/build.gradle.kts` utilise automatiquement ce fichier s'il
   existe ; sans lui, le build `release` retombe sur la clé debug (pratique
   en local, à ne jamais publier ainsi).
4. Build : `flutter build appbundle --release`.

### iOS

Signature gérée via Xcode / App Store Connect (profil de provisioning +
certificat de distribution) — nécessite un compte Apple Developer. Build :
`flutter build ipa --release`.

## 3. Icône & écran de lancement

Aucun visuel final n'existe encore dans ce dépôt (`assets/images/icons/`
n'a que des animaux placeholder, pas d'icône d'app). Avant publication :

1. Fournir une icône 1024×1024 (fond plein, sans transparence pour iOS).
2. Générer les tailles avec `flutter_launcher_icons` (à ajouter en
   dev_dependency) ou manuellement.
3. Écran de lancement : la marque utilise déjà `AppColors.primary`
   (`#2FB380`) comme couleur de fond dans le splash Flutter
   (`lib/features/splash/presentation/screens/splash_screen.dart`) — les
   launch screens natifs (`ios/Runner/Base.lproj/LaunchScreen.storyboard`,
   `android/app/src/main/res/drawable/launch_background.xml`) doivent être
   mis à jour pour matcher, sans quoi il y a un flash de couleur au
   démarrage.

## 4. Orientation

Verrouillée en portrait sur iPhone et Android (`UISupportedInterfaceOrientations`
dans `Info.plist`, `android:screenOrientation="portrait"` dans
`AndroidManifest.xml`) — toute l'UI (grille de réponses 2×2, barre de
temps) est conçue portrait uniquement ; le paysage n'a jamais été testé et
casserait probablement la mise en page. iPad reste portrait +
portrait-inversé (pas de mode paysage forcé, mais pas de rotation libre
non plus).

## 5. Firebase

`lib/firebase_options.dart` n'est pas versionné (généré par
`flutterfire configure`, voir `README.md`). Avant tout build de
publication :

```sh
flutterfire configure
```

Cela crée/relie un projet Firebase réel et génère les fichiers natifs
requis (`google-services.json`, `GoogleService-Info.plist`) — également
non versionnés (voir `.gitignore`).

## 6. Confidentialité

L'app collecte : pseudo, statistiques de jeu, jetons/animaux débloqués
(Supabase), et des données d'usage (Firebase Analytics/Crashlytics). Ni
localisation, ni caméra, ni contacts ne sont utilisés — aucune
description d'usage de permission sensible n'est nécessaire dans
`Info.plist` au-delà de ce qui existe déjà.

Obligatoire avant soumission :
- Une politique de confidentialité publique (URL) décrivant cette
  collecte, exigée par les deux stores.
- Remplir le questionnaire de confidentialité d'App Store Connect
  ("App Privacy") et la section "Sécurité des données" de Play Console en
  conséquence.

## 7. Fiche store (à rédiger)

- Description courte/longue en français (ton "moderne, amusant, premium"
  cohérent avec le reste de l'app).
- Mots-clés : quiz, animaux, multijoueur, party game, culture générale.
- Catégorie : Jeux > Trivia / Quiz.
- Classification d'âge : contenu tout public (pas de violence, contenu
  généré par les joueurs limité aux emotes prédéfinies) — à confirmer via
  les questionnaires officiels (Apple Age Rating, Play Content Rating).
- Captures d'écran : à produire une fois l'icône/les assets d'animaux
  finalisés (accueil, sélection d'animal, une manche en cours, écran de
  classement, boutique).

## 8. Checklist finale avant soumission

- [ ] `flutter analyze` et `flutter test` verts (déjà le cas dans ce dépôt).
- [ ] `flutterfire configure` exécuté avec le vrai projet Firebase de prod.
- [ ] `env/dev.json` (ou équivalent prod) pointant vers le vrai projet
      Supabase, migrations appliquées (`supabase db push`).
- [ ] Icône + launch screen finalisés.
- [ ] `flutter build appbundle --release` et `flutter build ipa --release`
      testés sur un vrai appareil (ce dépôt n'a pas pu le faire — aucun SDK
      Android/Xcode dans cet environnement).
- [ ] Politique de confidentialité publiée.
- [ ] Fiches store (descriptions, captures, classification) prêtes dans
      App Store Connect / Play Console.
