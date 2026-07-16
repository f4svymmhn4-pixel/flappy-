/**
 * Core domain vocabulary shared by the questionnaire, the gift catalog and
 * the recommendation engine. Every enum below is a closed set of slugs used
 * both as UI option keys (Q1-Q9) and as tag values on gifts, so a user
 * answer can be matched against a gift's tags with simple set intersection.
 */

export type Relation =
  | "partenaire"
  | "papa"
  | "maman"
  | "enfant"
  | "frere_soeur"
  | "ami"
  | "collegue"
  | "famille"
  | "autre";

export type AgeGroup =
  | "0-3"
  | "4-6"
  | "7-10"
  | "11-15"
  | "16-20"
  | "21-30"
  | "31-45"
  | "46-60"
  | "60+";

export type BudgetRange =
  | "moins10"
  | "10-30"
  | "30-50"
  | "50-100"
  | "100-200"
  | "plus200";

export type Passion =
  | "jeux_video"
  | "sport"
  | "fitness"
  | "rugby"
  | "cuisine"
  | "gastronomie"
  | "lecture"
  | "films_series"
  | "musique"
  | "instruments"
  | "photo_video"
  | "voyage"
  | "nature"
  | "decoration"
  | "creation_artistique"
  | "apprentissage_culture"
  | "automobile"
  | "moto"
  | "animaux"
  | "mode_beaute"
  | "jeux_societe"
  | "jardinage"
  | "cafe_lifestyle";

export type Style =
  | "bobo_parisien"
  | "rugbyman"
  | "elegant_classique"
  | "geek_passionne"
  | "aventurier"
  | "zen_bienetre"
  | "creatif"
  | "passionne_hobby"
  | "drole_bande"
  | "cocooning_maison";

export type GiftType =
  | "inattendu"
  | "ameliore_quotidien"
  | "valeur_sentimentale"
  | "experience_memorable"
  | "original_rare"
  | "impressionnant"
  | "fou_rire"
  | "connaissance_profonde";

export type Reaction =
  | "comment_trouve"
  | "trop_drole"
  | "ca_me_touche"
  | "pas_attendu"
  | "exactement_fallait"
  | "personne_offert";

export type AlreadyHas =
  | "vetements"
  | "livres"
  | "jeux"
  | "decoration"
  | "technologie"
  | "beaute"
  | "cuisine"
  | "sais_pas";

export type GiftCategory =
  | "technologie"
  | "maison"
  | "cuisine"
  | "sport"
  | "voyage"
  | "mode"
  | "beaute"
  | "loisirs"
  | "experiences"
  | "objets_personnalises"
  | "culture"
  | "enfants"
  | "couples"
  | "humour"
  | "luxe"
  | "artisanat";

export type Genre = "homme" | "femme" | "mixte";

export type StoreName =
  | "Amazon"
  | "Fnac"
  | "Nature & Découvertes"
  | "Decathlon"
  | "Autre";

export interface GiftLink {
  boutique: StoreName;
  url: string;
}

/** Full, expanded tag set carried by every gift in the catalog (15+ dimensions). */
export interface GiftTags {
  ages: AgeGroup[];
  budgets: BudgetRange[];
  relations: Relation[];
  passions: Passion[];
  styles: Style[];
  emotions: Reaction[];
  giftTypes: GiftType[];
  occasions: string[];
  genre: Genre;
  originalite: 1 | 2 | 3 | 4 | 5;
  utilite: 1 | 2 | 3 | 4 | 5;
  sentimental: boolean;
  premium: boolean;
  experience: boolean;
  saisons: string[];
  evitePour: AlreadyHas[];
}

export interface Gift {
  id: string;
  nom: string;
  description: string;
  raison: string;
  prixMin: number;
  prixMax: number;
  categorie: GiftCategory;
  emoji: string;
  couleurs: [string, string];
  tags: GiftTags;
  liens: GiftLink[];
}

/** Answers collected across the 9-question flow. */
export interface QuizAnswers {
  relation?: Relation;
  ageGroup?: AgeGroup;
  ageExact?: number;
  budget?: BudgetRange;
  budgetExact?: number;
  passions: Passion[];
  style?: Style;
  giftType?: GiftType;
  reaction?: Reaction;
  alreadyHas: AlreadyHas[];
  detail?: string;
}

export const emptyAnswers: QuizAnswers = {
  passions: [],
  alreadyHas: [],
};

export interface ScoredGift {
  gift: Gift;
  score: number;
  maxScore: number;
  compatibility: number;
  raison: string;
}
