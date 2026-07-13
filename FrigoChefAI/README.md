# FrigoChef AI (nom provisoire)

Application iPhone (SwiftUI, iOS 17+) qui identifie les aliments visibles
sur une photo de réfrigérateur et propose des idées de repas réalistes,
sans aucune saisie manuelle.

## Ouvrir le projet

1. Ouvrir `FrigoChefAI.xcodeproj` dans Xcode 15+.
2. Sélectionner le scheme **FrigoChefAI** et un simulateur iPhone.
3. `Cmd+R` pour lancer l'app, `Cmd+U` pour lancer les tests.

L'app fonctionne immédiatement, sans clé API : toute la couche IA est
alimentée par des implémentations "mock" réalistes (voir plus bas).

## Architecture

Le projet suit une architecture **MVVM** organisée par couches :

```
FrigoChefAI/
├── App/                 Point d'entrée (@main), composition racine
├── Core/
│   ├── DesignSystem/     Couleurs, typographie, espacements, dégradés
│   ├── Components/       Vues réutilisables (boutons, cartes, chips, loaders…)
│   └── Navigation/       Routing (NavigationPath + enum de destinations)
├── Models/               Modèles de domaine (structs Codable, purs, sans dépendance UI)
├── Services/
│   ├── AI/               Abstractions IA (vision + génération de recettes) + mocks
│   ├── Images/            Abstraction "photo du plat"
│   ├── Persistence/       SwiftData (favoris, historique)
│   └── MediaCapture/      Caméra / sélecteur de photos
├── Features/             Un dossier par écran : View + ViewModel (@Observable)
│   ├── Home, Analysis, Results, RecipeDetail, Filters, Favorites, History
└── Resources/            Assets.xcassets, Info.plist, données mock JSON
```

**Pourquoi ce découpage ?** Chaque couche ne connaît que celle du dessous :
les `Features` dépendent des `Services` et `Models` via des **protocols**,
jamais d'une implémentation concrète. Cela rend chaque brique testable et
remplaçable isolément — condition explicitement demandée pour pouvoir
brancher une vraie IA plus tard sans toucher à l'UI.

## Remplacer la couche IA par un vrai fournisseur

Toute la logique IA passe par deux protocoles, injectés via
`AppDependencies` (`Services/AppDependencies.swift`) et exposés à toute
l'app par `EnvironmentValues.dependencies` :

- `VisionAnalysisServiceProtocol` — analyse une photo → `[DetectedIngredient]`
- `RecipeGenerationServiceProtocol` — ingrédients détectés → recettes par catégorie

Pour brancher GPT-4.1 Vision, GPT-5 Vision, Claude Vision ou un modèle
maison :

1. Créer `OpenAIVisionAnalysisService: VisionAnalysisServiceProtocol` (et/ou
   son équivalent pour les recettes) dans `Services/AI/`.
2. Remplacer l'instance `Mock...` par la nouvelle implémentation dans
   `FrigoChefAIApp.init()` (ou dans `AppDependencies.init` par défaut).

Aucune vue, aucun ViewModel n'a besoin d'être modifié : ils ne connaissent
que le protocole.

Les implémentations mock actuelles (`MockVisionAnalysisService`,
`MockRecipeGenerationService`) tirent des données réalistes depuis
`Resources/MockData/ingredients_catalog.json` (~70 aliments, toutes
catégories du brief : légumes, fruits, viandes, poissons, produits
laitiers, œufs, boissons, sauces, condiments, beurre, épices, conserves,
desserts, surgelés) et `recipes.json` (31 recettes couvrant petit-déjeuner,
déjeuner, dîner, goûter, snack, dessert, avec nutrition complète, étapes
détaillées et tags diététiques).

## Photos des plats

Même principe côté image : `DishImageProviding` (`Services/Images/`)
retourne un `DishImageAsset` (SF Symbol + dégradé, ou `remoteURL` optionnelle).
`DishImageView` s'adapte automatiquement : si une implémentation future
retourne une URL (Unsplash, génération IA, base de photos culinaires), la
vue passe seule en mode `AsyncImage` — aucun écran à modifier.

## Persistance & mode hors connexion

Favoris et historique sont stockés localement via **SwiftData**
(`Services/Persistence/`). Les recettes et analyses sont sérialisées en
JSON dans les enregistrements SwiftData, donc entièrement consultables
sans connexion — la caméra/l'IA sont les seules fonctions qui nécessitent
une exécution active du service (mock ou réel).

## Tests

`FrigoChefAITests/` couvre :
- la logique de correspondance ingrédients ↔ recettes et les filtres (`Recipe.matches`)
- les services mock (bornes de résultats, gestion d'erreurs, tri par ingrédients manquants)
- la persistance SwiftData (favoris, en mémoire)

## Prochaines étapes suggérées

- Fournir de vraies icônes dans `AppIcon.appiconset` (actuellement vide).
- Implémenter un vrai provider de vision/génération et l'enregistrer dans `AppDependencies`.
- Étendre `recipes.json` / `ingredients_catalog.json` ou les remplacer par un backend.
