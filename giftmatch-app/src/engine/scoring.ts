import { AgeGroup, BudgetRange, Gift, QuizAnswers, ScoredGift } from "../types/domain";

const WEIGHTS = {
  passion: 20,
  style: 20,
  budget: 20,
  reaction: 15,
  relation: 10,
  age: 10,
  giftType: 15,
  detail: 10,
} as const;

const ALREADY_HAS_PENALTY = 15;

export interface ScoreBreakdownItem {
  label: string;
  points: number;
}

export interface ScoreResult {
  score: number;
  maxScore: number;
  breakdown: ScoreBreakdownItem[];
}

function ageGroupFromExact(age: number): AgeGroup {
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

  if (answers.passions.length > 0) {
    maxScore += WEIGHTS.passion;
    const matches = answers.passions.filter((p) => gift.tags.passions.includes(p));
    if (matches.length > 0) {
      score += WEIGHTS.passion;
      breakdown.push({ label: "passion", points: WEIGHTS.passion });
    }
  }

  if (answers.style) {
    maxScore += WEIGHTS.style;
    if (gift.tags.styles.includes(answers.style)) {
      score += WEIGHTS.style;
      breakdown.push({ label: "style", points: WEIGHTS.style });
    }
  }

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

  if (answers.reaction) {
    maxScore += WEIGHTS.reaction;
    if (gift.tags.emotions.includes(answers.reaction)) {
      score += WEIGHTS.reaction;
      breakdown.push({ label: "reaction", points: WEIGHTS.reaction });
    }
  }

  if (answers.relation) {
    maxScore += WEIGHTS.relation;
    if (gift.tags.relations.includes(answers.relation)) {
      score += WEIGHTS.relation;
      breakdown.push({ label: "relation", points: WEIGHTS.relation });
    }
  }

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

  if (answers.alreadyHas.length > 0) {
    const overlap = answers.alreadyHas.some((h) => gift.tags.evitePour.includes(h));
    if (overlap) {
      score -= ALREADY_HAS_PENALTY;
      breakdown.push({ label: "deja_possede", points: -ALREADY_HAS_PENALTY });
    }
  }

  return { score, maxScore: Math.max(maxScore, 1), breakdown };
}

function compatibilityPercent(score: number, maxScore: number): number {
  const raw = Math.round((score / maxScore) * 100);
  return Math.min(99, Math.max(55, raw));
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
  const scored = gifts.map((gift) => {
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
