import { describe, expect, it } from "vitest";
import { createRng } from "../rng.js";
import { createPlayer } from "../player.js";
import { simulateSeason } from "../season.js";
import { getPosition } from "../positions.js";

describe("simulateSeason", () => {
  it("ne joue jamais plus de matchs que programmés", () => {
    const rng = createRng(11);
    const player = createPlayer({ name: "Test", nationality: "France", position: 9, rng, potential: 0.9 });
    const summary = simulateSeason(player, 1, rng, { matchesScheduled: 30 });
    expect(summary.matchesPlayed).toBeLessThanOrEqual(30);
    expect(summary.matchesPlayed).toBeGreaterThanOrEqual(0);
  });

  it("une statistique en pourcentage reste dans [0, 100]", () => {
    const rng = createRng(21);
    const player = createPlayer({ name: "Test", nationality: "France", position: 2, rng, potential: 0.8 });
    const summary = simulateSeason(player, 1, rng, { matchesScheduled: 30 });
    const position = getPosition(2);
    for (const stat of position.stats) {
      if (stat.unit === "percent" && summary.matchesPlayed > 0) {
        expect(summary.statTotals[stat.key]).toBeGreaterThanOrEqual(0);
        expect(summary.statTotals[stat.key]).toBeLessThanOrEqual(100);
      }
    }
  });

  it("est déterministe : même graine, même joueur -> même résultat", () => {
    const runOnce = () => {
      const rng = createRng(555);
      const player = createPlayer({ name: "Test", nationality: "France", position: 11, rng, potential: 0.7 });
      return simulateSeason(player, 1, rng, { matchesScheduled: 30 });
    };
    const a = runOnce();
    const b = runOnce();
    expect(a).toEqual(b);
  });

  it("les compteurs de blessure et de suspension restent positifs ou nuls", () => {
    const rng = createRng(31);
    const player = createPlayer({ name: "Test", nationality: "France", position: 5, rng, potential: 0.5 });
    const summary = simulateSeason(player, 1, rng, { matchesScheduled: 30 });
    expect(summary.weeksOutInjury).toBeGreaterThanOrEqual(0);
    expect(summary.weeksOutSuspension).toBeGreaterThanOrEqual(0);
    expect(summary.injuries.length).toBeGreaterThanOrEqual(0);
  });
});
