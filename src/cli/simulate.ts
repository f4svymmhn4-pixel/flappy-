#!/usr/bin/env node
// CLI de vérification du moteur — jalon 2 : simuler une carrière complète,
// sans UI, avec une graine pour pouvoir la rejouer à l'identique.
//
// Usage : npm run simulate -- --position 11 --seed 42 --name "Léo Faivre" --nationality France

import { getPosition } from "../engine/positions.js";
import { simulateCareer } from "../engine/career.js";
import { computeOVR } from "../engine/attributes.js";
import type { PositionId } from "../engine/types.js";

function parseArgs(argv: string[]): Record<string, string> {
  const args: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (token?.startsWith("--")) {
      const key = token.slice(2);
      const value = argv[i + 1];
      args[key] = value ?? "true";
      i++;
    }
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));
const position = Number(args.position ?? 11) as PositionId;
const seed = Number(args.seed ?? 42);
const name = args.name ?? "Joueur Test";
const nationality = args.nationality ?? "France";
const potential = args.potential ? Number(args.potential) : undefined;

const positionDef = getPosition(position);
const career = simulateCareer({ name, nationality, position, seed, potential });

console.log(`\n=== ${name} (${nationality}) — ${positionDef.name} — graine ${seed} ===\n`);

let tries = 0;
let matchesTotal = 0;
let injuriesTotal = 0;
let redCards = 0;
let yellowCards = 0;

for (const season of career.seasons) {
  const ovr = season.ovrEnd;
  const statLine = Object.entries(season.statTotals)
    .map(([key, value]) => `${key}=${value}`)
    .join(", ");
  console.log(
    `Saison ${season.season} (${season.age} ans) — OVR ${ovr} — ${season.matchesPlayed}/${season.matchesScheduled} matchs — ${statLine || "aucune stat (pas titulaire)"}`,
  );
  if (season.injuries.length > 0) {
    for (const injury of season.injuries) {
      console.log(`  blessure : ${injury.severity} (${injury.weeksOut} semaines)`);
    }
  }
  if (season.disciplineEvents.length > 0) {
    for (const event of season.disciplineEvents) {
      console.log(`  discipline : carton ${event.card}${event.suspensionWeeks ? ` (${event.suspensionWeeks} sem. de suspension)` : ""}`);
    }
  }
  matchesTotal += season.matchesPlayed;
  injuriesTotal += season.injuries.length;
  redCards += season.disciplineEvents.filter((e) => e.card === "red").length;
  yellowCards += season.disciplineEvents.filter((e) => e.card === "yellow").length;
  tries += season.statTotals.essais ?? 0;
}

console.log(`\n--- Bilan de carrière ---`);
console.log(`Retraite à ${career.retirementAge} ans (${career.retirementReason})`);
console.log(`${career.seasons.length} saisons, ${matchesTotal} matchs joués`);
console.log(`${injuriesTotal} blessures, ${career.player.concussionCount} commotion(s)`);
console.log(`${yellowCards} cartons jaunes, ${redCards} cartons rouges`);
if (tries > 0) console.log(`${Math.round(tries * 10) / 10} essais marqués`);
console.log(`OVR final (indicatif) : ${computeOVR(positionDef.weights, career.player.attributes)}`);
