import { AgeGroup, BudgetRange, Gift, QuizAnswers, ScoredGift } from "../types/domain";

/**
 * Weights reflect a strict priority order requested for the recommendation
 * logic: passions/hobbies dominate the score, then age, then relation, then
 * budget, then style (a refinement signal only), then the remaining
 * complementary answers. "Already has" is handled as a separate malus (see
 * ALREADY_HAS_PENALTY) ranked between relation and budget in impact.
 */
const WEIGHTS = {
  passion: 45,
  age: 14,
  relation: 12,
  budget: 10,
  style: 8,
  reaction: 5,
  giftType: 5,
  detail: 5,
} as const;

const ALREADY_HAS_PENALTY = 25;

/** Extra credit when a gift matches more than one stated interest, rewarding
 * gifts that sit at the intersection of several passions. Capped so a very
 * long passion list can't dwarf the other dimensions. */
const PASSION_MULTI_MATCH_BONUS = 6;
const PASSION_MULTI_MATCH_MAX_BONUS = 18;

/** Applied when the gift is explicitly tagged to hobby domains that share
 * nothing with the stated interests (e.g. a decoration item for someone who
 * only picked "sport, musculation"). Gifts with no passion tags at all are
 * left neutral here since they aren't tied to a conflicting hobby. */
const PASSION_MISMATCH_PENALTY = 18;

const KID_AGES: AgeGroup[] = ["0-3", "4-6", "7-10", "11-15"];

export interface ScoreBreakdownItem {
  label: string;
  points: number;
}

export interface ScoreResult {
  score: number;
  maxScore: number;
  breakdown: ScoreBreakdownItem[];
}

export function ageGroupFromExact(age: number): AgeGroup {
  if (age <= 3) return "0-3";
  if (age <= 6) return "4-6";
  if (age <= 10) return "7-10";
  if (age <= 15) return "11-15";
  if (age <= 20) return "16-20";
  if (age <= 30) return "21-30";
  if (age <= 45) return "31-45";
  if (age <= 60) return "46-60";
  return "60+";
}

function budgetBucketFromExact(amount: number): BudgetRange {
  if (amount < 10) return "moins10";
  if (amount < 30) return "10-30";
  if (amount < 50) return "30-50";
  if (amount < 100) return "50-100";
  if (amount < 200) return "100-200";
  return "plus200";
}

const STOPWORDS = new Set([
  "le", "la", "les", "un", "une", "des", "de", "du", "et", "à", "au", "aux",
  "il", "elle", "je", "tu", "on", "nous", "vous", "ils", "elles", "est",
  "vient", "aime", "adore", "que", "qui", "pour", "avec", "dans", "sur",
  "ce", "cette", "ses", "son", "sa", "d'", "l'", "en", "plus", "très",
]);

function keywordsFromDetail(detail: string): string[] {
  return detail
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w));
}

function giftSearchableText(gift: Gift): string {
  return [
    gift.nom,
    gift.description,
    ...gift.tags.passions,
    ...gift.tags.styles,
    gift.categorie,
  ]
    .join(" ")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/**
 * Scores a single gift against the questionnaire answers. Each dimension only
 * contributes to `maxScore` when the user actually answered that question, so
 * the resulting percentage stays fair regardless of how many questions were
 * skipped.
 */
export function scoreGift(gift: Gift, answers: QuizAnswers): ScoreResult {
  const breakdown: ScoreBreakdownItem[] = [];
  let score = 0;
  let maxScore = 0;

  // 1. Passions / hobbies — the dominant signal. A gift earns its place
  // primarily because it relates to what the person actually loves doing;
  // matching several stated interests at once is rewarded further, and a
  // gift explicitly tied to conflicting hobby domains is pushed down hard.
  const matchedPassions = answers.passions.filter((p) => gift.tags.passions.includes(p));
  const passionConflict =
    answers.passions.length > 0 &&
    gift.tags.passions.length > 0 &&
    matchedPassions.length === 0;

  if (answers.passions.length > 0) {
    maxScore += WEIGHTS.passion;
    if (matchedPassions.length > 0) {
      const multiMatchBonus = Math.min(
        (matchedPassions.length - 1) * PASSION_MULTI_MATCH_BONUS,
        PASSION_MULTI_MATCH_MAX_BONUS
      );
      score += WEIGHTS.passion + multiMatchBonus;
      breakdown.push({ label: "passion", points: WEIGHTS.passion + multiMatchBonus });
    } else if (passionConflict) {
      score -= PASSION_MISMATCH_PENALTY;
      breakdown.push({ label: "passion_mismatch", points: -PASSION_MISMATCH_PENALTY });
    }
  }

  // 2. Age
  if (answers.ageGroup || answers.ageExact !== undefined) {
    maxScore += WEIGHTS.age;
    const group = answers.ageExact !== undefined
      ? ageGroupFromExact(answers.ageExact)
      : answers.ageGroup!;
    if (gift.tags.ages.includes(group)) {
      score += WEIGHTS.age;
      breakdown.push({ label: "age", points: WEIGHTS.age });
    }
  }

  // 3. Relation to the recipient
  if (answers.relation) {
    maxScore += WEIGHTS.relation;
    if (gift.tags.relations.includes(answers.relation)) {
      score += WEIGHTS.relation;
      breakdown.push({ label: "relation", points: WEIGHTS.relation });
    }
  }

  // 4. Already owns a lot of this kind of thing -> malus
  if (answers.alreadyHas.length > 0) {
    const overlap = answers.alreadyHas.some((h) => gift.tags.evitePour.includes(h));
    if (overlap) {
      score -= ALREADY_HAS_PENALTY;
      breakdown.push({ label: "deja_possede", points: -ALREADY_HAS_PENALTY });
    }
  }

  // 5. Budget
  if (answers.budget || answers.budgetExact !== undefined) {
    maxScore += WEIGHTS.budget;
    const bucket = answers.budgetExact !== undefined
      ? budgetBucketFromExact(answers.budgetExact)
      : answers.budget!;
    if (gift.tags.budgets.includes(bucket)) {
      score += WEIGHTS.budget;
      breakdown.push({ label: "budget", points: WEIGHTS.budget });
    }
  }

  // 6. Personality style — refines HOW the category chosen by the hobbies
  // shows up (design, tone, vibe), but never a path to the top on its own.
  // A gift already flagged as conflicting with the stated hobbies doesn't
  // get to make up for it through a style match.
  if (answers.styles.length > 0) {
    maxScore += WEIGHTS.style;
    if (!passionConflict) {
      const matches = answers.styles.filter((s) => gift.tags.styles.includes(s));
      if (matches.length > 0) {
        score += WEIGHTS.style;
        breakdown.push({ label: "style", points: WEIGHTS.style });
      }
    }
  }

  // 7. Remaining complementary signals
  if (answers.reaction) {
    maxScore += WEIGHTS.reaction;
    if (gift.tags.emotions.includes(answers.reaction)) {
      score += WEIGHTS.reaction;
      breakdown.push({ label: "reaction", points: WEIGHTS.reaction });
    }
  }

  if (answers.giftType) {
    maxScore += WEIGHTS.giftType;
    if (gift.tags.giftTypes.includes(answers.giftType)) {
      score += WEIGHTS.giftType;
      breakdown.push({ label: "giftType", points: WEIGHTS.giftType });
    }
  }

  if (answers.detail && answers.detail.trim().length > 0) {
    maxScore += WEIGHTS.detail;
    const keywords = keywordsFromDetail(answers.detail);
    const text = giftSearchableText(gift);
    if (keywords.some((k) => text.includes(k))) {
      score += WEIGHTS.detail;
      breakdown.push({ label: "detail", points: WEIGHTS.detail });
    }
  }

  return { score, maxScore: Math.max(maxScore, 1), breakdown };
}

function compatibilityPercent(score: number, maxScore: number): number {
  const raw = Math.round((score / maxScore) * 100);
  return Math.min(99, Math.max(55, raw));
}

function resolvedAgeGroup(answers: QuizAnswers): AgeGroup | undefined {
  if (answers.ageExact !== undefined) return ageGroupFromExact(answers.ageExact);
  return answers.ageGroup;
}

/**
 * Safety gate applied before any scoring. A child profile (kid age group, or
 * "mon enfant" as the relation) is restricted to gifts explicitly tagged for
 * that age — never anything reserved for adults (sharp tools, alcohol,
 * tobacco) even if it would otherwise score well. Teens/young adults in the
 * 16-20 bucket still see the full catalog except reserveAdulte items, since
 * that bucket spans below and above the legal drinking age.
 */
export function filterSafeCatalog(gifts: Gift[], answers: QuizAnswers): Gift[] {
  const ageGroup = resolvedAgeGroup(answers);
  const isChild = (ageGroup !== undefined && KID_AGES.includes(ageGroup)) || answers.relation === "enfant";

  if (isChild) {
    const targetAges = ageGroup ? [ageGroup] : KID_AGES;
    const safeForChild = gifts.filter(
      (g) => !g.tags.reserveAdulte && g.tags.ages.some((a) => targetAges.includes(a))
    );
    // Guaranteed non-empty fallback: the dedicated kids category is always safe.
    return safeForChild.length > 0 ? safeForChild : gifts.filter((g) => g.categorie === "enfants");
  }

  if (ageGroup === "16-20") {
    return gifts.filter((g) => !g.tags.reserveAdulte);
  }

  return gifts;
}

/**
 * Scores the whole catalog and returns the top N gifts, sorted from the best
 * match to the weakest of the selection.
 */
export function getTopGifts(
  gifts: Gift[],
  answers: QuizAnswers,
  count = 3
): ScoredGift[] {
  const safeGifts = filterSafeCatalog(gifts, answers);
  const scored = safeGifts.map((gift) => {
    const { score, maxScore } = scoreGift(gift, answers);
    return { gift, score, maxScore };
  });

  scored.sort((a, b) => b.score / b.maxScore - a.score / a.maxScore || b.score - a.score);

  return scored.slice(0, count).map(({ gift, score, maxScore }) => ({
    gift,
    score,
    maxScore,
    compatibility: compatibilityPercent(score, maxScore),
    raison: "",
  }));
}
