import { describe, expect, it } from "vitest";
import { createRng } from "../rng.js";
import { createPlayer } from "../player.js";
import { getPosition } from "../positions.js";
import { redCardProbability, rollDiscipline, yellowCardProbability } from "../discipline.js";

describe("yellowCardProbability / redCardProbability", () => {
  it("un joueur plus discipliné concède moins de cartons", () => {
    const rng = createRng(1);
    const player = createPlayer({ name: "Test", nationality: "France", position: 6, rng });
    const position = getPosition(6);

    player.attributes.discipline = 90;
    const pDiscipline = yellowCardProbability(player, position);
    player.attributes.discipline = 20;
    const pIndiscipline = yellowCardProbability(player, position);
    expect(pIndiscipline).toBeGreaterThan(pDiscipline);

    player.attributes.discipline = 90;
    const rDiscipline = redCardProbability(player, position);
    player.attributes.discipline = 20;
    const rIndiscipline = redCardProbability(player, position);
    expect(rIndiscipline).toBeGreaterThan(rDiscipline);
  });

  it("les postes de contact ont un taux de carton jaune de base plus élevé que les 3/4", () => {
    expect(getPosition(5).cardBaseRate.yellow).toBeGreaterThan(getPosition(11).cardBaseRate.yellow);
  });
});

describe("rollDiscipline", () => {
  it("une suspension de carton rouge est toujours dans les bandes du barème (2 à 10 semaines)", () => {
    const position = getPosition(1);
    for (let seed = 1; seed < 300; seed++) {
      const rng = createRng(seed);
      const player = createPlayer({ name: "Test", nationality: "France", position: 1, rng });
      player.attributes.discipline = 10; // maximise la probabilité de tirer un carton rouge
      const roll = rollDiscipline(player, position, 1, 1, rng);
      if (roll?.record.card === "red") {
        expect(roll.record.suspensionWeeks).toBeGreaterThanOrEqual(2);
        expect(roll.record.suspensionWeeks).toBeLessThanOrEqual(10);
      }
    }
  });

  it("un carton jaune n'entraîne aucune semaine de suspension", () => {
    const position = getPosition(1);
    for (let seed = 1; seed < 300; seed++) {
      const rng = createRng(seed);
      const player = createPlayer({ name: "Test", nationality: "France", position: 1, rng });
      const roll = rollDiscipline(player, position, 1, 1, rng);
      if (roll?.record.card === "yellow") {
        expect(roll.record.suspensionWeeks).toBe(0);
      }
    }
  });
});
