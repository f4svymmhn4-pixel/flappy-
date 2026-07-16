import { GIFTS } from "../src/data/gifts";

console.log("total:", GIFTS.length);

const names = GIFTS.map((g) => g.nom);
const dupes = names.filter((n, i) => names.indexOf(n) !== i);
console.log("duplicate names:", dupes);

const byCategory: Record<string, number> = {};
for (const g of GIFTS) byCategory[g.categorie] = (byCategory[g.categorie] ?? 0) + 1;
console.log("per category:", byCategory);

const lowTagCount = GIFTS.filter((g) => {
  const t = g.tags;
  const count =
    t.ages.length +
    t.budgets.length +
    t.relations.length +
    t.passions.length +
    t.styles.length +
    t.emotions.length +
    t.giftTypes.length +
    t.occasions.length +
    1 +
    1 +
    1 +
    1 +
    1 +
    t.saisons.length +
    t.evitePour.length;
  return count < 15;
});
console.log("gifts with <15 flattened tags:", lowTagCount.map((g) => g.nom));

const missingIds = GIFTS.filter((g) => !g.id).length;
console.log("missing ids:", missingIds);
const dupIds = GIFTS.map((g) => g.id).filter((id, i, arr) => arr.indexOf(id) !== i);
console.log("duplicate ids:", dupIds);
