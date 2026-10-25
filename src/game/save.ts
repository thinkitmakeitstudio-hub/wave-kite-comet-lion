import { CLASSES, MONSTERS, RELICS, defaultRoster, LEVEL_CAP } from "./content";
import type { EnemyState, PersistedHero, Results, Run, SaveBlob, Settings, Stats } from "./types";

const KEY = "adventure-cards-v1";

export function emptyStats(): Stats {
  return { runs: 0, wins: 0, bosses: 0, lowHpBoss: false, fullPartyWin: false, doors: [], slain: [] };
}

export function emptySave(): SaveBlob {
  return {
    version: 1,
    roster: defaultRoster(),
    stats: emptyStats(),
    settings: { mute: false },
    partyIds: ["knight"],
    locker: [],
    loadout: {},
    run: null,
    results: null,
  };
}

function clampLevel(n: unknown): number {
  const v = typeof n === "number" && Number.isFinite(n) ? Math.round(n) : 1;
  return Math.max(1, Math.min(LEVEL_CAP, v));
}

function normalizeRoster(raw: unknown): PersistedHero[] {
  const incoming = Array.isArray(raw) ? raw : [];
  return defaultRoster().map((base) => {
    const found = incoming.find((h) => h && typeof h === "object" && (h as PersistedHero).id === base.id) as
      | Partial<PersistedHero>
      | undefined;
    if (!found) return base;
    const keepsake = typeof found.keepsakeId === "string" && RELICS[found.keepsakeId] ? found.keepsakeId : null;
    const unlocked = CLASSES[base.id]?.unlock ? Boolean(found.unlocked) : true;
    return {
      ...base,
      level: clampLevel(found.level),
      xp: typeof found.xp === "number" && found.xp > 0 ? Math.floor(found.xp) : 0,
      keepsakeId: keepsake,
      unlocked,
      name: base.name,
    };
  });
}

function normalizeRun(raw: unknown): Run | null {
  if (!raw || typeof raw !== "object") return null;
  const run = raw as Run;
  if (!Array.isArray(run.party) || run.party.length === 0 || typeof run.phase !== "string") return null;
  run.clock = typeof run.clock === "number" ? run.clock : 0;
  run.cacheTaken = Boolean(run.cacheTaken);
  run.gold = typeof run.gold === "number" && Number.isFinite(run.gold) ? Math.max(0, Math.floor(run.gold)) : 0;
  if (!Array.isArray(run.shop)) run.shop = [];
  run.shopRested = run.shopRested === true;
  if (run.afterEquip !== "shop") run.afterEquip = null;
  if (!run.equipped) run.equipped = {};
  if (!Array.isArray(run.locker)) run.locker = [];
  if (!Array.isArray(run.log)) run.log = [];
  if (!Array.isArray(run.minions)) run.minions = [];
  for (const hero of run.party) {
    const maxMana = CLASSES[hero.classId]?.mana ?? 0;
    if (typeof hero.maxMana !== "number") hero.maxMana = maxMana;
    if (typeof hero.mana !== "number" || !Number.isFinite(hero.mana)) hero.mana = hero.maxMana;
    hero.mana = Math.max(0, Math.min(hero.maxMana, Math.floor(hero.mana)));
    hero.freeSpell = hero.freeSpell === true;
    hero.freeSpellUsed = hero.freeSpellUsed === true;
    if (typeof hero.stored !== "number" || !Number.isFinite(hero.stored)) hero.stored = 0;
    hero.stored = Math.max(0, Math.min(99, Math.floor(hero.stored)));
    hero.lowHpHealUsed = hero.lowHpHealUsed === true;
  }
  if (Array.isArray(run.enemies)) {
    for (const enemy of run.enemies) hardenEnemy(enemy);
  }
  return run;
}

function hardenEnemy(enemy: EnemyState) {
  const def = MONSTERS[enemy.defId];
  if (typeof enemy.baseAtk !== "number") {
    enemy.baseAtk = enemy.raging ? Math.max(1, enemy.atk - (enemy.rageBonus || 0)) : enemy.atk;
  }
  if (typeof enemy.form !== "number" || enemy.form < 1) enemy.form = 1;
  if (typeof enemy.forms !== "number") enemy.forms = enemy.boss ? (def?.phases ?? 1) : 1;
  if (typeof enemy.formName !== "string") enemy.formName = "";
  if (typeof enemy.alwaysCleave !== "boolean") enemy.alwaysCleave = false;
  if (typeof enemy.alwaysDouble !== "boolean") enemy.alwaysDouble = false;
  if (typeof enemy.bleed !== "number" || !Number.isFinite(enemy.bleed)) enemy.bleed = 0;
  enemy.bleed = Math.max(0, Math.floor(enemy.bleed));
  if (typeof enemy.bleedTicked !== "boolean") enemy.bleedTicked = false;
  enemy.staggered = enemy.staggered === true;
  enemy.formLock = false;
  const known = def?.intent;
  enemy.intent = enemy.intent === "amount" || enemy.intent === "hidden" || enemy.intent === "hunt" || enemy.intent === "full"
    ? enemy.intent
    : known ?? "full";
  if (enemy.intentTargetId !== null && typeof enemy.intentTargetId !== "string") enemy.intentTargetId = null;
}

function normalizeResults(raw: unknown): Results | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Results;
  if (typeof r.victory !== "boolean" || !Array.isArray(r.rows)) return null;
  return {
    victory: r.victory,
    rows: r.rows,
    unlocked: Array.isArray(r.unlocked) ? r.unlocked.filter((id) => typeof id === "string") : [],
    bound: Boolean(r.bound),
    choice: r.choice && typeof r.choice.heroId === "string" && typeof r.choice.relicId === "string" ? r.choice : null,
  };
}

export function normalizeSave(raw: unknown): SaveBlob {
  const base = emptySave();
  if (!raw || typeof raw !== "object") return base;
  const s = raw as Partial<SaveBlob>;
  const roster = normalizeRoster(s.roster);
  const unlocked = new Set(roster.filter((h) => h.unlocked).map((h) => h.id));
  const partyIds = Array.isArray(s.partyIds)
    ? s.partyIds.filter((id): id is string => typeof id === "string" && unlocked.has(id)).slice(0, 4)
    : base.partyIds;
  const statsIn = s.stats && typeof s.stats === "object" ? s.stats : base.stats;
  const settings: Settings = {
    mute: Boolean(s.settings && typeof s.settings === "object" && s.settings.mute),
  };
  return {
    version: 1,
    roster,
    stats: {
      runs: num(statsIn.runs),
      wins: num(statsIn.wins),
      bosses: num(statsIn.bosses),
      lowHpBoss: Boolean(statsIn.lowHpBoss),
      fullPartyWin: Boolean(statsIn.fullPartyWin),
      doors: strings(statsIn.doors),
      slain: strings(statsIn.slain),
    },
    settings,
    partyIds: partyIds.length ? partyIds : roster.some((h) => h.id === "knight" && h.unlocked) ? ["knight"] : [],
    locker: [],
    loadout: {},
    run: normalizeRun(s.run),
    results: normalizeResults(s.results),
  };
}

function num(n: unknown): number {
  return typeof n === "number" && Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

function strings(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((id): id is string => typeof id === "string");
}

export function loadSave(): SaveBlob {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptySave();
    return normalizeSave(JSON.parse(raw) as unknown);
  } catch {
    return emptySave();
  }
}

export function writeSave(blob: SaveBlob) {
  try {
    const prev = localStorage.getItem(KEY);
    if (prev) localStorage.setItem(`${KEY}-bak`, prev);
    localStorage.setItem(KEY, JSON.stringify({ ...blob, version: 1 }));
  } catch {
    /* private mode or quota — the session still plays */
  }
}
