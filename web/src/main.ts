import { getPosition } from "../../src/engine/positions.js";
import type { PositionId, SeasonSummary } from "../../src/engine/types.js";
import { FORMATION_ROWS } from "./formation.js";
import { NATIONS } from "./nations.js";
import { pickPhrase, type PhraseTrigger } from "./phrases.js";
import { GameSession, randomSeed, type CareerFlavor } from "./session.js";

const GABARITS = ["Sec et longiligne", "Standard", "Lourd et puissant"];
const TEMPERAMENTS = ["Calme", "Feu follet", "Meneur"];
const ORIGINES = ["Centre de formation", "Rugby de village", "Reconversion sportive", "Filière universitaire"];

const app = document.getElementById("app");
if (!app) throw new Error("Racine #app introuvable");

let session: GameSession | null = null;
let lastTrigger: PhraseTrigger = "saison-neutre";

function clear(root: HTMLElement): void {
  root.replaceChildren();
}

function masthead(root: HTMLElement, subtitle: string): void {
  const header = document.createElement("div");
  header.className = "masthead";
  const brand = document.createElement("div");
  brand.className = "brand";
  brand.textContent = "Carnet de Terrain";
  const meta = document.createElement("div");
  meta.className = "meta";
  meta.textContent = subtitle;
  header.append(brand, meta);
  root.append(header);
}

// --- Écran 1 : création -----------------------------------------------

function renderCreation(): void {
  clear(app!);
  masthead(app!, "création");

  const h1 = document.createElement("h1");
  h1.textContent = "Nouvelle carrière";
  app!.append(h1);

  const form = document.createElement("form");
  form.noValidate = true;

  // Nom
  const nameGroup = document.createElement("div");
  nameGroup.className = "field-group";
  const nameLabel = document.createElement("label");
  nameLabel.htmlFor = "name";
  nameLabel.textContent = "Nom du joueur";
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.id = "name";
  nameInput.required = true;
  nameInput.maxLength = 40;
  nameInput.autocomplete = "off";
  nameGroup.append(nameLabel, nameInput);

  // Nationalité
  const natGroup = document.createElement("div");
  natGroup.className = "field-group";
  const natLabel = document.createElement("label");
  natLabel.htmlFor = "nationality";
  natLabel.textContent = "Nationalité";
  const natSelect = document.createElement("select");
  natSelect.id = "nationality";
  for (const nation of NATIONS) {
    const opt = document.createElement("option");
    opt.value = nation;
    opt.textContent = nation;
    natSelect.append(opt);
  }
  natGroup.append(natLabel, natSelect);

  // Poste — feuille de match interactive
  const posFieldset = document.createElement("fieldset");
  const posLegend = document.createElement("legend");
  posLegend.textContent = "Poste (composition d'équipe)";
  posFieldset.append(posLegend);

  const formationDiv = document.createElement("div");
  formationDiv.className = "formation";
  formationDiv.setAttribute("role", "radiogroup");
  formationDiv.setAttribute("aria-label", "Choix du poste");

  let selectedPosition: PositionId | null = null;
  const posButtons: HTMLButtonElement[] = [];

  for (const row of FORMATION_ROWS) {
    const rowDiv = document.createElement("div");
    rowDiv.className = "formation-row";
    for (const posId of row) {
      const def = getPosition(posId);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pos-btn";
      btn.setAttribute("role", "radio");
      btn.setAttribute("aria-pressed", "false");
      btn.setAttribute("aria-label", `${posId} — ${def.name}`);
      const num = document.createElement("span");
      num.className = "num";
      num.textContent = String(posId);
      const label = document.createElement("span");
      label.className = "label";
      label.textContent = def.name;
      btn.append(num, label);
      btn.addEventListener("click", () => {
        selectedPosition = posId;
        for (const b of posButtons) b.setAttribute("aria-pressed", "false");
        btn.setAttribute("aria-pressed", "true");
        submitBtn.disabled = !(nameInput.value.trim().length > 0 && selectedPosition !== null);
      });
      posButtons.push(btn);
      rowDiv.append(btn);
    }
    formationDiv.append(rowDiv);
  }
  posFieldset.append(formationDiv);

  // Gabarit / tempérament / origine
  function selectField(id: string, labelText: string, options: string[]): HTMLDivElement {
    const group = document.createElement("div");
    group.className = "field-group";
    const label = document.createElement("label");
    label.htmlFor = id;
    label.textContent = labelText;
    const select = document.createElement("select");
    select.id = id;
    for (const opt of options) {
      const o = document.createElement("option");
      o.value = opt;
      o.textContent = opt;
      select.append(o);
    }
    group.append(label, select);
    return group;
  }

  const gabaritGroup = selectField("gabarit", "Gabarit", GABARITS);
  const temperamentGroup = selectField("temperament", "Tempérament", TEMPERAMENTS);
  const origineGroup = selectField("origine", "Origine", ORIGINES);

  // Graine (debug / rejouabilité)
  const seedGroup = document.createElement("div");
  seedGroup.className = "field-group";
  const seedLabel = document.createElement("label");
  seedLabel.htmlFor = "seed";
  seedLabel.textContent = "Graine (optionnel)";
  const seedInput = document.createElement("input");
  seedInput.type = "number";
  seedInput.id = "seed";
  seedInput.placeholder = "aléatoire si vide";
  const seedHelp = document.createElement("p");
  seedHelp.className = "help-text";
  seedHelp.textContent = "Deux carrières lancées avec la même graine, le même nom, la même nationalité et le même poste se déroulent à l'identique.";
  seedGroup.append(seedLabel, seedInput);

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.className = "btn";
  submitBtn.textContent = "Commencer la carrière";
  submitBtn.disabled = true;

  nameInput.addEventListener("input", () => {
    submitBtn.disabled = !(nameInput.value.trim().length > 0 && selectedPosition !== null);
  });

  form.append(
    nameGroup,
    natGroup,
    posFieldset,
    gabaritGroup,
    temperamentGroup,
    origineGroup,
    seedGroup,
    seedHelp,
    submitBtn,
  );

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!selectedPosition) return;
    const flavor: CareerFlavor = {
      gabarit: (gabaritGroup.querySelector("select") as HTMLSelectElement).value,
      temperament: (temperamentGroup.querySelector("select") as HTMLSelectElement).value,
      origine: (origineGroup.querySelector("select") as HTMLSelectElement).value,
    };
    const seed = seedInput.value ? Number(seedInput.value) : randomSeed();
    session = new GameSession({
      name: nameInput.value.trim(),
      nationality: natSelect.value,
      position: selectedPosition,
      flavor,
      seed,
    });
    lastTrigger = "premiere-saison";
    renderSeason();
  });

  app!.append(form);
}

// --- Écran 2 : avant-saison ---------------------------------------------

function renderSeason(): void {
  if (!session) return renderCreation();
  clear(app!);
  masthead(app!, session.player.nationality);

  const h1 = document.createElement("h1");
  h1.textContent = session.player.name;
  app!.append(h1);

  const card = document.createElement("div");
  card.className = "card";

  const posLine = document.createElement("h3");
  posLine.textContent = `${session.positionDef.name} · ${session.player.age} ans`;
  const ovr = document.createElement("div");
  ovr.className = "ovr";
  ovr.textContent = String(session.ovr);
  const ovrLabel = document.createElement("p");
  ovrLabel.className = "help-text";
  ovrLabel.textContent = "Note globale indicative";

  const seasonLabel = document.createElement("p");
  seasonLabel.textContent = session.player.age < 19 ? "Saison en centre de formation." : `Saison ${session.seasonNumber} de carrière professionnelle.`;

  card.append(posLine, ovr, ovrLabel, seasonLabel);
  app!.append(card);

  const playBtn = document.createElement("button");
  playBtn.type = "button";
  playBtn.className = "btn";
  playBtn.textContent = "Jouer la saison";
  playBtn.addEventListener("click", () => {
    const summary = session!.playSeason();
    lastTrigger = selectTrigger(session!, summary);
    renderBilan(summary);
  });
  app!.append(playBtn);
}

// --- Sélection de la phrase d'ambiance -----------------------------------

function selectTrigger(s: GameSession, summary: SeasonSummary): PhraseTrigger {
  if (s.retired) {
    switch (s.retirementReason) {
      case "commotions":
        return "retraite-commotions";
      case "blessure-recurrente":
        return "retraite-blessures";
      case "declin":
        return "retraite-declin";
      case "choisie":
      default:
        return "retraite-choisie";
    }
  }
  if (summary.season === 1) return "premiere-saison";
  if (summary.matchesPlayed === 0) return "saison-blanche";
  if (summary.injuries.some((i) => i.isConcussion)) return "commotion";
  if (summary.injuries.some((i) => i.severity === "severe" || i.severity === "longue")) return "blessure-severe";
  if (summary.disciplineEvents.some((e) => e.card === "red")) return "carton-rouge";
  if (summary.disciplineEvents.filter((e) => e.card === "yellow").length >= 3) return "cartons-jaunes-frequents";
  const tries = summary.statTotals.essais ?? 0;
  if (tries >= 8) return "beaucoup-essais";
  if (summary.matchesPlayed >= 25 && summary.injuries.length === 0) return "solide-saison";
  return "saison-neutre";
}

// --- Écran 3 : bilan de saison --------------------------------------------

function renderBilan(summary: SeasonSummary): void {
  if (!session) return renderCreation();
  clear(app!);
  masthead(app!, `saison ${summary.season}`);

  const h1 = document.createElement("h1");
  h1.textContent = session.retired ? "Fin de saison — dernière" : "Bilan de saison";
  app!.append(h1);

  const card = document.createElement("div");
  card.className = "card";

  const table = document.createElement("table");
  table.className = "statline";
  const rows: [string, string][] = [
    ["Âge", `${summary.age} ans`],
    ["Matchs joués", `${summary.matchesPlayed} / ${summary.matchesScheduled}`],
  ];
  for (const stat of session.positionDef.stats) {
    const value = summary.statTotals[stat.key];
    if (value === undefined) continue;
    rows.push([stat.label, stat.unit === "percent" ? `${value} %` : String(value)]);
  }
  for (const [label, value] of rows) {
    const tr = document.createElement("tr");
    const td1 = document.createElement("td");
    td1.textContent = label;
    const td2 = document.createElement("td");
    td2.textContent = value;
    tr.append(td1, td2);
    table.append(tr);
  }
  card.append(table);

  if (summary.injuries.length > 0 || summary.disciplineEvents.length > 0) {
    const tagsWrap = document.createElement("div");
    for (const injury of summary.injuries) {
      const tag = document.createElement("span");
      tag.className = "tag injury";
      tag.textContent = `blessure ${injury.severity} — ${injury.weeksOut} sem.${injury.isConcussion ? " (commotion)" : ""}`;
      tagsWrap.append(tag);
    }
    for (const event of summary.disciplineEvents) {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent =
        event.card === "red" ? `carton rouge — ${event.suspensionWeeks} sem. de suspension` : "carton jaune";
      tagsWrap.append(tag);
    }
    card.append(tagsWrap);
  }

  app!.append(card);

  const ambiance = document.createElement("p");
  ambiance.className = "ambiance";
  ambiance.textContent = pickPhrase(lastTrigger, session.rng);
  app!.append(ambiance);

  if (session.retired) {
    const reasonLine = document.createElement("p");
    reasonLine.className = "help-text";
    reasonLine.textContent = `Retraite à ${session.player.age} ans (${retirementReasonLabel(session.retirementReason)}).`;
    app!.append(reasonLine);

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn";
    btn.textContent = "Voir le bilan de carrière";
    btn.addEventListener("click", renderCareerEnd);
    app!.append(btn);
  } else {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn";
    btn.textContent = "Saison suivante";
    btn.addEventListener("click", renderSeason);
    app!.append(btn);
  }
}

function retirementReasonLabel(reason: string | undefined): string {
  switch (reason) {
    case "commotions":
      return "commotions à répétition";
    case "blessure-recurrente":
      return "blessures à répétition";
    case "declin":
      return "déclin physique";
    case "choisie":
      return "retraite choisie";
    default:
      return "fin de carrière";
  }
}

// --- Écran 4 : bilan de carrière -------------------------------------------

function renderCareerEnd(): void {
  if (!session) return renderCreation();
  clear(app!);
  masthead(app!, "bilan de carrière");

  const h1 = document.createElement("h1");
  h1.textContent = `${session.player.name} — carrière terminée`;
  app!.append(h1);

  const summaryLine = document.createElement("p");
  summaryLine.textContent = `${session.positionDef.name} · ${session.player.nationality} · retraite à ${session.player.age} ans (${retirementReasonLabel(session.retirementReason)}).`;
  app!.append(summaryLine);

  const table = document.createElement("table");
  table.className = "career-table";
  const thead = document.createElement("tr");
  for (const h of ["Saison", "Âge", "Matchs", "Blessures", "Cartons"]) {
    const th = document.createElement("th");
    th.textContent = h;
    thead.append(th);
  }
  table.append(thead);

  let totalMatches = 0;
  let totalInjuries = 0;
  let totalYellow = 0;
  let totalRed = 0;

  for (const s of session.seasons) {
    const tr = document.createElement("tr");
    const cells = [
      String(s.season),
      String(s.age),
      `${s.matchesPlayed}/${s.matchesScheduled}`,
      String(s.injuries.length),
      String(s.disciplineEvents.length),
    ];
    for (const c of cells) {
      const td = document.createElement("td");
      td.textContent = c;
      tr.append(td);
    }
    table.append(tr);
    totalMatches += s.matchesPlayed;
    totalInjuries += s.injuries.length;
    totalYellow += s.disciplineEvents.filter((e) => e.card === "yellow").length;
    totalRed += s.disciplineEvents.filter((e) => e.card === "red").length;
  }
  app!.append(table);

  const totals = document.createElement("div");
  totals.className = "card";
  const totalsList = [
    `${session.seasons.length} saisons`,
    `${totalMatches} matchs joués`,
    `${totalInjuries} blessures (dont ${session.player.concussionCount} commotion(s))`,
    `${totalYellow} carton${totalYellow === 1 ? "" : "s"} jaune${totalYellow === 1 ? "" : "s"}, ${totalRed} carton${totalRed === 1 ? "" : "s"} rouge${totalRed === 1 ? "" : "s"}`,
  ];
  for (const line of totalsList) {
    const p = document.createElement("p");
    p.textContent = line;
    totals.append(p);
  }
  app!.append(totals);

  const closing = document.createElement("p");
  closing.className = "ambiance";
  closing.textContent = pickPhrase(lastTrigger, session.rng);
  app!.append(closing);

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "btn";
  btn.textContent = "Nouvelle carrière";
  btn.addEventListener("click", () => {
    session = null;
    renderCreation();
  });
  app!.append(btn);
}

renderCreation();
