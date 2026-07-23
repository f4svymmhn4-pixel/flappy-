import { describe, expect, it } from "vitest";
import { createRng } from "../rng.js";

describe("createRng", () => {
  it("est déterministe pour une même graine", () => {
    const a = createRng(1234);
    const b = createRng(1234);
    const seqA = Array.from({ length: 20 }, () => a.float());
    const seqB = Array.from({ length: 20 }, () => b.float());
    expect(seqA).toEqual(seqB);
  });

  it("produit des séquences différentes pour des graines différentes", () => {
    const a = createRng(1);
    const b = createRng(2);
    const seqA = Array.from({ length: 20 }, () => a.float());
    const seqB = Array.from({ length: 20 }, () => b.float());
    expect(seqA).not.toEqual(seqB);
  });

  it("float() reste dans [0, 1)", () => {
    const rng = createRng(42);
    for (let i = 0; i < 1000; i++) {
      const v = rng.float();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it("int(min, max) respecte les bornes inclusives", () => {
    const rng = createRng(7);
    const values = new Set<number>();
    for (let i = 0; i < 500; i++) {
      const v = rng.int(1, 3);
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(3);
      values.add(v);
    }
    expect(values).toEqual(new Set([1, 2, 3]));
  });

  it("weightedPick ne retourne que des valeurs à poids > 0", () => {
    const rng = createRng(99);
    for (let i = 0; i < 200; i++) {
      const picked = rng.weightedPick([
        { value: "a", weight: 1 },
        { value: "b", weight: 0 },
      ]);
      expect(picked).toBe("a");
    }
  });

  it("weightedPick rejette une somme de poids nulle", () => {
    const rng = createRng(1);
    expect(() => rng.weightedPick([{ value: "a", weight: 0 }])).toThrow();
  });
});
