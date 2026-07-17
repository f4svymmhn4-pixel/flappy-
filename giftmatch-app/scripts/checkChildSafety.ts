import { GIFTS } from "../src/data/gifts";
import { getTopGifts } from "../src/engine/scoring";
import { QuizAnswers } from "../src/types/domain";

function run(label: string, answers: QuizAnswers, expectNoReserveAdulte: boolean) {
  const top = getTopGifts(GIFTS, answers, 5);
  console.log(`\n=== ${label} ===`);
  for (const t of top) {
    console.log(
      `${t.compatibility}%`,
      t.gift.nom,
      `(${t.gift.categorie})`,
      t.gift.tags.reserveAdulte ? "⚠️ RESERVE_ADULTE" : ""
    );
  }
  const unsafe = top.filter((t) => t.gift.tags.reserveAdulte);
  console.log("Unsafe items surfaced:", unsafe.length, expectNoReserveAdulte ? "(expected 0)" : "(adult, some expected)");
  return expectNoReserveAdulte ? unsafe.length === 0 : true;
}

let allSafe = true;

allSafe = run("Enfant 7 ans (relation=enfant, ageExact=7)", {
  relation: "enfant",
  ageExact: 7,
  passions: ["jeux_video", "creation_artistique"],
  styles: [],
  alreadyHas: [],
}, true) && allSafe;

allSafe = run("Enfant 4-6 ans, budget luxe (tente de piéger le filtre)", {
  relation: "enfant",
  ageGroup: "4-6",
  budget: "plus200",
  passions: ["cuisine", "gastronomie"],
  styles: ["epicurien"],
  giftType: "impressionnant",
  alreadyHas: [],
}, true) && allSafe;

allSafe = run("Ado 11-15 ans, frère/soeur", {
  relation: "frere_soeur",
  ageGroup: "11-15",
  passions: ["cuisine", "gastronomie", "technologie"],
  styles: ["gamer"],
  alreadyHas: [],
}, true) && allSafe;

allSafe = run("Jeune 16-20 ans (ne doit pas voir d'alcool)", {
  relation: "ami",
  ageGroup: "16-20",
  passions: ["gastronomie", "oenologie"],
  styles: ["epicurien"],
  alreadyHas: [],
}, true) && allSafe;

allSafe = run("Adulte 31-45 ans (référence, alcool/couteaux OK)", {
  relation: "partenaire",
  ageGroup: "31-45",
  passions: ["gastronomie", "oenologie"],
  styles: ["epicurien"],
  alreadyHas: [],
}, false) && allSafe;

console.log("\n\nALL SAFE:", allSafe);
if (!allSafe) process.exit(1);
