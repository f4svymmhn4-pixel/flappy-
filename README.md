# Flappy Bird Original

Un clone complet et 100 % original du jeu Flappy Bird, en HTML5 Canvas pur
(sans framework, sans étape de build). Tous les graphismes sont dessinés au
Canvas 2D et tous les sons sont synthétisés avec l'API Web Audio : aucun
fichier image ou audio n'est utilisé, et rien n'est copié du jeu original.

## Lancer le jeu

**Option A — le plus simple :** ouvrir `index.html` directement dans un
navigateur récent (Chrome, Firefox, Safari, Edge).

**Option B — recommandée** (évite certaines restrictions des navigateurs sur
le protocole `file://`, notamment pour le son) : servir le dossier via un
petit serveur statique local, puis ouvrir l'URL affichée.

```bash
# Avec Python 3 (déjà installé sur la plupart des systèmes)
python3 -m http.server 8000
# puis ouvrir http://localhost:8000

# Ou avec Node.js
npx serve .
```

Aucune installation de dépendances, aucune étape de build : le jeu est prêt à
l'emploi.

## Contrôles

- **Ordinateur** : clic gauche, ou touche `Espace` / `Flèche haut`, pour faire
  battre des ailes.
- **Mobile / tablette** : toucher l'écran pour faire battre des ailes.
- **Son** : le bouton haut-parleur en haut à droite active/coupe le son (état
  mémorisé d'une partie à l'autre).

## Structure du projet

| Fichier | Rôle |
|---|---|
| `index.html` | Structure de la page, canvas et bouton son |
| `styles.css` | Mise en page responsive et style du bouton son |
| `js/config.js` | Toutes les constantes réglables (physique, couleurs, textes) |
| `js/storage.js` | Lecture/écriture du meilleur score et de la préférence son |
| `js/audio.js` | Synthèse des effets sonores (Web Audio API) |
| `js/input.js` | Gestion unifiée souris / tactile / clavier |
| `js/bird.js` | Physique, animation et rendu de l'oiseau |
| `js/pipes.js` | Génération, défilement et rendu des tuyaux |
| `js/background.js` | Ciel, nuages en parallaxe et sol défilant |
| `js/difficulty.js` | Formules de progression de la difficulté selon le score |
| `js/collision.js` | Détection des collisions (AABB) |
| `js/ui.js` | Écrans d'accueil, de fin de partie et affichage du score |
| `js/state.js` | États du jeu (accueil / en jeu / fin de partie) |
| `js/game.js` | Orchestrateur central : relie tous les modules |
| `js/main.js` | Point d'entrée : canvas, boucle de jeu, redimensionnement |

## Réglages

Tous les paramètres de gameplay (gravité, force du saut, vitesse et écart des
tuyaux, courbe de difficulté) vivent dans `js/config.js` et `js/difficulty.js`.
Aucun autre fichier n'a besoin d'être modifié pour ajuster la sensation de jeu.

## Compatibilité

Tout navigateur moderne supportant Canvas 2D et Web Audio API (Chrome,
Firefox, Safari, Edge — version desktop ou mobile). Interface responsive,
support tactile complet.

## Note sur l'originalité des ressources

Tous les graphismes (oiseau, tuyaux, décor) sont dessinés procéduralement au
Canvas 2D au moment de l'exécution — il n'y a aucune image importée. Tous les
sons (saut, score, collision, fin de partie) sont générés au moment de
l'exécution avec l'API Web Audio — il n'y a aucun fichier audio importé. Rien
n'est copié ni dérivé des ressources du jeu Flappy Bird original.

---

## Carnet de Terrain — jeu de carrière de rugby (en cours de construction)

Un second projet, sans rapport avec Flappy Bird, est en cours de
développement dans ce même dépôt : **Carnet de Terrain**, un jeu de carrière
de rugby à XV. Voir `docs/modele-rugby.md` (modèle rugbystique chiffré) et
`docs/decisions-en-attente.md` (décisions de direction artistique, de nom et
de risque juridique sur les noms de clubs).

Le moteur de simulation (jalon 2 du plan de développement) vit dans
`src/engine/` — logique pure, testée, sans dépendance UI — et se vérifie en
ligne de commande :

```bash
npm install
npm test                 # suite de tests (vitest)
npm run typecheck        # vérification TypeScript stricte

# Simuler une carrière complète, avec une graine pour la rejouer à l'identique
npm run simulate -- --position 11 --seed 42 --name "Léo Faivre" --nationality France
```

| Fichier | Rôle |
|---|---|
| `src/engine/types.ts` | Types partagés (attributs, poste, joueur, saison, carrière) |
| `src/engine/rng.ts` | Générateur pseudo-aléatoire à graine (déterministe) |
| `src/engine/ageCurve.ts` | Courbe d'âge générique (croissance / plateau / déclin) |
| `src/engine/attributes.ts` | Calcul de l'OVR et génération des attributs à la création |
| `src/engine/positions.ts` | Données des 15 postes (pondération, blessures, courbe d'âge) |
| `src/engine/player.ts` | Création d'un joueur de 17 ans |
| `src/engine/injury.ts` | Modèle de blessures et protocole commotion |
| `src/engine/discipline.ts` | Cartons, commissions, barème de suspension |
| `src/engine/season.ts` | Simulation d'une saison (matchs, stats, blessures, discipline) |
| `src/engine/progression.ts` | Entraînement d'intersaison, vieillissement, déclin |
| `src/engine/career.ts` | Orchestration d'une carrière complète jusqu'à la retraite |
| `src/cli/simulate.ts` | CLI de vérification (aucune UI à ce stade) |

Aucune interface utilisateur n'existe encore : c'est l'objet du jalon 3.
