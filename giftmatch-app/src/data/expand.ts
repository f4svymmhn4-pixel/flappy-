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
}

const CATEGORY_PROFILES: Record<GiftCategory, CategoryProfile> = {
  technologie: {
    passions: ["technologie"],
    styles: ["geek_passionne", "gamer", "entrepreneur", "minimaliste", "fan_cinema_series"],
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
    evitePour: ["technologie", "objets_connectes"],
  },
  maison: {
    passions: ["decoration"],
    styles: ["cocooning_maison", "bobo_parisien", "minimaliste", "ecolo", "manuel_bricoleur", "boheme"],
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
  },
  cuisine: {
    passions: ["cuisine", "gastronomie"],
    styles: ["bobo_parisien", "cocooning_maison", "epicurien", "gourmet"],
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
  },
  sport: {
    passions: ["sport", "fitness"],
    styles: ["passionne_hobby", "rugbyman", "sportif", "nature_randonnee"],
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
    evitePour: ["equipement_sport"],
  },
  voyage: {
    passions: ["voyage"],
    styles: ["aventurier", "ecolo", "nature_randonnee"],
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
    evitePour: ["accessoires_voyage", "souvenirs_voyage"],
  },
  mode: {
    passions: ["mode"],
    styles: ["elegant_classique", "fashion_addict", "minimaliste", "boheme", "traditionnel"],
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
    evitePour: [],
  },
  beaute: {
    passions: ["beaute"],
    styles: ["zen_bienetre", "elegant_classique", "fashion_addict"],
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
  },
  loisirs: {
    passions: [],
    styles: ["creatif", "vintage_nostalgique", "passionne_musique", "collectionneur", "original_insolite"],
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
    evitePour: [],
  },
  experiences: {
    passions: [],
    styles: ["aventurier", "bobo_parisien", "epicurien", "romantique"],
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
  },
  objets_personnalises: {
    passions: [],
    styles: ["creatif", "bobo_parisien", "romantique"],
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
  },
  culture: {
    passions: ["lecture", "apprentissage_culture"],
    styles: ["bobo_parisien", "zen_bienetre", "intellectuel", "vintage_nostalgique"],
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
    evitePour: [],
  },
  enfants: {
    passions: [],
    styles: ["creatif", "gamer"],
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
  },
  couples: {
    passions: [],
    styles: ["bobo_parisien", "zen_bienetre", "romantique"],
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
  },
  humour: {
    passions: [],
    styles: ["drole_bande", "rugbyman", "original_insolite"],
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
  },
  luxe: {
    passions: ["luxe"],
    styles: ["elegant_classique", "amateur_luxe", "traditionnel", "entrepreneur", "collectionneur"],
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
    evitePour: ["vin_spiritueux"],
  },
  artisanat: {
    passions: ["decoration", "creation_artistique", "artisanat"],
    styles: ["bobo_parisien", "creatif", "manuel_bricoleur", "vintage_nostalgique", "boheme"],
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
    evitePour: ["objets_collection"],
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

const AMAZON_ASSOCIATE_TAG = "perlerare06-21";

function amazonSearchUrl(nom: string): string {
  const q = encodeURIComponent(nom);
  return `https://www.amazon.fr/s?k=${q}&tag=${AMAZON_ASSOCIATE_TAG}`;
}

/** Every gift links exclusively to Amazon, tagged with our Associates ID. */
function buildLinks(nom: string): GiftLink[] {
  return [{ boutique: "Amazon", url: amazonSearchUrl(nom) }];
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
    evitePour: unique(seed.evitePour ?? profile.evitePour),
    reserveAdulte: seed.reserveAdulte ?? false,
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
    liens: buildLinks(seed.nom),
  };
}

/** Category accent gradients, all drawn from the same deep-emerald /
 * bronze / champagne-gold family as the rest of the app so no screen ever
 * reverts to the old purple/pink palette. */
export const CATEGORY_GRADIENTS: Record<GiftCategory, [string, string]> = {
  technologie: ["#0F3D3A", "#1B5E52"],
  maison: ["#7A5A2E", "#A67C3D"],
  cuisine: ["#8A4B23", "#B56A2E"],
  sport: ["#0E5C3F", "#137A52"],
  voyage: ["#0B4A54", "#116B78"],
  mode: ["#8C5A4A", "#B57C5C"],
  beaute: ["#9C6B52", "#C08A5E"],
  loisirs: ["#1E4A2E", "#2E6B44"],
  experiences: ["#A87C33", "#D9A857"],
  objets_personnalises: ["#6B3A2E", "#8F5039"],
  culture: ["#123049", "#1B4A66"],
  enfants: ["#0E6B6B", "#159090"],
  couples: ["#7A3B3B", "#A65252"],
  humour: ["#B8901E", "#E0B23C"],
  luxe: ["#1A1A16", "#3A331F"],
  artisanat: ["#6E4522", "#9C6530"],
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
