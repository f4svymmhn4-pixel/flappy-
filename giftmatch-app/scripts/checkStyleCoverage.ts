import { GIFTS } from "../src/data/gifts";
import { styleOptions } from "../src/data/questions";

const counts: Record<string, number> = {};
for (const opt of styleOptions) counts[opt.value] = 0;
for (const g of GIFTS) {
  for (const s of g.tags.styles) {
    counts[s] = (counts[s] ?? 0) + 1;
  }
}

const zero = Object.entries(counts).filter(([, c]) => c === 0);
console.log("Total styles:", styleOptions.length);
console.log("Styles with 0 matching gifts:", zero.map(([k]) => k));
for (const [k, c] of Object.entries(counts).sort((a, b) => a[1] - b[1])) {
  console.log(c.toString().padStart(3), k);
}
