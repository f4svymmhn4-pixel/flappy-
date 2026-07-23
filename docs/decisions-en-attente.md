# Décisions en attente avant la suite

Trois points que le brief demande explicitement de trancher avant de coder
ou de remplir des données. Ce document pose les options et l'analyse ; les
décisions elles-mêmes sont demandées séparément.

---

## 1. Clubs et compétitions — risque juridique des noms réels

Les noms de clubs, logos et noms de compétitions (Top 14, Champions Cup,
United Rugby Championship, Super Rugby...) sont des marques déposées et/ou
des dénominations protégées par leurs organisateurs (LNR, EPCR, World Rugby,
fédérations nationales).

### Option 1 — Noms réels, sans logos ni couleurs officielles
- **Ce que ça veut dire** : "Stade Toulousain", "Racing 92", "Top 14" écrits
  en texte, sans reproduction visuelle des identités officielles (blason,
  charte graphique, sponsors).
- **Risque** : usage répandu dans les jeux amateurs et communautaires
  (souvent toléré de fait), mais **juridiquement non couvert** — un nom de
  club ou de compétition peut être protégé en tant que marque même utilisé
  en texte seul, notamment s'il y a un usage commercial (même publicité,
  même dons/pourboires) ou une confusion possible avec un produit officiel.
  Le risque augmente avec l'audience du jeu. Une mise en demeure est
  possible sans qu'il y ait de mauvaise foi de notre part.
- **Niveau de risque estimé** : moyen à élevé si le jeu prend de l'audience
  ou génère le moindre revenu ; faible tant que le projet reste confidentiel
  et non monétisé — mais le brief vise un jeu public et gratuit, donc exposé.

### Option 2 — Noms légèrement altérés, villes réelles
- **Ce que ça veut dire** : "Stade Toulousain" devient par exemple "Stade
  Toulousant" ou "US Toulouse Rugby" (nom inventé mais transparent), la ville
  reste réelle (Toulouse). Les noms de compétitions sont aussi remplacés
  (ex. "Ligue Élite" au lieu de "Top 14").
- **Risque** : très faible. Un nom suffisamment différent d'une marque
  déposée, même évocateur, n'est en général pas une contrefaçon — la
  jurisprudence protège une marque contre la confusion, pas contre
  l'évocation d'un lieu réel ou d'un univers. Les villes elles-mêmes ne sont
  pas protégeables.
- **Contrainte** : demande un travail éditorial pour inventer ~150-200 noms
  de clubs crédibles et cohérents avec leur pays/région, sans tomber dans le
  ridicule ni la quasi-copie qui annulerait le bénéfice juridique.

### Option 3 — Clubs entièrement fictifs, villes réelles, fichier de correspondance moddable
- **Ce que ça veut dire** : identique à l'option 2 dans l'esprit, mais on
  formalise en plus un fichier `src/data/clubs/correspondance.json` (nom
  fictif → nom réel, non inclus dans le jeu, fourni en documentation externe
  ou laissé à la communauté) pour que les joueurs qui le souhaitent puissent
  personnaliser localement le nommage sans que nous distribuions les noms
  réels.
- **Risque** : nul de notre côté (nous ne publions que des noms fictifs) ;
  le "modding" éventuel de noms réels par un tiers est alors sous sa propre
  responsabilité, pas la nôtre.
- **Contrainte** : la plus lourde à produire (même travail éditorial que
  l'option 2, plus la maintenance d'un mécanisme de correspondance/mod).

### Recommandation
Option 2 (noms altérés, villes réelles), sans le fichier de correspondance
de l'option 3 dans un premier temps : le risque juridique tombe à un niveau
négligeable, le travail éditorial reste raisonnable, et rien n'empêche
d'ajouter un mécanisme de mod plus tard si la communauté le demande. Le
fichier de correspondance de l'option 3 nous rapprocherait délibérément des
vraies marques dans nos propres données internes — pas nécessaire pour
atteindre l'objectif du brief.

**Sur les joueurs réels : aucune ambiguïté, aucun jamais nommé, quelle que
soit l'option retenue pour les clubs — déjà acté dans le brief.**

---

## 2. Direction artistique — 3 variantes autour du "carnet de match"

Aucune n'est codée à ce stade ; il s'agit de trois partis pris à choisir ou à
faire évoluer avant le jalon 7 (DA finale), mais utiles dès le jalon 3 (UI
minimale) pour ne pas repartir de zéro.

### Variante A — "Feuille de match officielle"
Fond blanc cassé/papier, grille fine façon formulaire fédéral, cases
numérotées comme une composition d'équipe. Titrage en typographie condensée
type flocage de maillot, texte en typographie de labeur (serif discret type
machine à écrire ou sans-serif administratif), chiffres en monospace tabulé
façon tableau de scores. Un seul accent colore : un vert bouteille ou un
bordeaux profond (couleur de maillot vintage, pas un vert gazon saturé).
Très peu de texture, presque austère — l'idée d'un document officiel qu'on
consulte au bord du terrain.

### Variante B — "Carnet du sélectionneur"
Fond crème/kraft, effet papier légèrement grainé (texture statique, pas
animée), annotations à la manière de notes manuscrites en marge (mais dans
une police, pas une vraie écriture manuscrite qui nuirait à la lisibilité).
Titrage condensé identique à la variante A, mais accent colore plus sobre
encore : un seul ton d'encre (bleu-noir ou noir sépia). Plus "carnet de
terrain" que "document officiel" — convient bien au ton "sobre, un peu sec"
demandé au §8 du brief.

### Variante C — "Tableau d'affichage à l'ancienne"
Fond sombre (ardoise/anthracite), chiffres en gros monospace clair façon
tableau lumineux de stade des années 80-90, lignes de craie blanches fines
pour structurer les écrans (terrain vu de dessus en fond très discret sur
l'écran d'accueil seulement). Accent unique : un jaune craie ou un blanc
cassé. Plus contrasté, meilleure lisibilité en plein soleil (contrainte du
brief) grâce au fort contraste, mais s'éloigne un peu plus du "papier".

### Recommandation
Variante A pour le contraste en extérieur (fond clair + texte sombre lit
mieux au soleil qu'un fond sombre) et parce qu'elle est la plus direement
identifiable comme "rugby, pas foot" dès la première seconde (feuille de
match, pas écran de jeu vidéo). B en secours si on veut un ton plus intime.
C écartée en priorité pour la contrainte de lisibilité en extérieur.

---

## 3. Nom du jeu — 5 pistes

Toutes vérifiées à l'oreille pour ne rappeler aucun jeu existant, courtes,
prononçables en français.

1. **Feuille de Match** — nom générique, transparent sur le concept, aucun
   risque de marque, mais un peu descriptif/froid.
2. **Talonnage** — terme de mêlée (le talonneur "talonne" le ballon),
   évoque le combat et la technique, sonne comme un nom de jeu, inconnu par
   ailleurs.
3. **Ligne d'Avantage** — expression rugbystique connue de tout pratiquant
   (franchir la ligne d'avantage = prendre le dessus), a un double sens
   naturel pour une carrière ("prendre l'avantage sur sa carrière").
4. **Carnet de Terrain** — cohérent avec la DA "carnet de match" (§2
   ci-dessus), évoque le carnet du joueur/entraîneur, sobre.
5. **Vingt-Deux Mètres** — la ligne des 22 m, zone décisive du jeu (défense,
   sortie de camp), image forte et typée rugby, facilement mémorisable.

### Recommandation
"Ligne d'Avantage" — expression connue des pratiquants (test de crédibilité
immédiat, §13 du brief), pas neutre comme "Feuille de Match", pas jargon
opaque pour un non-initié, et le double sens carrière/rugby fonctionne bien
en accroche marketing.

---

**Ces trois points sont posés en recommandation, pas en décision finale —
réponse attendue avant de lancer le jalon 2 (clubs/DA n'entrent en jeu que
plus tard, mais le nom et la DA conditionnent des choix de structure de
fichiers qu'il vaut mieux fixer tôt).**
