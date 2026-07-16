import { Gift } from "../types/domain";
import { expandSeed, resetExpandCounters } from "./expand";
import { GiftSeed } from "./seedTypes";
import { technologieSeeds } from "./seeds/technologie";
import { maisonSeeds } from "./seeds/maison";
import { cuisineSeeds } from "./seeds/cuisine";
import { sportSeeds } from "./seeds/sport";
import { voyageSeeds } from "./seeds/voyage";
import { modeSeeds } from "./seeds/mode";
import { beauteSeeds } from "./seeds/beaute";
import { loisirsSeeds } from "./seeds/loisirs";
import { experiencesSeeds } from "./seeds/experiences";
import { objetsPersonnalisesSeeds } from "./seeds/objetsPersonnalises";
import { cultureSeeds } from "./seeds/culture";
import { enfantsSeeds } from "./seeds/enfants";
import { couplesSeeds } from "./seeds/couples";
import { humourSeeds } from "./seeds/humour";
import { luxeSeeds } from "./seeds/luxe";
import { artisanatSeeds } from "./seeds/artisanat";

const ALL_SEEDS: GiftSeed[] = [
  ...technologieSeeds,
  ...maisonSeeds,
  ...cuisineSeeds,
  ...sportSeeds,
  ...voyageSeeds,
  ...modeSeeds,
  ...beauteSeeds,
  ...loisirsSeeds,
  ...experiencesSeeds,
  ...objetsPersonnalisesSeeds,
  ...cultureSeeds,
  ...enfantsSeeds,
  ...couplesSeeds,
  ...humourSeeds,
  ...luxeSeeds,
  ...artisanatSeeds,
];

resetExpandCounters();

/** Full catalog: every hand-authored seed expanded into a fully tagged Gift. */
export const GIFTS: Gift[] = ALL_SEEDS.map(expandSeed);
