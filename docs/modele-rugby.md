# Modèle rugbystique — jalon 1

Ce document fixe les règles chiffrées de la simulation avant tout code. Il
couvre : les attributs, les 15 postes (pondération, indicateurs, blessures,
courbe d'âge, repli), le modèle de saison, le modèle de blessures, le modèle
de discipline, les formules de progression/déclin et le modèle de sélection
nationale. Les chiffres sont des fourchettes de jeu vidéo calibrées pour être
plausibles, pas des statistiques officielles copiées d'une source — ils
seront ajustés au jalon 8 (1000 carrières simulées, distributions observées).

**Statut : à valider avant le jalon 2 (moteur de simulation).**

---

## 1. Les 8 attributs

Échelle 0–100 pour chaque attribut. Un joueur de 17 ans démarre entre 30 et
55 selon son potentiel (tiré à la création, caché au joueur).

| Attribut | Ce qu'il capture |
|---|---|
| Puissance | force en contact, capacité de percussion, résistance au recul en mêlée/maul |
| Vitesse | vitesse de pointe et accélération sur 10-30 m |
| Technique | gestuelle spécifique : passe, lancer en touche, plaquage technique, jeu au pied de base, prise de balle aérienne |
| Vision de jeu | lecture du jeu, timing des offloads, choix de passe vs percussion, anticipation défensive |
| Mental | gestion de la pression (buteur, dernières minutes), leadership, résilience après une contre-performance |
| Condition physique | endurance sur 80 minutes, capacité à répéter les efforts, résistance à la fatigue de fin de saison |
| Jeu au pied | précision et variété : pénalité, transformation, jeu au pied tactique (chandelle, coup de pied vissé, up-and-under) |
| Discipline | attribut inversé — élevé = peu de pénalités concédées, peu de cartons |

Un poste ne mobilise jamais les 8 à poids égal. Les pondérations ci-dessous
somment à 100 par poste et servent à calculer une note globale indicative
(OVR) et surtout les indicateurs de match spécifiques au poste (§3).

Formule générale :

```
OVR_poste = Σ (poids_attribut_poste × valeur_attribut) / 100
```

L'OVR n'est qu'un résumé pour le joueur (tri de hiérarchie, offres de
mercato). La simulation de match n'utilise jamais l'OVR seul : elle pioche
dans les attributs pertinents à l'action (ex. un turnover gagné dépend de
puissance + technique + vision, pas de vitesse ni jeu au pied).

---

## 2. Courbe d'âge — modèle générique

Trois phases par attribut, avec un **âge de pic** et une **pente de déclin**
propres au poste (et parfois à l'attribut : la vitesse décline toujours plus
vite que le mental ou la technique, quel que soit le poste).

```
Phase de formation   : 17 → âge_pic - 3   croissance logistique, rendements
                                            décroissants après 23 ans
Plateau               : [âge_pic - 3, âge_pic + 2]   valeur quasi stable
Déclin                : âge > âge_pic + 2
  attribut(age) = attribut(plateau) − pente_attr × (age − âge_pic − 2)^1.25
```

`pente_attr` de base (avant modificateur de poste) :

| Attribut | Pente de déclin |
|---|---|
| Vitesse | 1.00 (référence, décline le plus vite) |
| Condition physique | 0.85 |
| Puissance | 0.55 |
| Technique | 0.35 |
| Jeu au pied | 0.30 |
| Vision de jeu | 0.15 |
| Mental | 0.10 (peut encore progresser après le pic) |
| Discipline | 0.10 |

Chaque poste applique un multiplicateur global à cette pente (§4) : un pilier
a un multiplicateur < 1 (il dure), un ailier > 1 (il chute vite dès que la
vitesse part). C'est ce mécanisme, plus que l'âge de pic lui-même, qui crée
la différence de longévité entre un pilier et un ailier alors que les deux
peuvent culminer autour de 27-28 ans.

**Retraite** : déclenchée quand la note globale du joueur passe sous le seuil
minimum du dernier palier de club qui lui fait une offre, ou choisie
librement par le joueur, ou forcée par un événement (blessure de carrière,
accumulation de commotions — voir événements §9 du brief).

---

## 3. Les 15 postes

Pour chaque poste : pondération des attributs (somme 100), indicateurs de
match affichés, profil de blessures, âge de pic, multiplicateur de pente de
déclin (×), durée de carrière pro typique, postes de repli.

### 1 — Pilier gauche
- Poids : Puissance 30, Technique 25 (mêlée), Condition physique 15, Discipline 10, Mental 10, Vision 5, Vitesse 3, Jeu au pied 2
- Indicateurs : mêlées tenues / concédées, pénalités gagnées en mêlée, ballons portés, plaquages
- Blessures : épaule (fréquente, mêlée), cervicales (rares mais graves), genou, cheville. Fréquence match élevée, gravité moyenne à haute pour les cervicales
- Âge de pic : 29 · Pente déclin : ×0.55 · Carrière pro : 20-37 ans (≈15-16 saisons)
- Repli : pilier droit (rare, gestuelle de mêlée différente), deuxième ligne en dépannage

### 2 — Talonneur
- Poids : Technique 30 (lancers), Puissance 20, Condition physique 20 (volume de jeu élevé), Vision 12, Mental 10, Discipline 5, Vitesse 2, Jeu au pied 1
- Indicateurs : % de lancers trouvés en touche, plaquages, ballons portés au contact, temps de jeu (souvent remplacé à la 50e-60e)
- Blessures : épaule, genou, commotions (contact fréquent en touche et mêlée), doigts
- Âge de pic : 28 · Pente déclin : ×0.65 · Carrière pro : 20-35 ans
- Repli : pilier droit en fin de carrière (prise de poids), rarement 3e ligne

### 3 — Pilier droit
- Poids : Puissance 32, Technique 23, Condition physique 15, Discipline 10, Mental 10, Vision 5, Vitesse 3, Jeu au pied 2
- Indicateurs : mêlées tenues / concédées, pénalités gagnées, ballons portés, plaquages
- Blessures : identique au pilier gauche, légèrement plus de genou (poste souvent plus lourd)
- Âge de pic : 30 · Pente déclin : ×0.50 (le poste le plus longévif du jeu) · Carrière pro : 20-38 ans
- Repli : pilier gauche (rare), deuxième ligne en dépannage

### 4 — Deuxième ligne (touche/poussée)
- Poids : Puissance 25, Technique 22 (touche), Condition physique 18, Mental 12, Vision 10, Discipline 8, Vitesse 3, Jeu au pied 2
- Indicateurs : ballons de touche gagnés (préhension + soutien), plaquages, mêlées poussées, ballons portés
- Blessures : genou, épaule, doigts (touche), cervicales en mêlée (moindre que 1re ligne)
- Âge de pic : 28 · Pente déclin : ×0.60 · Carrière pro : 19-35 ans
- Repli : 5, 3e ligne aile en dépannage (gabarit compatible)

### 5 — Deuxième ligne (plaquages/alignement)
- Poids : Puissance 24, Condition physique 20, Technique 18, Mental 13, Vision 12, Discipline 8, Vitesse 3, Jeu au pied 2
- Indicateurs : plaquages, ballons de touche gagnés, mètres gagnés au contact, turnovers provoqués
- Blessures : identique au poste 4, un peu plus de plaquages = plus de commotions
- Âge de pic : 27 · Pente déclin : ×0.65 · Carrière pro : 19-34 ans
- Repli : 4, 6 en dépannage

### 6 — Troisième ligne aile (combat/volume)
- Poids : Puissance 22, Condition physique 22, Technique 16, Mental 14, Vision 12, Discipline 8, Vitesse 4, Jeu au pied 2
- Indicateurs : plaquages, ballons portés, turnovers, mètres avant la ligne d'avantage
- Blessures : épaule (plaquage), commotions (poste le plus exposé avec le 5), genou, côtes
- Âge de pic : 27 · Pente déclin : ×0.80 · Carrière pro : 19-33 ans
- Repli : 8, 5 en dépannage

### 7 — Troisième ligne aile (grattage/vitesse au sol)
- Poids : Technique 22 (jeu au sol), Condition physique 22, Vision 16, Puissance 16, Mental 12, Discipline 6, Vitesse 5, Jeu au pied 1
- Indicateurs : turnovers gagnés (grattages), plaquages, pénalités gagnées au sol, ballons portés
- Blessures : épaule, genou, commotions (exposition maximale au ruck), doigts
- Âge de pic : 26 · Pente déclin : ×0.85 · Carrière pro : 19-32 ans
- Repli : 6, 8 en dépannage

### 8 — Numéro 8
- Poids : Puissance 25, Condition physique 20, Vision 16 (liaison, décision base de mêlée), Technique 15, Mental 12, Discipline 6, Vitesse 5, Jeu au pied 1
- Indicateurs : ballons portés, mètres gagnés, plaquages, décisions base de mêlée réussies (sortie/percussion)
- Blessures : épaule, genou, commotions, dos
- Âge de pic : 27 · Pente déclin : ×0.75 · Carrière pro : 19-33 ans
- Repli : 6, 5 en fin de carrière

### 9 — Demi de mêlée
- Poids : Vision 26 (tempo, timing), Technique 24 (vitesse de passe), Mental 16, Condition physique 12, Vitesse 10, Jeu au pied 8, Discipline 3, Puissance 1
- Indicateurs : temps de passe moyen, passes réussies, mètres au pied (box-kick), turnovers provoqués/subis sous le pied
- Blessures : épaule (plaquages en infériorité de gabarit), cheville, genou — moins de commotions que les avants
- Âge de pic : 27 · Pente déclin : ×0.55 (le mental et la vision compensent tôt la perte physique) · Carrière pro : 20-35 ans
- Repli : aucun naturel (poste très spécialisé), parfois 10 en dépannage d'urgence

### 10 — Demi d'ouverture
- Poids : Jeu au pied 26, Vision 24, Mental 18, Technique 14, Condition physique 8, Vitesse 5, Puissance 3, Discipline 2
- Indicateurs : % de réussite au pied (pénalités/transformations), mètres gagnés au pied tactique, passes décisives, plaquages manqués
- Blessures : cheville, genou — poste le moins exposé au contact direct, plus exposé à la pression mentale (gestion des coups de pied décisifs)
- Âge de pic : 29 · Pente déclin : ×0.45 (le poste le plus longévif hors 1re ligne, la lecture prime sur le physique) · Carrière pro : 20-37 ans
- Repli : 15 en fin de carrière (relance, jeu au pied), 12 rarement

### 11 — Ailier (vitesse pure/finition)
- Poids : Vitesse 30, Technique 20 (finition, jeu aérien), Puissance 14, Vision 12, Mental 10, Condition physique 10, Discipline 3, Jeu au pied 1
- Indicateurs : essais, défenseurs battus, mètres parcourus balle en main, ballons récupérés en l'air
- Blessures : ischio-jambiers (explosivité), cheville, genou (torsion à haute vitesse) — peu de commotions
- Âge de pic : 25 · Pente déclin : ×1.15 (le plus rapide déclin du jeu avec le 14) · Carrière pro : 19-31 ans
- Repli : 15 (moins d'espace à couvrir mais plus de jeu au pied à acquérir), 13 en fin de carrière si le gabarit le permet

### 12 — Premier centre
- Poids : Puissance 26, Technique 18, Vision 16, Mental 14, Condition physique 14, Vitesse 8, Discipline 3, Jeu au pied 1
- Indicateurs : mètres gagnés au contact, plaquages, passes après contact (offloads), défenseurs battus
- Blessures : épaule, genou, commotions (collisions frontales fréquentes)
- Âge de pic : 26 · Pente déclin : ×0.90 · Carrière pro : 19-32 ans
- Repli : 13 (moins de collisions frontales), 8 en dépannage exceptionnel

### 13 — Deuxième centre
- Poids : Vitesse 20, Vision 22 (lecture de ligne), Technique 18, Mental 14, Puissance 14, Condition physique 10, Discipline 1, Jeu au pied 1
- Indicateurs : plaquages offensifs (cut), interceptions/lectures, défenseurs battus, essais
- Blessures : genou (changements d'appui), épaule, ischio-jambiers
- Âge de pic : 26 · Pente déclin : ×1.00 · Carrière pro : 19-32 ans
- Repli : 12 (avec prise de puissance), 11/14 en début de carrière

### 14 — Ailier (vitesse pure/contre-attaque)
- Poids : Vitesse 30, Technique 20, Puissance 13, Vision 13, Mental 10, Condition physique 10, Discipline 3, Jeu au pied 1
- Indicateurs : essais, mètres parcourus, contre-attaques depuis son propre camp, défenseurs battus
- Blessures : identique au 11
- Âge de pic : 25 · Pente déclin : ×1.15 · Carrière pro : 19-31 ans
- Repli : 15, 13 en fin de carrière

### 15 — Arrière
- Poids : Jeu au pied 20, Vision 20, Technique 18 (jeu aérien, relance), Mental 16, Vitesse 12, Condition physique 10, Puissance 3, Discipline 1
- Indicateurs : mètres gagnés en relance, ballons récupérés sous chandelle, % de réussite au pied (si buteur de secours), plaquages décisifs (dernier rideau)
- Blessures : genou, cheville, commotions (chandelles, contre au sol) — exposition physique plus forte qu'on ne le croit
- Âge de pic : 27 · Pente déclin : ×0.85 · Carrière pro : 19-33 ans
- Repli : 10 (jeu au pied compatible), 13/14 en début de carrière

### Synthèse longévité (du plus long au plus court)

Pilier droit (38) > Pilier gauche (37) ≈ Ouvreur (37) > Talonneur (35) ≈
Demi de mêlée (35) > Arrière (33) ≈ Numéro 8 (33) ≈ Deuxième ligne 4 (35) >
2e ligne 5 (34) > 3e ligne 6 (33) ≈ Premier centre (32) ≈ Deuxième centre (32)
> 3e ligne 7 (32) > Ailiers 11/14 (31).

C'est la hiérarchie attendue par un pratiquant : les postes de force pure et
de lecture (1, 3, 10, 9) durent, les postes de vitesse pure (11, 14) partent
tôt.

---

## 4. Modèle de saison

- **Championnat national** : 22 à 26 journées selon la ligue (poule unique
  aller-retour pour un championnat à 12-14 clubs), + phases finales (barrages,
  demi-finales, finale) pour le haut de tableau des ligues qui en ont
  (France, Afrique du Sud/URC, hémisphère Sud). Les ligues à conférences
  (Japon, USA) utilisent une saison plus courte (16-18 journées) + play-offs.
- **Coupe(s) d'Europe / équivalents** : 4 à 8 matchs de poule + phase à
  élimination directe pour les clubs qualifiés (environ la moitié du haut de
  tableau des ligues du Nord).
- **Total plausible pour un titulaire indiscutable de haut niveau** :
  26 (championnat) + 6 (coupe d'Europe) + phases finales ≈ 30-34 matchs de
  club sur la saison, auxquels s'ajoutent les fenêtres internationales
  (jusqu'à 12-14 matchs supplémentaires une année de tournée + Coupe du
  monde).
- **Temps de jeu individuel** : un titulaire dispute 60 à 100 % des matchs de
  son club selon la hiérarchie au poste, la forme et les blessures. Un
  remplaçant fixe entre à la 50e-60e minute (avants surtout, pour la fraîcheur
  en fin de match) ou en cas de blessure/carton.
- **Charge physique** : chaque match consomme de la « fraîcheur » (jauge de
  fatigue qui influence la probabilité de blessure du match suivant, remise à
  zéro partielle en intersaison, totale seulement en cas de repos prolongé).

---

## 5. Modèle de blessures

Probabilité de blessure par match :

```
P(blessure) = base_poste × mod_âge × mod_fatigue × mod_condition_physique × mod_discipline_adverse
```

- `base_poste` : fréquence de référence par match, indexée sur l'exposition
  au contact du poste. Ordre décroissant : 2e ligne (5, puis 4) et 3e ligne
  aile (6, 7) et centres (12) en tête (contact frontal maximal), puis 1re
  ligne et 8, puis 9/13/15, puis 10, puis 11/14 en dernier (le moins de
  collisions directes, mais gravité plus haute quand la blessure survient à
  vitesse maximale — ischio-jambiers, genou).
- `mod_âge` : croît après l'âge de pic + 3 ans (récupération plus lente).
- `mod_fatigue` : croît avec la jauge de fatigue (§4) et avec le nombre de
  matchs consécutifs sans coupure.
- `mod_condition_physique` : l'attribut condition physique réduit le risque
  (joueur mieux préparé).
- Gravité tirée séparément (bénigne : 1-2 semaines / moyenne : 3-6 semaines /
  sévère : 8-16 semaines / longue indisponibilité : plus de 6 mois, type
  ligament croisé) selon une distribution propre au **profil de blessure du
  poste** (§3), pas uniforme.

**Commotions** : gérées à part, avec un protocole obligatoire (retrait
immédiat, période de repos minimale non compressible dans le jeu — aucun
bouton « forcer le retour » qui ne coûte rien). Un historique de commotions
répétées augmente durablement `mod_âge` effectif et peut déclencher un
événement de retraite anticipée forcée.

---

## 6. Modèle de discipline

- Chaque match tire des pénalités concédées selon `discipline` (bas =
  davantage de pénalités) et le style de jeu de l'adversaire.
- Carton jaune : probabilité faible par match, plus élevée pour les postes de
  contact (1re ligne, 2e ligne, 3e ligne, centres) et pour les joueurs à
  faible discipline. Conséquence immédiate : 10 minutes à 14, risque
  d'infériorité qui pèse sur le résultat simulé.
- Carton rouge : rare, déclenche un **événement de citation** (bunker /
  commission de discipline) résolu quelques jours plus tard avec un barème :
  - Faute involontaire, bas degré de danger : 2 à 3 semaines
  - Faute avec degré de danger moyen : 4 à 6 semaines
  - Récidive ou danger élevé : 6 à 10 semaines, voire plus
- Accumulation de cartons sur une saison fait évoluer la **réputation** du
  joueur (variable cachée : de « joueur propre » à « joueur limite/sale »),
  qui influence à son tour la sévérité des futures commissions (barème plus
  dur en cas de récidive) et le regard des sélectionneurs.

---

## 7. Progression et déclin — application en jeu

- Chaque intersaison, le joueur choisit **un axe de travail** (un attribut ou
  un couple d'attributs). Le gain effectif dépend de l'âge (rendements
  décroissants après 23 ans, quasi nuls après l'âge de pic + 2), du temps de
  jeu de la saison écoulée (un joueur qui ne joue pas progresse à peine), et
  du **style de jeu du club** (§4 du brief : un club de jeu d'avants
  bonifie les gains de puissance/technique de mêlée/touche, pénalise ou
  laisse stagner vitesse/vision de jeu de mouvement, et inversement pour un
  club de jeu de mouvement).
- Le déclin (§2) s'applique automatiquement chaque saison après l'âge de pic
  + 2, indépendamment du choix du joueur — c'est irréversible, seul le rythme
  peut être ralenti par une bonne condition physique.
- Le **repositionnement** (§3 du brief) applique un malus temporaire (2-3
  saisons) sur les indicateurs du nouveau poste tant que le joueur n'a pas
  suffisamment progressé dans les attributs pertinents à ce poste — jamais un
  changement instantané et gratuit.

---

## 8. Sélection nationale — modèle de profondeur par nation

Chaque nation a un **niveau d'exigence** au poste = nombre de concurrents
sérieux + niveau moyen de ces concurrents. Deux paramètres par nation :

- `profondeur` (1 à 5) : nombre de joueurs de niveau international au poste
  actuellement disponibles dans le vivier de la nation.
- `niveau_moyen` (1 à 5) : niveau moyen du championnat/de la filière qui
  alimente cette nation.

Exemples de calibrage (illustratif, affiné au jalon 8) :

| Nation | Profondeur | Niveau moyen | Lecture |
|---|---|---|---|
| Afrique du Sud, Nouvelle-Zélande | 5 | 5 | quasi impossible de percer sans être exceptionnel |
| France, Irlande, Angleterre | 4-5 | 5 | très difficile, concurrence dense à tous les postes |
| Australie, Argentine, Écosse, Pays de Galles, Italie, Fidji | 3 | 4 | difficile mais des trous existent selon les postes |
| Géorgie, Samoa, Tonga, Japon | 2 | 3 | sélection atteignable plus tôt, mais peu de titres à la clé |
| Portugal, Roumanie, USA, Espagne, Uruguay, Namibie, Canada, Chili, Hong Kong | 1-2 | 2 | sélection facile, compétitions majeures rares (une Coupe du monde tous les 4 ans si qualification) |

Probabilité de convocation = f(OVR du joueur relatif au meilleur concurrent
du vivier national à ce poste, profondeur, niveau_moyen, forme récente,
réputation). C'est ce ratio « joueur vs vivier », pas l'OVR brut, qui crée le
vrai arbitrage de carrière décrit dans le brief (§5) : un joueur moyen perce
facilement dans un vivier faible, un excellent joueur reste sur le bord chez
les Springboks.

**Éligibilité** : gérée comme un événement narratif à seuil (résidence ≥ 5
saisons dans le pays, ou ascendance parentale déclarée à la création du
personnage) qui débloque un choix de sélection alternative — jamais
automatique, toujours un choix du joueur avec conséquences (perte définitive
d'éligibilité pour la nation d'origine dans la plupart des cas réels du
rugby, à répliquer en règle de jeu).

---

## 9. Points laissés ouverts (à trancher avant le jalon 2)

1. Valeurs exactes de `base_poste` (blessures) et de `profondeur`/`niveau_moyen`
   (sélection) : posées ici comme ordres de grandeur, seront calibrées
   numériquement au jalon 8 par simulation de masse.
2. Nombre exact de paliers de club (1 à 5 dans le brief) et seuil d'OVR par
   palier : à définir au jalon 5 (clubs et compétitions).
3. Formule précise de la note de match individuelle (0-10 façon feuille de
   match) : proposée au jalon 2 avec le moteur de simulation, pas figée ici.

---

**Prochaine étape proposée** : jalon 2 (squelette technique + moteur de
simulation d'une saison en ligne de commande, sans UI), une fois ce document
validé.
