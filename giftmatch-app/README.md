# GiftMatch 🎁

Assistant cadeau mobile qui joue le rôle d'un conseiller personnel : un
questionnaire moderne en 9 questions, puis un moteur de scoring qui justifie
ses 3 recommandations ("Nous avons choisi ce cadeau car...").

Stack : **Expo (React Native) + TypeScript**, React Navigation, Reanimated
pour les animations, AsyncStorage pour la persistance locale des favoris.

## Lancer le projet

```bash
cd giftmatch-app
npm install
npm run start     # puis scanner le QR code avec Expo Go (iOS/Android)
npm run web        # aperçu rapide dans le navigateur
```

Autres commandes utiles :

```bash
npm run typecheck      # tsc --noEmit sur tout le projet
npm run check:catalog  # vérifie l'unicité, le nombre et le taggage du catalogue
npm run check:scoring  # exemple de scoring sur un profil de test
```

## Parcours utilisateur

`Accueil` → `🎁 TROUVE TON CADEAU` → questionnaire (9 questions, retour
arrière possible, choix uniques et multiples, champ libre) → écran d'analyse
animé → **3 cadeaux** classés 🥇 Cadeau parfait / 🥈 Alternative originale /
🥉 Option plus économique, chacun avec un pourcentage de compatibilité et une
explication personnalisée. Les cadeaux peuvent être sauvegardés (❤️,
persistés localement, consultables depuis l'accueil), partagés, ou ouverts
vers une boutique.

## Architecture

```
src/
  types/domain.ts        Vocabulaire commun (enums, Gift, QuizAnswers, ScoredGift)
  data/
    questions.ts          Libellés + emojis des 9 questions (source unique de vérité UI)
    seedTypes.ts           Format compact d'auteur pour une idée cadeau (GiftSeed)
    expand.ts               Profils de tags par défaut par catégorie + expansion GiftSeed → Gift
    seeds/*.ts               288 idées cadeaux uniques réparties sur 16 catégories (18/catégorie)
    gifts.ts                  Catalogue final assemblé et exporté (GIFTS)
  engine/
    scoring.ts             Moteur de scoring pondéré (passion +20, style +20, budget +20,
                             réaction +15, relation +10, âge +10, type de cadeau +15, détail +10,
                             pénalité -15 si le cadeau relève d'une catégorie déjà bien fournie)
    reason.ts               Génère le paragraphe "Pourquoi il/elle va aimer"
  context/                 QuizProvider (réponses en cours) + FavoritesProvider (AsyncStorage)
  navigation/              Stack : Home → Questionnaire → Analysis → Results (+ Favorites)
  screens/                 Un fichier par écran
  components/              GradientButton, OptionCard, Chip, ProgressBar, GiftCard,
                             + components/steps/ (Single/Multi/Text question génériques)
  theme/theme.ts           Palette, dégradés, typographie, ombres partagés
scripts/
  checkCatalog.ts          Script de vérification (unicité, tags, comptage par catégorie)
  checkScoring.ts          Exemple de scoring end-to-end pour un profil donné
```

Le format `GiftSeed` permet d'écrire chaque idée cadeau en quelques lignes
(nom, description, prix, catégorie) : `expand.ts` complète automatiquement les
15+ dimensions de tags (âges, budgets, relations, passions, styles, émotions,
types de cadeaux, occasions, genre, originalité, utilité, sentimental,
premium, expérience, saisons, catégories à éviter) à partir d'un profil par
défaut par catégorie, que chaque idée peut surcharger. `npm run check:catalog`
vérifie qu'aucun nom n'est dupliqué et que chaque cadeau dépasse bien les 15
tags minimum demandés.

## Catalogue de cadeaux — portée actuelle

Le cahier des charges visait 1000 idées. Cette première version en livre
**288, toutes uniques et écrites à la main** (aucune variante du même
produit, aucun remplissage), réparties sur les 16 catégories demandées
(18 par catégorie : technologie, maison, cuisine, sport, voyage, mode,
beauté, loisirs, expériences, objets personnalisés, culture, enfants,
couples, humour, luxe, artisanat). Générer les ~700 idées restantes avec la
même exigence de qualité et de diversité (pas de doublons déguisés) est un
travail de contenu à part entière — l'architecture (`GiftSeed` → `expand.ts`)
est justement conçue pour que l'ajouter plus tard consiste seulement à
écrire de nouveaux fichiers dans `src/data/seeds/`, sans toucher au moteur de
scoring ni à l'UI.

## Moteur de recommandation

`scoreGift(gift, answers)` calcule un score dynamique : chaque dimension ne
compte dans le score maximum que si la question correspondante a été
répondue, donc le pourcentage de compatibilité reste cohérent même si
l'utilisateur saute une question. `getTopGifts` trie tout le catalogue et
renvoie les 3 meilleurs. `buildPersonalizedReason` construit une explication
en langage naturel à partir des dimensions qui ont réellement matché
(passion, style, type de cadeau recherché, réaction, détail libre) — jamais
un texte générique.

## Liens d'achat

Chaque cadeau porte un tableau `liens: { boutique, url }[]`. Les boutiques
disponibles aujourd'hui (Amazon, Fnac, Nature & Découvertes, Decathlon,
Autre) génèrent une recherche par mot-clé chez le revendeur adapté à la
catégorie. Cette structure est prête pour brancher de vrais liens produit ou
des identifiants d'affiliation plus tard : il suffira de remplacer
`searchUrl()` dans `src/data/expand.ts` par un vrai lookup produit/affilié,
sans changer le reste de l'app.

## Prochaines étapes suggérées

- Étoffer le catalogue vers 1000 idées, catégorie par catégorie.
- Remplacer les emojis/dégradés par de vraies illustrations ou photos.
- Backend (Supabase/Firebase) pour centraliser le catalogue et activer de
  vrais liens d'affiliation dynamiques.
- Écran de préférences pour re-générer une sélection sans refaire tout le
  questionnaire.
