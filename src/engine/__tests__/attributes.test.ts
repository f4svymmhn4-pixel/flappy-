import { describe, expect, it } from "vitest";
import { clamp, computeOVR, generatePeakAttributes, generateStartAttributes } from "../attributes.js";
import { getPosition } from "../positions.js";
import { ATTRIBUTE_KEYS, type Attributes } from "../types.js";
import { createRng } from "../rng.js";

function flat(value: number): Attributes {
  const attrs = {} as Attributes;
  for (const key of ATTRIBUTE_KEYS) attrs[key] = value;
  return attrs;
}

describe("clamp", () => {
  it("borne une valeur entre min et max", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });
});

describe("computeOVR", () => {
  it("retourne la valeur commune si tous les attributs sont égaux", () => {
    const pilier = getPosition(1);
    expect(computeOVR(pilier.weights, flat(70))).toBe(70);
  });

  it("favorise les attributs les plus pondérés du poste", () => {
    const pilier = getPosition(1); // puissance pèse 30, vitesse pèse 3
    const puissant = flat(50);
    puissant.puissance = 90;
    const rapide = flat(50);
    rapide.vitesse = 90;
    expect(computeOVR(pilier.weights, puissant)).toBeGreaterThan(computeOVR(pilier.weights, rapide));
  });
});

describe("generatePeakAttributes", () => {
  it("reste dans les bornes [30, 99] et respecte la pondération du poste", () => {
    const rng = createRng(1);
    const pilier = getPosition(1);
    const ailier = getPosition(11);
    const peakPilier = generatePeakAttributes(pilier, 1, (r) => rng.noise(r));
    const peakAilier = generatePeakAttributes(ailier, 1, (r) => rng.noise(r));

    for (const key of ATTRIBUTE_KEYS) {
      expect(peakPilier[key]).toBeGreaterThanOrEqual(30);
      expect(peakPilier[key]).toBeLessThanOrEqual(99);
    }
    // Un pilier au potentiel maximal doit viser une puissance nettement
    // supérieure à sa vitesse (poids 30 vs poids 3).
    expect(peakPilier.puissance).toBeGreaterThan(peakPilier.vitesse);
    // Un ailier au potentiel maximal doit viser une vitesse nettement
    // supérieure à sa discipline (poids 30 vs poids 3).
    expect(peakAilier.vitesse).toBeGreaterThan(peakAilier.discipline);
  });

  it("un potentiel plus élevé produit en moyenne des plafonds plus élevés", () => {
    const rngLow = createRng(5);
    const rngHigh = createRng(5);
    const pilier = getPosition(1);
    const low = generatePeakAttributes(pilier, 0.2, (r) => rngLow.noise(r));
    const high = generatePeakAttributes(pilier, 1, (r) => rngHigh.noise(r));
    expect(high.puissance).toBeGreaterThan(low.puissance);
  });
});

describe("generateStartAttributes", () => {
  it("part toujours en-dessous ou égal au plafond de plateau", () => {
    const peak = flat(90);
    const start = generateStartAttributes(peak);
    for (const key of ATTRIBUTE_KEYS) {
      expect(start[key]).toBeLessThanOrEqual(peak[key]);
    }
  });
});
