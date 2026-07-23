import { describe, expect, it } from "vitest";
import { simulateCareer } from "../career.js";
import { getPosition } from "../positions.js";
import type { PositionId } from "../types.js";

describe("simulateCareer", () => {
  it("se termine toujours (pas de boucle infinie) pour tous les postes", () => {
    for (let position = 1; position <= 15; position++) {
      const career = simulateCareer({
        name: "Test",
        nationality: "France",
        position: position as PositionId,
        seed: position * 101,
      });
      expect(career.seasons.length).toBeGreaterThan(0);
      expect(career.player.retired).toBe(true);
    }
  });

  it("est déterministe : même graine -> même carrière", () => {
    const a = simulateCareer({ name: "Test", nationality: "France", position: 10, seed: 2024 });
    const b = simulateCareer({ name: "Test", nationality: "France", position: 10, seed: 2024 });
    expect(a).toEqual(b);
  });

  it("l'âge de retraite reste dans une fourchette plausible pour le poste", () => {
    for (const seed of [1, 2, 3, 4, 5]) {
      const career = simulateCareer({ name: "Test", nationality: "France", position: 1, seed });
      // Un pilier peut partir plus tôt que la borne basse en cas de série
      // noire de blessures : on vérifie juste qu'il ne dépasse jamais la borne haute.
      expect(career.retirementAge).toBeLessThanOrEqual(getPosition(1).careerSpan.max);
      expect(career.retirementAge).toBeGreaterThanOrEqual(18);
    }
  });

  it("un pilier tend à durer plus longtemps en carrière qu'un ailier, en moyenne", () => {
    const seeds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const avg = (position: PositionId) =>
      seeds
        .map((seed) => simulateCareer({ name: "Test", nationality: "France", position, seed }).retirementAge)
        .reduce((a, b) => a + b, 0) / seeds.length;

    const piliers = avg(3);
    const ailiers = avg(11);
    expect(piliers).toBeGreaterThan(ailiers);
  });

  it("respecte le garde-fou maxSeasons", () => {
    const career = simulateCareer({ name: "Test", nationality: "France", position: 10, seed: 42, maxSeasons: 3 });
    expect(career.seasons.length).toBeLessThanOrEqual(3);
  });
});
