// PRNG à graine (mulberry32) — déterministe, pour rejouer une saison à
// l'identique en debug (brief §11). N'utilise jamais Math.random().

export interface Rng {
  /** Flottant dans [0, 1). */
  float(): number;
  /** Entier dans [min, max] inclus. */
  int(min: number, max: number): number;
  /** true avec probabilité p (0-1). */
  chance(p: number): boolean;
  /** Tire un élément selon des poids (poids >= 0, au moins un > 0). */
  weightedPick<T>(items: Array<{ value: T; weight: number }>): T;
  /** Bruit multiplicatif centré sur 1, ex. range=0.4 -> facteur dans [0.8, 1.2]. */
  noise(range: number): number;
}

export function createRng(seed: number): Rng {
  let state = seed >>> 0;
  if (state === 0) state = 0x9e3779b9;

  function next(): number {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  return {
    float: () => next(),
    int: (min: number, max: number) => min + Math.floor(next() * (max - min + 1)),
    chance: (p: number) => next() < p,
    weightedPick<T>(items: Array<{ value: T; weight: number }>): T {
      const total = items.reduce((sum, it) => sum + it.weight, 0);
      if (total <= 0) {
        throw new Error("weightedPick: la somme des poids doit être > 0");
      }
      let roll = next() * total;
      for (const item of items) {
        roll -= item.weight;
        if (roll <= 0) return item.value;
      }
      return items[items.length - 1]!.value;
    },
    noise: (range: number) => 1 - range / 2 + next() * range,
  };
}
