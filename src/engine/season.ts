// Simulation d'une saison — docs/modele-rugby.md §4.
// Pas de notion de club/mercato ici (jalon 5) : un contexte minimal fixe le
// nombre de matchs programmés et un seuil de titularisation.

import { clamp, computeOVR } from "./attributes.js";
import { rollDiscipline } from "./discipline.js";
import { rollInjury } from "./injury.js";
import { getPosition } from "./positions.js";
import type { Rng } from "./rng.js";
import type { MatchLog, Player, SeasonSummary } from "./types.js";

export interface SeasonContext {
  /** Matchs programmés sur la saison (championnat + coupes + phases finales). */
  matchesScheduled: number;
}

export const DEFAULT_SEASON_CONTEXT: SeasonContext = { matchesScheduled: 30 };

function starterProbability(ovr: number): number {
  return clamp((ovr - 40) / 40, 0.05, 0.95);
}

function generateStatLine(player: Player, positionDef: ReturnType<typeof getPosition>, rng: Rng): Record<string, number> {
  const line: Record<string, number> = {};
  for (const stat of positionDef.stats) {
    const attrAvg = stat.attributes.reduce((sum, key) => sum + player.attributes[key], 0) / stat.attributes.length;
    const multiplier = clamp(attrAvg / 70, 0.4, 1.8);
    const raw = stat.baseAvg * multiplier * rng.noise(0.7);
    if (stat.unit === "percent") {
      line[stat.key] = Math.round(clamp(raw, 30, 99));
    } else {
      line[stat.key] = Math.round(Math.max(0, raw) * 10) / 10;
    }
  }
  return line;
}

export function simulateSeason(
  player: Player,
  seasonNumber: number,
  rng: Rng,
  context: SeasonContext = DEFAULT_SEASON_CONTEXT,
): SeasonSummary {
  const positionDef = getPosition(player.position);
  const ovr = computeOVR(positionDef.weights, player.attributes);
  const pStart = starterProbability(ovr);

  const matches: MatchLog[] = [];
  let weeksOutInjury = 0;
  let weeksOutSuspension = 0;
  const statTotals: Record<string, number> = {};

  for (let matchIndex = 1; matchIndex <= context.matchesScheduled; matchIndex++) {
    if (weeksOutInjury > 0 || weeksOutSuspension > 0) {
      if (weeksOutInjury > 0) weeksOutInjury--;
      if (weeksOutSuspension > 0) weeksOutSuspension--;
      matches.push({ matchIndex, played: false, statLine: {} });
      player.fatigue = clamp(player.fatigue - 0.08, 0, 1);
      continue;
    }

    const selected = rng.chance(pStart);
    if (!selected) {
      matches.push({ matchIndex, played: false, statLine: {} });
      player.fatigue = clamp(player.fatigue - 0.05, 0, 1);
      continue;
    }

    const statLine = generateStatLine(player, positionDef, rng);
    for (const [key, value] of Object.entries(statLine)) {
      statTotals[key] = (statTotals[key] ?? 0) + value;
    }
    player.fatigue = clamp(player.fatigue + 0.08, 0, 1);

    const log: MatchLog = { matchIndex, played: true, statLine };

    const injuryRoll = rollInjury(player, positionDef, seasonNumber, matchIndex, rng);
    if (injuryRoll) {
      log.injury = injuryRoll.injury;
      player.injuryHistory.push(injuryRoll.injury);
      weeksOutInjury = injuryRoll.injury.weeksOut;
      if (injuryRoll.isConcussion) player.concussionCount++;
    }

    const disciplineRoll = rollDiscipline(player, positionDef, seasonNumber, matchIndex, rng);
    if (disciplineRoll) {
      log.discipline = disciplineRoll.record;
      player.disciplineHistory.push(disciplineRoll.record);
      player.reputation = clamp(player.reputation + disciplineRoll.reputationDelta, 0, 100);
      if (disciplineRoll.record.card === "red") {
        weeksOutSuspension = disciplineRoll.record.suspensionWeeks;
      }
    }

    matches.push(log);
  }

  const matchesPlayed = matches.filter((m) => m.played).length;
  const roundedStatTotals: Record<string, number> = {};
  for (const stat of positionDef.stats) {
    const total = statTotals[stat.key] ?? 0;
    if (stat.unit === "percent") {
      // Une statistique en % se moyenne sur la saison, elle ne se cumule pas.
      roundedStatTotals[stat.key] = matchesPlayed > 0 ? Math.round(total / matchesPlayed) : 0;
    } else {
      roundedStatTotals[stat.key] = Math.round(total * 10) / 10;
    }
  }

  return {
    season: seasonNumber,
    age: player.age,
    matchesScheduled: context.matchesScheduled,
    matchesPlayed,
    weeksOutInjury: matches.reduce((sum, m) => sum + (m.injury?.weeksOut ?? 0), 0),
    weeksOutSuspension: matches.reduce((sum, m) => sum + (m.discipline?.suspensionWeeks ?? 0), 0),
    statTotals: roundedStatTotals,
    injuries: matches.map((m) => m.injury).filter((i): i is NonNullable<typeof i> => Boolean(i)),
    disciplineEvents: matches.map((m) => m.discipline).filter((d): d is NonNullable<typeof d> => Boolean(d)),
    ovrStart: ovr,
    ovrEnd: ovr,
  };
}
