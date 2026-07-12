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
