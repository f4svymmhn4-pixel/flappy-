import { AlreadyHas, Gift, GiftCategory, Passion, QuizAnswers, Relation, Style } from "../types/domain";
import { ScoreBreakdownItem } from "./scoring";
import { alreadyHasOptions, reactionOptions, styleOptions } from "../data/questions";

const RELATION_SUBJECT: Record<Relation, string> = {
  partenaire: "ton/ta partenaire",
  papa: "ton papa",
  maman: "ta maman",
  enfant: "ton enfant",
  frere_soeur: "ton frère ou ta sœur",
  ami: "ton ami(e)",
  collegue: "ton/ta collègue",
  famille: "ce membre de ta famille",
  autre: "cette personne",
};

const GIFT_TYPE_PHRASES: Record<string, string> = {
  inattendu: "c'est un cadeau qu'il/elle n'aurait jamais pensé à s'acheter lui-même/elle-même",
  ameliore_quotidien: "c'est un objet qui va vraiment améliorer son quotidien",
  valeur_sentimentale: "il porte une vraie valeur sentimentale",
  experience_memorable: "c'est une expérience qui restera mémorable",
  original_rare: "c'est un objet original que peu de personnes possèdent",
  impressionnant: "il fera son petit effet dès l'ouverture",
  fou_rire: "il devrait provoquer un vrai fou rire",
  connaissance_profonde: "il montre à quel point tu la/le connais",
};

function lowerFirst(text: string): string {
  return text.length > 0 ? text.charAt(0).toLowerCase() + text.slice(1) : text;
}

const PASSION_LABELS: Record<Passion, string> = {
  jeux_video: "les jeux vidéo",
  sport: "le sport",
  fitness: "le fitness",
  rugby: "le rugby",
  football: "le football",
  basketball: "le basketball",
  tennis: "le tennis",
  golf: "le golf",
  natation: "la natation",
  cyclisme: "le cyclisme",
  course_a_pied: "la course à pied",
  yoga: "le yoga",
  escalade: "l'escalade",
  randonnee: "la randonnée",
  cuisine: "la cuisine",
  gastronomie: "la gastronomie",
  patisserie: "la pâtisserie",
  oenologie: "l'œnologie",
  cafe_lifestyle: "le café et le lifestyle",
  mixologie: "la mixologie",
  lecture: "la lecture",
  films_series: "les films et séries",
  musique: "la musique",
  instruments: "les instruments de musique",
  jeux_societe: "les jeux de société",
  apprentissage_culture: "l'apprentissage et la culture",
  photo_video: "la photo et la vidéo",
  decoration: "la décoration",
  creation_artistique: "la création artistique",
  artisanat: "l'artisanat",
  bricolage: "le bricolage",
  jardinage: "le jardinage",
  mode: "la mode",
  beaute: "la beauté",
  bijoux: "les bijoux",
  voyage: "le voyage",
  nature: "la nature",
  camping: "le camping",
  automobile: "l'automobile",
  moto: "la moto",
  animaux: "les animaux",
  bien_etre: "le bien-être",
  luxe: "le luxe",
  technologie: "la technologie",
};

const STYLE_LABELS: Record<Style, string> = Object.fromEntries(
  styleOptions.map((o) => [o.value, lowerFirst(o.label)])
) as Record<Style, string>;

const REACTION_LABELS: Record<string, string> = Object.fromEntries(
  reactionOptions.map((o) => [o.value, o.label])
);

const ALREADY_HAS_LABELS: Record<AlreadyHas, string> = Object.fromEntries(
  alreadyHasOptions.map((o) => [o.value, lowerFirst(o.label)])
) as Record<AlreadyHas, string>;

/** Loose category domains for each "already has" answer, used to decide when
 * a gift genuinely dodges a redundant category the person is already full of. */
const ALREADY_HAS_DOMAIN: Record<AlreadyHas, GiftCategory[]> = {
  vetements: ["mode"],
  chaussures: ["mode"],
  bijoux: ["mode", "artisanat", "luxe"],
  beaute: ["beaute"],
  livres: ["culture"],
  technologie: ["technologie"],
  decoration: ["maison", "artisanat"],
  plantes: ["maison", "cuisine", "loisirs"],
  cuisine: ["cuisine", "maison"],
  accessoires_voyage: ["voyage", "mode"],
  equipement_sport: ["sport"],
  jeux: ["loisirs", "enfants"],
  vin_spiritueux: ["cuisine", "loisirs", "luxe", "experiences", "culture", "couples", "maison"],
  materiel_creatif: ["loisirs"],
  objets_collection: ["loisirs", "artisanat", "luxe"],
  accessoires_mode: ["mode"],
  objets_connectes: ["technologie"],
  souvenirs_voyage: ["voyage"],
  sais_pas: [],
};

function joinFr(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} et ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} et ${items[items.length - 1]}`;
}

type FragmentType =
  | "passion"
  | "style"
  | "giftType"
  | "reaction"
  | "detail"
  | "alreadyHasException"
  | "budget"
  | "generic";

/**
 * Builds the "Pourquoi il/elle va aimer" paragraph shown on the results
 * screen, weaving together only the dimensions that actually matched so the
 * explanation always reflects real signal from the questionnaire.
 *
 * `rank` varies which angle leads the sentence: passions/centres d'intérêt
 * are the dominant scoring signal, so the top matches (rank 1-2) always
 * foreground them explicitly. The 3rd suggestion deliberately leads with a
 * different angle (gift type, reaction sought, budget...) so the three
 * explanations don't all read like the same template repeated three times.
 */
export function buildPersonalizedReason(
  gift: Gift,
  answers: QuizAnswers,
  breakdown: ScoreBreakdownItem[],
  rank?: 1 | 2 | 3
): string {
  const matched = new Set(breakdown.filter((b) => b.points > 0).map((b) => b.label));
  const relationSubject = answers.relation
    ? RELATION_SUBJECT[answers.relation]
    : "cette personne";
  const leadsWithPassion = rank !== 3;

  const fragments = new Map<FragmentType, string>();

  if (matched.has("passion")) {
    const matchedPassions = answers.passions.filter((p) => gift.tags.passions.includes(p));
    const labels = matchedPassions.map((p) => PASSION_LABELS[p]);
    fragments.set(
      "passion",
      leadsWithPassion
        ? `ce choix s'inspire directement de ses centres d'intérêt : ${relationSubject} aime ${joinFr(labels)}`
        : `${relationSubject} aime aussi ${joinFr(labels)}`
    );
  }

  if (matched.has("style")) {
    const matchedStyles = answers.styles.filter((s) => gift.tags.styles.includes(s));
    const labels = matchedStyles.map((s) => STYLE_LABELS[s]);
    fragments.set("style", `correspond à son style ${joinFr(labels)}`);
  }

  if (matched.has("giftType") && answers.giftType) {
    fragments.set("giftType", GIFT_TYPE_PHRASES[answers.giftType]);
  }

  if (matched.has("reaction") && answers.reaction) {
    fragments.set("reaction", `tu devrais obtenir la réaction ${REACTION_LABELS[answers.reaction]}`);
  }

  if (matched.has("detail") && answers.detail) {
    fragments.set("detail", `on a tenu compte de ce que tu nous as confié : "${answers.detail.trim()}"`);
  }

  if (
    !matched.has("deja_possede") &&
    answers.alreadyHas.length > 0 &&
    answers.alreadyHas.some((h) => ALREADY_HAS_DOMAIN[h].includes(gift.categorie))
  ) {
    const relevantHas = answers.alreadyHas.find((h) => ALREADY_HAS_DOMAIN[h].includes(gift.categorie));
    if (relevantHas) {
      fragments.set(
        "alreadyHasException",
        `même si ${relationSubject} a déjà ${ALREADY_HAS_LABELS[relevantHas]}, ce choix change vraiment de l'ordinaire`
      );
    }
  }

  if (answers.budget || answers.budgetExact !== undefined) {
    fragments.set("budget", "il reste dans le budget que tu as fixé");
  }

  if (fragments.size === 0) {
    fragments.set(
      "generic",
      `${relationSubject} devrait apprécier cette idée dans la catégorie ${gift.categorie.replace("_", " ")}`
    );
  }

  // Ranks 1-2: passions lead, kept tight and focused so the interest match
  // stays the headline. Rank 3: a different angle leads instead, with
  // passions demoted to a supporting mention if there's room.
  const order: FragmentType[] = leadsWithPassion
    ? ["passion", "alreadyHasException", "style", "detail", "giftType", "budget"]
    : ["giftType", "reaction", "alreadyHasException", "style", "detail", "passion", "budget"];

  const maxFragments = 3;
  const selected = order
    .filter((type) => fragments.has(type))
    .slice(0, maxFragments)
    .map((type) => fragments.get(type)!);

  if (selected.length === 0 && fragments.has("generic")) {
    selected.push(fragments.get("generic")!);
  }

  return `Nous avons choisi ce cadeau car ${joinFr(selected)}.`;
}
