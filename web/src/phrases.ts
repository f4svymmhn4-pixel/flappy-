// Banque de phrases d'ambiance — brief §8. Écrites à la main, jamais
// générées : un déclencheur choisit une catégorie, la graine de la partie
// choisit la variante (déterministe, rejouable).

import type { Rng } from "../../src/engine/rng.js";

export type PhraseTrigger =
  | "premiere-saison"
  | "saison-blanche"
  | "blessure-severe"
  | "commotion"
  | "carton-rouge"
  | "cartons-jaunes-frequents"
  | "beaucoup-essais"
  | "solide-saison"
  | "retraite-declin"
  | "retraite-blessures"
  | "retraite-commotions"
  | "retraite-choisie"
  | "saison-neutre";

const BANK: Record<PhraseTrigger, string[]> = {
  "premiere-saison": [
    "Tu as 17 ans. Le maillot est trop grand, mais tu le portes déjà.",
    "Première saison. Personne ne connaît encore ton nom au club.",
  ],
  "saison-blanche": [
    "Zéro minute cette saison. Le banc a une bonne vue sur le terrain.",
    "Tu n'as pas joué un seul match. Le kiné te connaît mieux que l'entraîneur.",
  ],
  "blessure-severe": [
    "Ton genou a dit stop avant toi.",
    "La saison s'est arrêtée sur une civière, pas sur un résultat.",
  ],
  commotion: [
    "Le protocole commotion ne négocie pas. Toi non plus, cette fois.",
    "Deux minutes de flou sur la pelouse, plusieurs semaines de silence après.",
  ],
  "carton-rouge": [
    "Un geste, une image qui tourne, une commission qui délibère.",
    "Le rouge a suffi. La citation fera le reste.",
  ],
  "cartons-jaunes-frequents": [
    "Trois fois à dix cette saison. Le sélectionneur prend des notes.",
    "Le carnet du bord de touche commence à te connaître par cœur.",
  ],
  "beaucoup-essais": [
    "Tu as franchi la ligne à répétition cette saison. Les défenses commencent à s'en souvenir.",
    "La feuille de match retient ton nom plus souvent que les autres.",
  ],
  "solide-saison": [
    "Beaucoup de matchs, zéro alerte médicale. Ce genre de saison ne se remarque pas — c'est bon signe.",
    "Une saison sans histoire. Au rugby, c'est déjà une performance.",
  ],
  "retraite-declin": [
    "Le corps suit encore, mais un temps de retard s'est installé. Tu raccroches.",
    "Tu n'as rien perdu d'un coup. Juste, saison après saison, un peu.",
  ],
  "retraite-blessures": [
    "Le corps a tenu le compte avant toi. Tu arrêtes.",
    "Trop de saisons interrompues à la même page du carnet médical.",
  ],
  "retraite-commotions": [
    "Un nouveau protocole commotion en quelques saisons a tranché à ta place.",
    "Ce n'est pas une décision. C'est un avis médical qu'on ne discute pas.",
  ],
  "retraite-choisie": [
    "Tu poses le maillot toi-même, avant qu'on ne te le demande.",
    "Personne ne t'a poussé vers la sortie. Tu y es allé le premier.",
  ],
  "saison-neutre": [
    "Une saison ordinaire. Ni citée, ni oubliée.",
    "Rien à signaler. Le carnet reste sobre, comme d'habitude.",
  ],
};

export function pickPhrase(trigger: PhraseTrigger, rng: Rng): string {
  const options = BANK[trigger];
  return options[rng.int(0, options.length - 1)]!;
}
