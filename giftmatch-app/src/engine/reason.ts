import { Gift, Passion, QuizAnswers, Relation, Style } from "../types/domain";
import { ScoreBreakdownItem } from "./scoring";
import { reactionOptions, styleOptions } from "../data/questions";

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

function joinFr(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} et ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} et ${items[items.length - 1]}`;
}

/**
 * Builds the "Pourquoi il/elle va aimer" paragraph shown on the results
 * screen, weaving together only the dimensions that actually matched so the
 * explanation always reflects real signal from the questionnaire.
 */
export function buildPersonalizedReason(
  gift: Gift,
  answers: QuizAnswers,
  breakdown: ScoreBreakdownItem[]
): string {
  const matched = new Set(breakdown.filter((b) => b.points > 0).map((b) => b.label));
  const relationSubject = answers.relation
    ? RELATION_SUBJECT[answers.relation]
    : "cette personne";

  const fragments: string[] = [];

  if (matched.has("passion")) {
    const matchedPassions = answers.passions.filter((p) => gift.tags.passions.includes(p));
    const labels = matchedPassions.map((p) => PASSION_LABELS[p]);
    fragments.push(`${relationSubject} aime ${joinFr(labels)}`);
  }

  if (matched.has("style")) {
    const matchedStyles = answers.styles.filter((s) => gift.tags.styles.includes(s));
    const labels = matchedStyles.map((s) => STYLE_LABELS[s]);
    fragments.push(`correspond à son style ${joinFr(labels)}`);
  }

  if (matched.has("giftType") && answers.giftType) {
    fragments.push(GIFT_TYPE_PHRASES[answers.giftType]);
  }

  if (matched.has("reaction") && answers.reaction) {
    fragments.push(`tu devrais obtenir la réaction ${REACTION_LABELS[answers.reaction]}`);
  }

  if (matched.has("detail") && answers.detail) {
    fragments.push(`on a tenu compte de ce que tu nous as confié : "${answers.detail.trim()}"`);
  }

  if (fragments.length === 0) {
    fragments.push(`${relationSubject} devrait apprécier cette idée dans la catégorie ${gift.categorie.replace("_", " ")}`);
  }

  const top = fragments.slice(0, 3);
  return `Nous avons choisi ce cadeau car ${joinFr(top)}.`;
}
