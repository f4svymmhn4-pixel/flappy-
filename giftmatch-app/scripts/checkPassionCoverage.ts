import { GIFTS } from "../src/data/gifts";
import { passionOptions } from "../src/data/questions";

const counts: Record<string, number> = {};
for (const opt of passionOptions) counts[opt.value] = 0;
for (const g of GIFTS) {
  for (const p of g.tags.passions) {
    counts[p] = (counts[p] ?? 0) + 1;
  }
}

const zero = Object.entries(counts).filter(([, c]) => c === 0);
console.log("Total passions:", passionOptions.length);
console.log("Passions with 0 matching gifts:", zero.map(([k]) => k));
console.log("\nFull coverage:");
for (const [k, c] of Object.entries(counts).sort((a, b) => a[1] - b[1])) {
  console.log(c.toString().padStart(3), k);
}
