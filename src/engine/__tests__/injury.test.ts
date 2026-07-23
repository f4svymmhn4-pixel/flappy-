import { describe, expect, it } from "vitest";
import { createRng } from "../rng.js";
import { createPlayer } from "../player.js";
import { getPosition } from "../positions.js";
import { injuryProbability, rollInjury } from "../injury.js";

describe("injuryProbability", () => {
  it("reste une probabilité valide [0, 1]", () => {
    const rng = createRng(1);
    const player = createPlayer({ name: "Test", nationality: "France", position: 5, rng });
    const position = getPosition(5);
    const p = injuryProbability(player, position);
    expect(p).toBeGreaterThanOrEqual(0);
    expect(p).toBeLessThanOrEqual(1);
  });

  it("augmente avec l'âge après le pic + 3 ans", () => {
    const rng = createRng(2);
    const player = createPlayer({ name: "Test", nationality: "France", position: 5, rng });
    const position = getPosition(5);
    player.age = position.peakAge;
    const pYoung = injuryProbability(player, position);
    player.age = position.peakAge + 10;
    const pOld = injuryProbability(player, position);
    expect(pOld).toBeGreaterThan(pYoung);
  });

  it("augmente avec la fatigue", () => {
    const rng = createRng(3);
    const player = createPlayer({ name: "Test", nationality: "France", position: 5, rng });
    const position = getPosition(5);
    player.fatigue = 0;
    const pRested = injuryProbability(player, position);
    player.fatigue = 1;
    const pTired = injuryProbability(player, position);
    expect(pTired).toBeGreaterThan(pRested);
  });

  it("un ailier (poste le moins exposé) a une base plus faible qu'un 2e ligne", () => {
    const rng = createRng(4);
    const winger = createPlayer({ name: "A", nationality: "France", position: 11, rng });
    const lock = createPlayer({ name: "B", nationality: "France", position: 5, rng });
    expect(getPosition(11).injuryBaseRate).toBeLessThan(getPosition(5).injuryBaseRate);
    expect(injuryProbability(winger, getPosition(11))).toBeLessThan(injuryProbability(lock, getPosition(5)));
  });
});

describe("rollInjury", () => {
  it("le protocole commotion impose un minimum de 3 semaines incompressibles", () => {
    // On force le déclenchement en cherchant une graine qui produit une commotion.
    const position = getPosition(5);
    let found = false;
    for (let seed = 1; seed < 3000 && !found; seed++) {
      const rng = createRng(seed);
      const player = createPlayer({ name: "Test", nationality: "France", position: 5, rng });
      const roll = rollInjury(player, position, 1, 1, rng);
      if (roll?.isConcussion) {
        expect(roll.weeksOut).toBeGreaterThanOrEqual(3);
        found = true;
      }
    }
    expect(found).toBe(true);
  });

  it("les semaines d'indisponibilité sont toujours positives", () => {
    const position = getPosition(6);
    for (let seed = 1; seed < 100; seed++) {
      const rng = createRng(seed);
      const player = createPlayer({ name: "Test", nationality: "France", position: 6, rng });
      const roll = rollInjury(player, position, 1, 1, rng);
      if (roll) expect(roll.weeksOut).toBeGreaterThan(0);
    }
  });
});
