export type IntentMode = "full" | "amount" | "hidden" | "hunt";

export type Rarity = "common" | "rare" | "mythic";

export type DoorKind =
  | "quiet"
  | "vault"
  | "ambush"
  | "nest"
  | "supplies"
  | "shop"
  | "font"
  | "curse"
  | "campfire"
  | "miniboss"
  | "final";

export type Risk = "Low" | "Measured" | "High" | "Deadly";

export type TargetKind = "enemy" | "ally" | "any-hero" | "none";

export type CardKind = "attack" | "guard" | "skill";

export type IconName =
  | "shield"
  | "music"
  | "sun"
  | "leaf"
  | "feather"
  | "flame"
  | "heart"
  | "storm"
  | "sword"
  | "skull"
  | "door"
  | "pack"
  | "gem"
  | "crown"
  | "droplet"
  | "spark";

export type Effect =
  | { op: "hit"; bonus: number; all?: boolean; hits?: number; smite?: boolean; openingBonus?: number }
  | { op: "flat"; amount: number; all?: boolean }
  | { op: "block"; amount: number; all?: boolean }
  | { op: "heal"; amount: number; all?: boolean; self?: boolean }
  | { op: "atk"; amount: number; all?: boolean }
  | { op: "def"; amount: number; all?: boolean }
  | { op: "weaken"; amount: number }
  | { op: "poison"; amount: number }
  | { op: "taunt" }
  | { op: "skip" }
  | { op: "exhaust"; base: number; each: number }
  | { op: "wound"; amount: number }
  | { op: "cleanse" }
  | { op: "revive"; amount: number }
  | { op: "extra" }
  | { op: "mana"; amount: number }
  | { op: "free-spell" }
  | { op: "grudge" }
  | { op: "summon"; name: string; hp: number; atk: number }
  | { op: "minion-strike" };

export interface CardDef {
  id: string;
  name: string;
  kind: CardKind;
  target: TargetKind;
  text: string;
  effects: Effect[];
  /** Mana spent when the card is played. Casters only. */
  mana?: number;
}

export interface SupplyDef {
  id: string;
  name: string;
  target: TargetKind;
  text: string;
  effects: Effect[];
}

export interface RelicDef {
  id: string;
  name: string;
  rarity: Rarity;
  text: string;
  atk?: number;
  def?: number;
  hp?: number;
  startBlock?: number;
  lifesteal?: number;
  thorns?: number;
  splash?: number;
  deathWard?: boolean;
  poisonOnHit?: number;
  /** Mana gained each time an attack deals damage. */
  manaOnHit?: number;
  /** Mana gained each time this hero gains Block. Once per gain, not per point. */
  manaOnBlock?: number;
  /** Bleed applied each time an attack deals damage. */
  bleedOnHit?: number;
  /** Damage weathered is stored up to this cap. */
  storeCap?: number;
  /** Heal granted when a full grudge plate is released. */
  grudgeHeal?: number;
  /** Heal each wearer after a fight, up to maximum health. */
  postFightHeal?: number;
  /** Added to single-target heals this hero casts on someone else. */
  healBonus?: number;
  /** Heal the first time this hero drops below half health in a fight. */
  lowHpHeal?: number;
  /** Extra cards drawn each turn. */
  handSize?: number;
  /** If set, only these classes can wear it. */
  classes?: string[];
  /** Cards added to the wearer's deck while this is equipped. */
  grantCards?: string[];
}

export interface MonsterDef {
  id: string;
  name: string;
  blurb: string;
  hp: number;
  atk: number;
  armor: number;
  xp: number;
  tier: "weak" | "standard" | "elite" | "boss" | "final";
  poisonOnHit?: number;
  pierce?: number;
  enrageAtHalf?: number;
  rageAt?: number;
  rageBonus?: number;
  rageCleave?: boolean;
  rageDouble?: boolean;
  /** How much of the chosen target is shown. Omitted means "full". */
  intent?: IntentMode;
  /** Total forms. Seal bosses use 3; the King uses 2. Omitted means 1. */
  phases?: number;
  shifts?: PhaseShift[];
}

/** Applied when a boss hits 0 health and still has a form left. */
export interface PhaseShift {
  form: string;
  line: string;
  hp: number;
  atk: number;
  armor: number;
  pierce?: number;
  poisonOnHit?: number;
  rageCleave?: boolean;
  rageDouble?: boolean;
  rageBonus?: number;
  alwaysCleave?: boolean;
  alwaysDouble?: boolean;
}

export type UnlockKey = "door-ambush" | "door-curse" | "door-font" | "boss-warden" | "boss-king";

export interface ClassDef {
  id: string;
  name: string;
  role: string;
  blurb: string;
  excel: string;
  icon: IconName;
  heroName: string;
  baseHp: number;
  hpPerLevel: number;
  baseAtk: number;
  baseDef: number;
  deck: string[];
  milestones: { level: number; cardId: string }[];
  /** Maximum mana. Omitted or 0 means this class has no mana bar. */
  mana?: number;
  unlock: null | { key: UnlockKey; label: string };
}

export interface PersistedHero {
  id: string;
  name: string;
  classId: string;
  level: number;
  xp: number;
  keepsakeId: string | null;
  unlocked: boolean;
}

export interface HeroState {
  id: string;
  name: string;
  classId: string;
  seat: number;
  level: number;
  xp: number;
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  keepsakeId: string | null;
  block: number;
  atkBuff: number;
  defBuff: number;
  poison: number;
  down: boolean;
  braced: boolean;
  extraPlay: boolean;
  deathWardUsed: boolean;
  poisonTicked: boolean;
  deck: string[];
  discard: string[];
  exhaust: string[];
  mana: number;
  maxMana: number;
  /** The next mana card costs nothing. */
  freeSpell: boolean;
  /** The room's free spell has already been spent. */
  freeSpellUsed: boolean;
  /** Damage weathered while wearing a grudge plate. */
  stored: number;
  /** The bloodwell has already answered this fight. */
  lowHpHealUsed: boolean;
}

export interface EnemyState {
  uid: string;
  defId: string;
  name: string;
  blurb: string;
  hp: number;
  maxHp: number;
  atk: number;
  armor: number;
  xp: number;
  tier: MonsterDef["tier"];
  poison: number;
  bleed: number;
  weaken: number;
  skip: boolean;
  raging: boolean;
  halfEnraged: boolean;
  poisonTicked: boolean;
  bleedTicked: boolean;
  poisonOnHit: number;
  pierce: number;
  enrageAtHalf: number;
  rageAt: number;
  rageBonus: number;
  rageCleave: boolean;
  rageDouble: boolean;
  /** Current form, starting at 1. */
  form: number;
  forms: number;
  formName: string;
  /** Attack before the current rage bonus. */
  baseAtk: number;
  alwaysCleave: boolean;
  alwaysDouble: boolean;
  boss: boolean;
  final: boolean;
  /** Lost its next strike because it just changed form. */
  staggered: boolean;
  /** Already changed form during the current action. */
  formLock: boolean;
  /** How the telegraph is shown. */
  intent: IntentMode;
  /** Hero id this foe will strike, "all", or null when it will not strike. */
  intentTargetId: string | null;
}

export interface DoorState {
  uid: string;
  kind: DoorKind;
  title: string;
  hint: string;
  risk: Risk;
  lootLabel: string;
  foes: string;
  odds: { common: number; rare: number; mythic: number } | null;
  bossId?: string;
}

export interface MinionState {
  uid: string;
  ownerId: string;
  name: string;
  hp: number;
  maxHp: number;
  atk: number;
}

export interface HandCard {
  uid: string;
  cardId: string;
}

export interface SupplyInst {
  uid: string;
  defId: string;
}

export interface OfferCard {
  uid: string;
  defId: string;
}

export interface ShopEntry {
  uid: string;
  kind: "supply" | "relic";
  defId: string;
  price: number;
}

export type Phase =
  | "doors"
  | "prep"
  | "battle"
  | "enemy"
  | "treasure"
  | "equip"
  | "supply"
  | "shop"
  | "campfire"
  | "curse"
  | "onward";

export type EnemyBeat = "bleed" | "poison" | "strikes" | "hero-poison" | "cleanup";

export interface Run {
  rng: number;
  depth: number;
  seals: number;
  phase: Phase;
  beat: EnemyBeat;
  strikeIndex: number;
  strikeHitsLeft: number;
  doors: DoorState[];
  activeDoor: DoorState | null;
  intro: string;
  party: HeroState[];
  enemies: EnemyState[];
  minions: MinionState[];
  hand: HandCard[];
  actorIndex: number;
  playsLeft: number;
  round: number;
  tauntHeroId: string | null;
  prepSupplyUsed: boolean;
  supplies: SupplyInst[];
  gold: number;
  shop: ShopEntry[];
  /** The stall's 30-gold rest has already been used this visit. */
  shopRested: boolean;
  /** After equipping a bought relic, return here instead of moving on. */
  afterEquip: "shop" | null;
  supplyDeck: string[];
  supplyDiscard: string[];
  weakDeck: string[];
  weakDiscard: string[];
  standardDeck: string[];
  standardDiscard: string[];
  eliteDeck: string[];
  eliteDiscard: string[];
  treasures: { common: string[]; rare: string[]; mythic: string[] };
  treasureDiscard: { common: string[]; rare: string[]; mythic: string[] };
  bossOrder: string[];
  equipped: Record<string, string[]>;
  /** Relics not currently worn. Can be given to another hero. */
  locker: string[];
  offer: OfferCard[];
  pendingRelic: string | null;
  log: string[];
  xpGained: Record<string, number>;
  levelStart: Record<string, number>;
  lowHpBossKill: boolean;
  finalSlain: boolean;
  bossesSlain: string[];
  uid: number;
  clock: number;
  cacheTaken: boolean;
  clearedNote: string;
}

export interface Stats {
  runs: number;
  wins: number;
  bosses: number;
  lowHpBoss: boolean;
  fullPartyWin: boolean;
  /** Door kinds the guild has finished. */
  doors: string[];
  /** Boss ids whose final form has fallen. */
  slain: string[];
}

export interface Settings {
  mute: boolean;
}

export interface ResultRow {
  id: string;
  name: string;
  classId: string;
  xp: number;
  from: number;
  to: number;
  relics: string[];
}

export interface Results {
  victory: boolean;
  rows: ResultRow[];
  unlocked: string[];
  bound: boolean;
  choice: { heroId: string; relicId: string } | null;
}

export interface SaveBlob {
  version: number;
  roster: PersistedHero[];
  stats: Stats;
  settings: Settings;
  partyIds: string[];
  /** Relics waiting in the gear locker, not worn by anyone. */
  locker: string[];
  /** Relics each hero will bring into the next delve, besides a keepsake. */
  loadout: Record<string, string[]>;
  run: Run | null;
  results: Results | null;
}

export type FloaterKind = "dmg" | "heal" | "block" | "miss" | "buff";

export interface Floater {
  id: number;
  key: string;
  text: string;
  kind: FloaterKind;
}

export type Sfx =
  | "hit"
  | "heal"
  | "block"
  | "card"
  | "door"
  | "rage"
  | "win"
  | "lose"
  | "unlock"
  | "ui"
  | "poison";

export interface GameEvent {
  sfx?: Sfx;
  floater?: { key: string; text: string; kind: FloaterKind };
  shake?: boolean;
  banner?: string;
  bossDead?: { id: string; lowHp: boolean; final: boolean };
  /** A door the party finished. Used for hero unlocks. */
  doorDone?: DoorKind;
}

export interface StepResult {
  run: Run;
  events: GameEvent[];
  outcome?: "victory" | "defeat";
}
