import { GIFTS } from "../src/data/gifts";
import { getTopGifts, scoreGift } from "../src/engine/scoring";
import { buildPersonalizedReason } from "../src/engine/reason";
import { QuizAnswers } from "../src/types/domain";

const answers: QuizAnswers = {
  relation: "partenaire",
  ageGroup: "21-30",
  budget: "50-100",
  passions: ["cuisine", "gastronomie", "voyage"],
  style: "bobo_parisien",
  giftType: "connaissance_profonde",
  reaction: "ca_me_touche",
  alreadyHas: ["technologie"],
  detail: "Elle adore le Japon et rêve d'y voyager",
};

const top = getTopGifts(GIFTS, answers, 3);
for (const t of top) {
  const { breakdown } = scoreGift(t.gift, answers);
  console.log("---");
  console.log(t.gift.nom, `(${t.gift.categorie})`, `${t.compatibility}%`, t.score, "/", t.maxScore);
  console.log(buildPersonalizedReason(t.gift, answers, breakdown));
}
