import { GIFTS } from "../src/data/gifts";
import { getTopGifts, scoreGift } from "../src/engine/scoring";
import { buildPersonalizedReason } from "../src/engine/reason";
import { QuizAnswers } from "../src/types/domain";

function run(label: string, answers: QuizAnswers) {
  const top = getTopGifts(GIFTS, answers, 3);
  console.log(`\n=== ${label} ===`);
  for (const t of top) {
    const { breakdown } = scoreGift(t.gift, answers);
    console.log(`${t.compatibility}%`, t.gift.nom, `(${t.gift.categorie})`);
    console.log(" ->", buildPersonalizedReason(t.gift, answers, breakdown));
  }
}

// "beaucoup de livres" -> should NOT surface classic books, SHOULD still allow
// audiobook/liseuse-style alternatives if otherwise relevant.
run("Passion lecture + déjà beaucoup de livres", {
  relation: "ami",
  ageGroup: "21-30",
  passions: ["lecture", "apprentissage_culture"],
  styles: ["intellectuel"],
  alreadyHas: ["livres"],
});

// "beaucoup de vêtements/accessoires de mode" -> generic accessories penalized,
// distinctive/personalized pieces (portefeuille gravé, sac artisanal, sneakers
// édition limitée) should NOT be penalized.
run("Passion mode + déjà beaucoup d'accessoires de mode", {
  relation: "partenaire",
  ageGroup: "31-45",
  passions: ["mode"],
  styles: ["fashion_addict"],
  alreadyHas: ["accessoires_mode"],
});

// "beaucoup d'ustensiles de cuisine" -> classic utensils penalized, premium/
// experiential cuisine items untouched.
run("Passion cuisine + déjà beaucoup d'ustensiles de cuisine", {
  relation: "maman",
  ageGroup: "46-60",
  passions: ["cuisine", "gastronomie"],
  styles: ["gourmet"],
  alreadyHas: ["cuisine"],
});
