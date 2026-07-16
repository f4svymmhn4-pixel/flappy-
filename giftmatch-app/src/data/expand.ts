import {
  AgeGroup,
  AlreadyHas,
  BudgetRange,
  Genre,
  Gift,
  GiftCategory,
  GiftLink,
  GiftType,
  Passion,
  Reaction,
  Relation,
  Style,
  StoreName,
} from "../types/domain";
import { GiftSeed } from "./seedTypes";

const ADULT_AGES: AgeGroup[] = ["16-20", "21-30", "31-45", "46-60", "60+"];
const KID_AGES: AgeGroup[] = ["0-3", "4-6", "7-10", "11-15"];
const ADULT_RELATIONS: Relation[] = [
  "partenaire",
  "papa",
  "maman",
  "frere_soeur",
  "ami",
  "collegue",
  "famille",
  "autre",
];

interface CategoryProfile {
  passions: Passion[];
  styles: Style[];
  relations: Relation[];
  ages: AgeGroup[];
  reactions: Reaction[];
  giftTypes: GiftType[];
  genre: Genre;
  originalite: 1 | 2 | 3 | 4 | 5;
  utilite: 1 | 2 | 3 | 4 | 5;
  sentimental: boolean;
  premium: boolean;
  experience: boolean;
  saisons: string[];
  occasions: string[];
  evitePour: AlreadyHas[];
  boutiques: StoreName[];
}

const CATEGORY_PROFILES: Record<GiftCategory, CategoryProfile> = {
  technologie: {
    passions: ["technologie"],
    styles: ["geek_passionne"],
    relations: ADULT_RELATIONS,
    ages: ADULT_AGES,
    reactions: ["pas_attendu", "exactement_fallait"],
    giftTypes: ["ameliore_quotidien", "original_rare"],
    genre: "mixte",
    originalite: 3,
    utilite: 4,
    sentimental: false,
    premium: false,
    experience: false,
    saisons: ["toute_annee"],
    occasions: ["anniversaire", "noel"],
    evitePour: ["technologie"],
    boutiques: ["Amazon", "Fnac"],
  },
  maison: {
    passions: ["decoration"],
    styles: ["cocooning_maison", "bobo_parisien"],
    relations: ADULT_RELATIONS,
    ages: ADULT_AGES,
    reactions: ["exactement_fallait", "ca_me_touche"],
    giftTypes: ["ameliore_quotidien"],
    genre: "mixte",
    originalite: 3,
    utilite: 4,
    sentimental: false,
    premium: false,
    experience: false,
    saisons: ["toute_annee"],
    occasions: ["anniversaire", "noel", "cremaillere"],
    evitePour: ["decoration"],
    boutiques: ["Amazon", "Nature & Découvertes"],
  },
  cuisine: {
    passions: ["cuisine", "gastronomie"],
    styles: ["bobo_parisien", "cocooning_maison"],
    relations: ADULT_RELATIONS,
    ages: ADULT_AGES,
    reactions: ["exactement_fallait", "comment_trouve"],
    giftTypes: ["ameliore_quotidien", "inattendu"],
    genre: "mixte",
    originalite: 3,
    utilite: 4,
    sentimental: false,
    premium: false,
    experience: false,
    saisons: ["toute_annee"],
    occasions: ["anniversaire", "noel", "cremaillere"],
    evitePour: ["cuisine"],
    boutiques: ["Amazon", "Fnac"],
  },
  sport: {
    passions: ["sport", "fitness"],
    styles: ["passionne_hobby", "rugbyman"],
    relations: ADULT_RELATIONS,
    ages: ADULT_AGES,
    reactions: ["exactement_fallait", "pas_attendu"],
    giftTypes: ["ameliore_quotidien"],
    genre: "mixte",
    originalite: 2,
    utilite: 5,
    sentimental: false,
    premium: false,
    experience: false,
    saisons: ["toute_annee"],
    occasions: ["anniversaire", "noel"],
    evitePour: [],
    boutiques: ["Decathlon", "Amazon"],
  },
  voyage: {
    passions: ["voyage"],
    styles: ["aventurier"],
    relations: ADULT_RELATIONS,
    ages: ADULT_AGES,
    reactions: ["pas_attendu", "exactement_fallait"],
    giftTypes: ["ameliore_quotidien", "inattendu"],
    genre: "mixte",
    originalite: 3,
    utilite: 4,
    sentimental: false,
    premium: false,
    experience: false,
    saisons: ["toute_annee"],
    occasions: ["anniversaire", "depart_vacances"],
    evitePour: [],
    boutiques: ["Amazon", "Fnac"],
  },
  mode: {
    passions: ["mode"],
    styles: ["elegant_classique"],
    relations: ADULT_RELATIONS,
    ages: ADULT_AGES,
    reactions: ["comment_trouve", "exactement_fallait"],
    giftTypes: ["impressionnant"],
    genre: "mixte",
    originalite: 2,
    utilite: 3,
    sentimental: false,
    premium: false,
    experience: false,
    saisons: ["toute_annee"],
    occasions: ["anniversaire", "noel"],
    evitePour: ["vetements"],
    boutiques: ["Amazon", "Autre"],
  },
  beaute: {
    passions: ["beaute"],
    styles: ["zen_bienetre", "elegant_classique"],
    relations: ADULT_RELATIONS,
    ages: ADULT_AGES,
    reactions: ["ca_me_touche", "exactement_fallait"],
    giftTypes: ["ameliore_quotidien"],
    genre: "mixte",
    originalite: 2,
    utilite: 3,
    sentimental: false,
    premium: false,
    experience: false,
    saisons: ["toute_annee"],
    occasions: ["anniversaire", "noel"],
    evitePour: ["beaute"],
    boutiques: ["Amazon", "Nature & Découvertes"],
  },
  loisirs: {
    passions: [],
    styles: ["creatif"],
    relations: ADULT_RELATIONS,
    ages: ADULT_AGES,
    reactions: ["exactement_fallait", "pas_attendu"],
    giftTypes: ["inattendu"],
    genre: "mixte",
    originalite: 4,
    utilite: 3,
    sentimental: false,
    premium: false,
    experience: false,
    saisons: ["toute_annee"],
    occasions: ["anniversaire", "noel"],
    evitePour: ["jeux"],
    boutiques: ["Amazon", "Fnac"],
  },
  experiences: {
    passions: [],
    styles: ["aventurier", "bobo_parisien"],
    relations: ADULT_RELATIONS,
    ages: ADULT_AGES,
    reactions: ["pas_attendu", "personne_offert"],
    giftTypes: ["experience_memorable"],
    genre: "mixte",
    originalite: 5,
    utilite: 2,
    sentimental: false,
    premium: false,
    experience: true,
    saisons: ["toute_annee"],
    occasions: ["anniversaire", "saint_valentin", "depart_retraite"],
    evitePour: [],
    boutiques: ["Autre", "Amazon"],
  },
  objets_personnalises: {
    passions: [],
    styles: ["creatif", "bobo_parisien"],
    relations: ADULT_RELATIONS,
    ages: ADULT_AGES,
    reactions: ["ca_me_touche", "comment_trouve"],
    giftTypes: ["valeur_sentimentale", "connaissance_profonde"],
    genre: "mixte",
    originalite: 5,
    utilite: 2,
    sentimental: true,
    premium: false,
    experience: false,
    saisons: ["toute_annee"],
    occasions: ["anniversaire", "naissance", "anniversaire_couple"],
    evitePour: [],
    boutiques: ["Autre", "Amazon"],
  },
  culture: {
    passions: ["lecture", "apprentissage_culture"],
    styles: ["bobo_parisien", "zen_bienetre"],
    relations: ADULT_RELATIONS,
    ages: ADULT_AGES,
    reactions: ["exactement_fallait", "ca_me_touche"],
    giftTypes: ["connaissance_profonde"],
    genre: "mixte",
    originalite: 3,
    utilite: 3,
    sentimental: false,
    premium: false,
    experience: false,
    saisons: ["toute_annee"],
    occasions: ["anniversaire", "noel"],
    evitePour: ["livres"],
    boutiques: ["Fnac", "Amazon"],
  },
  enfants: {
    passions: [],
    styles: ["creatif"],
    relations: ["enfant", "frere_soeur", "famille", "autre"],
    ages: KID_AGES,
    reactions: ["pas_attendu", "exactement_fallait"],
    giftTypes: ["inattendu"],
    genre: "mixte",
    originalite: 3,
    utilite: 4,
    sentimental: false,
    premium: false,
    experience: false,
    saisons: ["toute_annee"],
    occasions: ["anniversaire", "noel"],
    evitePour: ["jeux"],
    boutiques: ["Amazon", "Fnac"],
  },
  couples: {
    passions: [],
    styles: ["bobo_parisien", "zen_bienetre"],
    relations: ["partenaire"],
    ages: ADULT_AGES,
    reactions: ["ca_me_touche", "exactement_fallait"],
    giftTypes: ["valeur_sentimentale", "connaissance_profonde"],
    genre: "mixte",
    originalite: 4,
    utilite: 2,
    sentimental: true,
    premium: false,
    experience: false,
    saisons: ["toute_annee"],
    occasions: ["saint_valentin", "anniversaire_couple", "anniversaire"],
    evitePour: [],
    boutiques: ["Amazon", "Autre"],
  },
  humour: {
    passions: [],
    styles: ["drole_bande", "rugbyman"],
    relations: ADULT_RELATIONS,
    ages: ["11-15", ...ADULT_AGES],
    reactions: ["trop_drole"],
    giftTypes: ["fou_rire"],
    genre: "mixte",
    originalite: 5,
    utilite: 1,
    sentimental: false,
    premium: false,
    experience: false,
    saisons: ["toute_annee"],
    occasions: ["anniversaire", "pot_depart"],
    evitePour: [],
    boutiques: ["Amazon", "Fnac"],
  },
  luxe: {
    passions: ["luxe"],
    styles: ["elegant_classique"],
    relations: ADULT_RELATIONS,
    ages: ["21-30", "31-45", "46-60", "60+"],
    reactions: ["personne_offert", "comment_trouve"],
    giftTypes: ["impressionnant"],
    genre: "mixte",
    originalite: 3,
    utilite: 3,
    sentimental: false,
    premium: true,
    experience: false,
    saisons: ["toute_annee"],
    occasions: ["anniversaire", "noel", "anniversaire_couple"],
    evitePour: [],
    boutiques: ["Autre", "Amazon"],
  },
  artisanat: {
    passions: ["decoration", "creation_artistique", "artisanat"],
    styles: ["bobo_parisien", "creatif"],
    relations: ADULT_RELATIONS,
    ages: ADULT_AGES,
    reactions: ["comment_trouve", "ca_me_touche"],
    giftTypes: ["original_rare"],
    genre: "mixte",
    originalite: 4,
    utilite: 3,
    sentimental: false,
    premium: false,
    experience: false,
    saisons: ["toute_annee"],
    occasions: ["anniversaire", "cremaillere"],
    evitePour: [],
    boutiques: ["Autre", "Nature & Découvertes"],
  },
};

const BUDGET_BUCKETS: { key: BudgetRange; min: number; max: number }[] = [
  { key: "moins10", min: 0, max: 10 },
  { key: "10-30", min: 10, max: 30 },
  { key: "30-50", min: 30, max: 50 },
  { key: "50-100", min: 50, max: 100 },
  { key: "100-200", min: 100, max: 200 },
  { key: "plus200", min: 200, max: Infinity },
];

function budgetsForRange(min: number, max: number): BudgetRange[] {
  return BUDGET_BUCKETS.filter((b) => min <= b.max && max >= b.min).map(
    (b) => b.key
  );
}

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function searchUrl(boutique: StoreName, nom: string): string {
  const q = encodeURIComponent(nom);
  switch (boutique) {
    case "Amazon":
      return `https://www.amazon.fr/s?k=${q}`;
    case "Fnac":
      return `https://www.fnac.com/SearchResult/ResultList.aspx?Search=${q}`;
    case "Nature & Découvertes":
      return `https://www.natureetdecouvertes.com/search?text=${q}`;
    case "Decathlon":
      return `https://www.decathlon.fr/search?Ntt=${q}`;
    case "Autre":
    default:
      return `https://www.google.com/search?tbm=shop&q=${q}`;
  }
}

function buildLinks(boutiques: StoreName[], nom: string): GiftLink[] {
  return boutiques.map((boutique) => ({
    boutique,
    url: searchUrl(boutique, nom),
  }));
}

let counters: Partial<Record<GiftCategory, number>> = {};

export function expandSeed(seed: GiftSeed): Gift {
  const profile = CATEGORY_PROFILES[seed.categorie];
  const index = (counters[seed.categorie] = (counters[seed.categorie] ?? 0) + 1);
  const id = `${seed.categorie}-${String(index).padStart(3, "0")}-${slugify(
    seed.nom
  ).slice(0, 40)}`;

  const tags = {
    ages: unique(seed.ages ?? profile.ages),
    budgets: budgetsForRange(seed.prixMin, seed.prixMax),
    relations: unique(seed.relations ?? profile.relations),
    passions: unique([...(seed.passions ?? []), ...profile.passions]),
    styles: unique([...(seed.stylesExtra ?? []), ...profile.styles]),
    emotions: unique(seed.reactions ?? profile.reactions),
    giftTypes: unique(seed.giftTypes ?? profile.giftTypes),
    occasions: unique([...(seed.occasions ?? []), ...profile.occasions]),
    genre: seed.genre ?? profile.genre,
    originalite: seed.originalite ?? profile.originalite,
    utilite: seed.utilite ?? profile.utilite,
    sentimental: seed.sentimental ?? profile.sentimental,
    premium: seed.premium ?? (profile.premium || seed.prixMin >= 150),
    experience: seed.experience ?? profile.experience,
    saisons: unique(seed.saisons ?? profile.saisons),
    evitePour: unique([...(seed.evitePour ?? []), ...profile.evitePour]),
  };

  return {
    id,
    nom: seed.nom,
    description: seed.description,
    raison: "",
    prixMin: seed.prixMin,
    prixMax: seed.prixMax,
    categorie: seed.categorie,
    emoji: seed.emoji,
    couleurs: CATEGORY_GRADIENTS[seed.categorie],
    tags,
    liens: buildLinks(profile.boutiques, seed.nom),
  };
}

export const CATEGORY_GRADIENTS: Record<GiftCategory, [string, string]> = {
  technologie: ["#4F46E5", "#7C3AED"],
  maison: ["#F59E0B", "#F97316"],
  cuisine: ["#EF4444", "#F59E0B"],
  sport: ["#10B981", "#059669"],
  voyage: ["#0EA5E9", "#2563EB"],
  mode: ["#EC4899", "#DB2777"],
  beaute: ["#F472B6", "#EC4899"],
  loisirs: ["#8B5CF6", "#6D28D9"],
  experiences: ["#F97316", "#EA580C"],
  objets_personnalises: ["#E11D48", "#BE123C"],
  culture: ["#6366F1", "#4338CA"],
  enfants: ["#22D3EE", "#0891B2"],
  couples: ["#FB7185", "#E11D48"],
  humour: ["#FACC15", "#EAB308"],
  luxe: ["#111827", "#374151"],
  artisanat: ["#92400E", "#B45309"],
};

/** Human-readable French labels for each category, used across the UI. */
export const CATEGORY_LABELS: Record<GiftCategory, string> = {
  technologie: "Technologie",
  maison: "Maison",
  cuisine: "Cuisine",
  sport: "Sport",
  voyage: "Voyage",
  mode: "Mode",
  beaute: "Beauté",
  loisirs: "Loisirs",
  experiences: "Expériences",
  objets_personnalises: "Objets personnalisés",
  culture: "Culture",
  enfants: "Enfants",
  couples: "Couples",
  humour: "Humour",
  luxe: "Luxe",
  artisanat: "Artisanat",
};

export function resetExpandCounters() {
  counters = {};
}
