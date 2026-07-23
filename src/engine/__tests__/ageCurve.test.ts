import { describe, expect, it } from "vitest";
import { attributeValueAtAge, growthProgress } from "../ageCurve.js";

describe("growthProgress", () => {
  it("vaut 0 en t=0 et 1 en t=1", () => {
    expect(growthProgress(0)).toBe(0);
    expect(growthProgress(1)).toBeCloseTo(1, 5);
  });

  it("est croissante et à rendements décroissants", () => {
    const p1 = growthProgress(0.25);
    const p2 = growthProgress(0.5);
    const p3 = growthProgress(0.75);
    expect(p2).toBeGreaterThan(p1);
    expect(p3).toBeGreaterThan(p2);
    // Rendements décroissants : le gain de la 2e moitié est plus petit que celui de la 1re.
    expect(p2 - 0).toBeGreaterThan(p1 - 0);
  });
});

describe("attributeValueAtAge", () => {
  const base = {
    startValue: 40,
    peakValue: 80,
    peakAge: 28,
    attribute: "puissance" as const,
    declineMultiplier: 1,
  };

  it("part de startValue à 17 ans", () => {
    expect(attributeValueAtAge({ ...base, age: 17 })).toBeCloseTo(40, 0);
  });

  it("atteint peakValue sur le plateau (pic-3 à pic+2)", () => {
    expect(attributeValueAtAge({ ...base, age: base.peakAge })).toBe(80);
    expect(attributeValueAtAge({ ...base, age: base.peakAge - 3 })).toBe(80);
    expect(attributeValueAtAge({ ...base, age: base.peakAge + 2 })).toBe(80);
  });

  it("progresse de façon monotone pendant la phase de croissance", () => {
    const v20 = attributeValueAtAge({ ...base, age: 20 });
    const v22 = attributeValueAtAge({ ...base, age: 22 });
    const v24 = attributeValueAtAge({ ...base, age: 24 });
    expect(v22).toBeGreaterThan(v20);
    expect(v24).toBeGreaterThan(v22);
  });

  it("décline après le plateau, jamais avant", () => {
    const plateauEnd = attributeValueAtAge({ ...base, age: base.peakAge + 2 });
    const afterPlateau = attributeValueAtAge({ ...base, age: base.peakAge + 5 });
    expect(afterPlateau).toBeLessThan(plateauEnd);
  });

  it("un multiplicateur de déclin plus élevé fait chuter plus vite (ailier vs pilier)", () => {
    const slow = attributeValueAtAge({ ...base, age: base.peakAge + 6, declineMultiplier: 0.5 });
    const fast = attributeValueAtAge({ ...base, age: base.peakAge + 6, declineMultiplier: 1.15 });
    expect(fast).toBeLessThan(slow);
  });

  it("ne descend jamais sous le plancher minimum", () => {
    const v = attributeValueAtAge({ ...base, age: 60, declineMultiplier: 2 });
    expect(v).toBeGreaterThanOrEqual(15);
  });
});
