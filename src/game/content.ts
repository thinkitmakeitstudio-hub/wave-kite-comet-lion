import type {
  CardDef,
  ClassDef,
  DoorKind,
  Effect,
  MonsterDef,
  PersistedHero,
  RelicDef,
  Risk,
  Rarity,
  SupplyDef,
  TargetKind,
  CardKind,
} from "./types";

function card(
  id: string,
  name: string,
  kind: CardKind,
  target: TargetKind,
  text: string,
  effects: Effect[],
  mana?: number,
): CardDef {
  return { id, name, kind, target, text, effects, ...(mana ? { mana } : {}) };
}

export const CARDS: Record<string, CardDef> = {};

function add(c: CardDef): CardDef {
  CARDS[c.id] = c;
  return c;
}

add(card("basic-strike", "Desperate Swing", "attack", "enemy", "Deal your Attack.", [{ op: "hit", bonus: 0 }]));

add(card("k-strike", "Heavy Strike", "attack", "enemy", "Deal your Attack + 2.", [{ op: "hit", bonus: 2 }]));
add(card("k-guard", "Tower Guard", "guard", "none", "Gain 8 Block.", [{ op: "block", amount: 8 }]));
add(card("k-bash", "Shield Bash", "attack", "enemy", "Deal your Attack. Gain 5 Block.", [
  { op: "hit", bonus: 0 },
  { op: "block", amount: 5 },
]));
add(card("k-cleave", "Cleave", "attack", "none", "Deal your Attack − 1 to every foe.", [{ op: "hit", bonus: -1, all: true }]));
add(card("k-taunt", "Challenge", "guard", "none", "Foes strike you this round. Gain 6 Block.", [
  { op: "taunt" },
  { op: "block", amount: 6 },
]));
add(card("k-rally", "Rally", "guard", "none", "Every hero gains 4 Block.", [{ op: "block", amount: 4, all: true }]));
add(card("k-bulwark", "Bulwark", "guard", "none", "Gain 12 Block.", [{ op: "block", amount: 12 }]));
add(card("k-earthsplit", "Earthsplit", "attack", "none", "Deal your Attack + 3 to every foe.", [{ op: "hit", bonus: 3, all: true }]));
add(card("k-kingwall", "Kingwall", "guard", "none", "Every hero gains 8 Block.", [{ op: "block", amount: 8, all: true }]));

add(card("b-bolt", "Arc Bolt", "attack", "enemy", "Deal your Attack + 3.", [{ op: "hit", bonus: 3 }]));
add(card("b-well", "Well Bolt", "attack", "enemy", "Spend 2 mana. Deal your Attack + 8.", [{ op: "hit", bonus: 8 }], 2));
add(card("b-inspire", "Inspire", "skill", "ally", "An ally gains +2 Attack for this battle.", [{ op: "atk", amount: 2 }]));
add(card("b-discord", "Discord", "skill", "enemy", "A foe loses 3 Attack for this battle.", [{ op: "weaken", amount: 3 }]));
add(card("b-encore", "Encore", "attack", "enemy", "Deal your Attack. You heal 4.", [
  { op: "hit", bonus: 0 },
  { op: "heal", amount: 4, self: true },
]));
add(card("b-verse", "Verse", "skill", "none", "Every hero heals 3.", [{ op: "heal", amount: 3, all: true }]));
add(card("b-highnote", "High Note", "attack", "enemy", "Deal your Attack + 6.", [{ op: "hit", bonus: 6 }]));
add(card("b-chorus", "Chorus", "skill", "none", "Every hero gains +2 Attack for this battle.", [{ op: "atk", amount: 2, all: true }]));
add(card("b-finale", "Finale", "attack", "none", "Deal your Attack + 3 to every foe. Every hero heals 4.", [
  { op: "hit", bonus: 3, all: true },
  { op: "heal", amount: 4, all: true },
]));

add(card("p-smite", "Smite", "attack", "enemy", "Deal your Attack + 2. If the foe is below half health, deal 4 more.", [
  { op: "hit", bonus: 2, smite: true },
]));
add(card("p-hands", "Lay on Hands", "skill", "ally", "Heal an ally for 8.", [{ op: "heal", amount: 8 }]));
add(card("p-ward", "Holy Ward", "guard", "ally", "An ally gains 7 Block.", [{ op: "block", amount: 7 }]));
add(card("p-judgment", "Judgment", "attack", "enemy", "Deal your Attack + 1. You heal 3.", [
  { op: "hit", bonus: 1 },
  { op: "heal", amount: 3, self: true },
]));
add(card("p-aura", "Aura", "skill", "none", "Every hero gains 3 Block and heals 2.", [
  { op: "block", amount: 3, all: true },
  { op: "heal", amount: 2, all: true },
]));
add(card("p-mend", "Greater Mend", "skill", "ally", "Heal an ally for 12.", [{ op: "heal", amount: 12 }]));
add(card("p-radiant", "Radiant Smite", "attack", "enemy", "Deal your Attack + 5. If the foe is below half health, deal 4 more.", [
  { op: "hit", bonus: 5, smite: true },
]));
add(card("p-sanctuary", "Sanctuary", "guard", "none", "Every hero gains 8 Block.", [{ op: "block", amount: 8, all: true }]));

add(card("d-thorn", "Thorn Lash", "attack", "enemy", "Deal your Attack + 1. Apply 2 Poison.", [
  { op: "hit", bonus: 1 },
  { op: "poison", amount: 2 },
]));
add(card("d-well", "Ley Thorn", "attack", "enemy", "Spend 2 mana. Deal your Attack + 3. Apply 5 Poison.", [
  { op: "hit", bonus: 3 },
  { op: "poison", amount: 5 },
], 2));
add(card("d-bark", "Barkskin", "guard", "none", "Gain 7 Block and +1 Defense for this battle.", [
  { op: "block", amount: 7 },
  { op: "def", amount: 1 },
]));
add(card("d-shed", "Shedding", "guard", "none", "Exhaust your other cards. Gain 6 Block, plus 4 for each card exhausted.", [
  { op: "exhaust", base: 6, each: 4 },
]));
add(card("d-regrowth", "Regrowth", "skill", "none", "Heal 5. Gain 3 Block.", [
  { op: "heal", amount: 5, self: true },
  { op: "block", amount: 3 },
]));
add(card("d-entangle", "Entangle", "skill", "enemy", "A foe skips its next action and loses 2 Attack.", [
  { op: "skip" },
  { op: "weaken", amount: 2 },
]));
add(card("d-briar", "Briar", "attack", "enemy", "Deal your Attack + 2. Apply 4 Poison.", [
  { op: "hit", bonus: 2 },
  { op: "poison", amount: 4 },
]));
add(card("d-deeproot", "Deep Root", "skill", "none", "Every hero heals 4 and gains +1 Defense for this battle.", [
  { op: "heal", amount: 4, all: true },
  { op: "def", amount: 1, all: true },
]));
add(card("d-ancient", "Ancient Shedding", "guard", "none", "Exhaust your other cards. Gain 10 Block, plus 6 for each card exhausted.", [
  { op: "exhaust", base: 10, each: 6 },
]));

add(card("r-shiv", "Shiv", "attack", "enemy", "Deal your Attack + 3.", [{ op: "hit", bonus: 3 }]));
add(card("r-backstab", "Backstab", "attack", "enemy", "Deal your Attack + 2. If the foe is above 80% health, deal 5 more.", [
  { op: "hit", bonus: 2, openingBonus: 5 },
]));
add(card("r-fade", "Fade", "guard", "none", "Gain 9 Block.", [{ op: "block", amount: 9 }]));
add(card("r-venom", "Venom Blade", "attack", "enemy", "Deal your Attack. Apply 4 Poison.", [
  { op: "hit", bonus: 0 },
  { op: "poison", amount: 4 },
]));
add(card("r-flurry", "Flurry", "attack", "enemy", "Deal your Attack twice.", [{ op: "hit", bonus: 0, hits: 2 }]));
add(card("r-garrote", "Garrote", "attack", "enemy", "Deal your Attack + 2. The foe loses 4 Attack.", [
  { op: "hit", bonus: 2 },
  { op: "weaken", amount: 4 },
]));
add(card("r-shadowstep", "Shadowstep", "attack", "enemy", "Deal your Attack + 4. Gain 4 Block.", [
  { op: "hit", bonus: 4 },
  { op: "block", amount: 4 },
]));
add(card("r-killstroke", "Killstroke", "attack", "enemy", "Deal your Attack twice, +3 each time.", [{ op: "hit", bonus: 3, hits: 2 }]));

add(card("w-cinder", "Cinderbolt", "attack", "enemy", "Deal your Attack + 4.", [{ op: "hit", bonus: 4 }]));
add(card("w-well", "Mana Pyre", "attack", "enemy", "Spend 3 mana. Deal your Attack + 12.", [{ op: "hit", bonus: 12 }], 3));
add(card("w-hex", "Hex", "skill", "enemy", "A foe loses 3 Attack and gains 2 Poison.", [
  { op: "weaken", amount: 3 },
  { op: "poison", amount: 2 },
]));
add(card("w-pact", "Blood Pact", "attack", "enemy", "Lose 3 health. You cannot fall below 1. Deal your Attack + 8.", [
  { op: "wound", amount: 3 },
  { op: "hit", bonus: 8 },
]));
add(card("w-ash", "Ash Shield", "guard", "none", "Gain 8 Block.", [{ op: "block", amount: 8 }]));
add(card("w-wildfire", "Wildfire", "attack", "none", "Deal your Attack + 2 to every foe.", [{ op: "hit", bonus: 2, all: true }]));
add(card("w-immolate", "Immolate", "attack", "enemy", "Lose 2 health. You cannot fall below 1. Deal your Attack + 10.", [
  { op: "wound", amount: 2 },
  { op: "hit", bonus: 10 },
]));
add(card("w-curse", "Cinder Curse", "skill", "enemy", "Apply 5 Poison. The foe loses 2 Attack.", [
  { op: "poison", amount: 5 },
  { op: "weaken", amount: 2 },
]));
add(card("w-cataclysm", "Cataclysm", "attack", "none", "Deal your Attack + 6 to every foe.", [{ op: "hit", bonus: 6, all: true }]));

add(card("c-mend", "Mend", "skill", "ally", "Heal an ally for 7.", [{ op: "heal", amount: 7 }]));
add(card("c-smite", "Grave Smite", "attack", "enemy", "Deal your Attack + 3.", [{ op: "hit", bonus: 3 }]));
add(card("c-sanctuary", "Hallowed Ground", "guard", "none", "Every hero gains 6 Block.", [{ op: "block", amount: 6, all: true }]));
add(card("c-purify", "Purify", "skill", "ally", "Clear an ally's Poison and heal 5.", [
  { op: "cleanse" },
  { op: "heal", amount: 5 },
]));
add(card("c-requiem", "Requiem", "attack", "enemy", "Deal your Attack + 2. Every hero heals 3.", [
  { op: "hit", bonus: 2 },
  { op: "heal", amount: 3, all: true },
]));
add(card("c-miracle", "Miracle", "skill", "ally", "Heal an ally for 14.", [{ op: "heal", amount: 14 }]));
add(card("c-litany", "Litany", "skill", "none", "Every hero heals 6 and gains 4 Block.", [
  { op: "heal", amount: 6, all: true },
  { op: "block", amount: 4, all: true },
]));
add(card("c-ascension", "Ascension", "skill", "none", "Every hero heals 8 and gains +2 Attack for this battle.", [
  { op: "heal", amount: 8, all: true },
  { op: "atk", amount: 2, all: true },
]));

add(card("s-lance", "Storm Lance", "attack", "enemy", "Deal your Attack + 3.", [{ op: "hit", bonus: 3 }]));
add(card("s-howl", "Bulwark Howl", "guard", "none", "Every hero gains 4 Block and +1 Defense for this battle.", [
  { op: "block", amount: 4, all: true },
  { op: "def", amount: 1, all: true },
]));
add(card("s-charge", "Beast Charge", "attack", "enemy", "Deal your Attack + 5.", [{ op: "hit", bonus: 5 }]));
add(card("s-gale", "Gale", "skill", "enemy", "A foe loses 4 Attack for this battle.", [{ op: "weaken", amount: 4 }]));
add(card("s-thunder", "Thunder", "attack", "none", "Deal your Attack + 1 to every foe.", [{ op: "hit", bonus: 1, all: true }]));
add(card("s-tempest", "Tempest", "attack", "none", "Deal your Attack + 4 to every foe.", [{ op: "hit", bonus: 4, all: true }]));
add(card("s-bastion", "Living Bastion", "guard", "none", "Gain 14 Block. Every other hero gains 4 Block.", [
  { op: "block", amount: 10 },
  { op: "block", amount: 4, all: true },
]));
add(card("s-eye", "Eye of the Gale", "attack", "enemy", "Deal your Attack + 4. The foe loses 3 Attack.", [
  { op: "hit", bonus: 4 },
  { op: "weaken", amount: 3 },
]));

add(card("k-crest", "Holt's Oath", "attack", "enemy", "The crest answers. Deal your Attack + 4 and gain 6 Block.", [
  { op: "hit", bonus: 4 },
  { op: "block", amount: 6 },
]));
add(card("b-staff", "Staff Crescendo", "attack", "enemy", "The staff sings. Deal your Attack + 7.", [{ op: "hit", bonus: 7 }]));
add(card("p-halo", "Halo Smite", "attack", "enemy", "The halo strikes. Deal your Attack + 5. Below half health, deal 4 more.", [
  { op: "hit", bonus: 5, smite: true },
]));
add(card("d-staff", "Staffroot", "attack", "enemy", "The grove staff bites. Deal your Attack + 3. Apply 4 Poison.", [
  { op: "hit", bonus: 3 },
  { op: "poison", amount: 4 },
]));
add(card("r-knives", "Veil Flurry", "attack", "enemy", "The knives answer. Deal your Attack twice, +2 each time.", [
  { op: "hit", bonus: 2, hits: 2 },
]));
add(card("w-focus", "Focused Pyre", "attack", "enemy", "The focus tightens. Deal your Attack + 9.", [{ op: "hit", bonus: 9 }]));
add(card("c-bell", "Bell Mend", "skill", "ally", "The bell rings. Heal an ally for 14.", [{ op: "heal", amount: 14 }]));
add(card("s-totem", "Totem Gale", "guard", "none", "The totem answers. Every hero gains 8 Block.", [{ op: "block", amount: 8, all: true }]));
add(card("n-lash", "Grave Lash", "attack", "enemy", "Deal your Attack + 2.", [{ op: "hit", bonus: 2 }]));
add(card("n-raise", "Raise Bones", "skill", "none", "Spend 2 mana. Raise a Bone Thrall. Two may stand with you.", [
  { op: "summon", name: "Bone Thrall", hp: 10, atk: 5 },
], 2));
add(card("n-command", "Death March", "skill", "none", "Spend 1 mana. Each of your thralls strikes.", [{ op: "minion-strike" }], 1));
add(card("n-guard", "Ossuary", "guard", "none", "Gain 7 Block.", [{ op: "block", amount: 7 }]));
add(card("n-drain", "Siphon", "attack", "enemy", "Deal your Attack. Heal 4.", [
  { op: "hit", bonus: 0 },
  { op: "heal", amount: 4, self: true },
]));
add(card("n-legion", "Twin Raising", "skill", "none", "Spend 3 mana. Raise two Bone Thralls.", [
  { op: "summon", name: "Bone Thrall", hp: 10, atk: 5 },
  { op: "summon", name: "Bone Thrall", hp: 10, atk: 5 },
], 3));
add(card("n-grave", "Grave Wind", "attack", "none", "Spend 2 mana. Deal your Attack + 2 to every foe.", [
  { op: "hit", bonus: 2, all: true },
], 2));
add(card("n-king", "Raise the King", "skill", "none", "Spend 3 mana. Raise a Grave King. It strikes harder and lasts longer.", [
  { op: "summon", name: "Grave King", hp: 18, atk: 8 },
], 3));
add(card("n-scepter", "Scepter Call", "skill", "none", "The scepter calls. Raise a Bone Thrall.", [
  { op: "summon", name: "Bone Thrall", hp: 12, atk: 6 },
]));
add(card("nph-palm", "Open Palm", "attack", "enemy", "Deal your Attack + 2.", [{ op: "hit", bonus: 2 }]));
add(card("nph-smite", "Godsmite", "attack", "enemy", "Deal your Attack + 4. Below half health, deal 4 more.", [
  { op: "hit", bonus: 4, smite: true },
]));
add(card("nph-aegis", "Godshell", "guard", "none", "Gain 10 Block.", [{ op: "block", amount: 10 }]));
add(card("nph-wrath", "Petty Wrath", "attack", "none", "Deal your Attack to every foe.", [{ op: "hit", bonus: 0, all: true }]));
add(card("nph-mercy", "Mercy", "skill", "ally", "Heal an ally for 10.", [{ op: "heal", amount: 10 }]));
add(card("nph-bolt", "Heaven's Bolt", "attack", "enemy", "Spend 2 mana. Deal your Attack + 9.", [{ op: "hit", bonus: 9 }], 2));
add(card("nph-host", "The Host", "skill", "none", "Every hero gains 5 Block and +1 Attack for this battle.", [
  { op: "block", amount: 5, all: true },
  { op: "atk", amount: 1, all: true },
]));
add(card("nph-judgment", "Judgment", "attack", "none", "Spend 2 mana. Deal your Attack + 4 to every foe.", [
  { op: "hit", bonus: 4, all: true },
], 2));
add(card("nph-apocalypse", "Apocalypse", "attack", "none", "Spend 3 mana. Deal your Attack + 8 to every foe. Every hero heals 6.", [
  { op: "hit", bonus: 8, all: true },
  { op: "heal", amount: 6, all: true },
], 3));
add(card("nph-hand", "Hand of God", "attack", "enemy", "The godhand closes. Deal your Attack + 8 and heal 6.", [
  { op: "hit", bonus: 8 },
  { op: "heal", amount: 6, self: true },
]));
add(card(
  "cov-word",
  "Unpriced Word",
  "skill",
  "none",
  "Once this room, your next spell costs no mana.",
  [{ op: "free-spell" }],
));
add(card(
  "grd-blow",
  "Grudge Blow",
  "attack",
  "enemy",
  "The plate must hold 12. Deal that damage, ignoring armor, heal 8, and empty it.",
  [{ op: "grudge" }],
));

export const SUPPLIES: Record<string, SupplyDef> = {};

function supply(id: string, name: string, target: TargetKind, text: string, effects: Effect[], copies: number): string[] {
  SUPPLIES[id] = { id, name, target, text, effects };
  return Array.from({ length: copies }, () => id);
}

export const SUPPLY_DECK: string[] = [
  ...supply("sup-salve", "Healing Salve", "ally", "Heal an ally for 8.", [{ op: "heal", amount: 8 }], 3),
  ...supply("sup-rations", "Iron Rations", "none", "Every hero heals 4.", [{ op: "heal", amount: 4, all: true }], 2),
  ...supply("sup-oil", "Whetstone Oil", "ally", "An ally gains +3 Attack for this battle.", [{ op: "atk", amount: 3 }], 2),
  ...supply("sup-smoke", "Smoke Vial", "enemy", "A foe skips its next action.", [{ op: "skip" }], 2),
  ...supply("sup-shields", "Tower Kit", "none", "Every hero gains 6 Block.", [{ op: "block", amount: 6, all: true }], 2),
  ...supply("sup-phoenix", "Phoenix Mote", "any-hero", "An ally heals 6. A downed ally returns with 6 health.", [{ op: "revive", amount: 6 }], 1),
  ...supply("sup-focus", "Focusing Draught", "ally", "That hero plays two cards on their next turn this round.", [{ op: "extra" }], 1),
  ...supply("sup-anti", "Antitoxin", "ally", "Clear Poison and heal 4.", [{ op: "cleanse" }, { op: "heal", amount: 4 }], 2),
  ...supply("sup-knives", "Throwing Knives", "enemy", "Deal 6 damage.", [{ op: "flat", amount: 6 }], 2),
  ...supply("sup-horn", "Guard Horn", "ally", "An ally gains +2 Defense for this battle.", [{ op: "def", amount: 2 }], 2),
  ...supply("sup-mana", "Mana Phial", "ally", "Restore 4 mana to a spellcaster.", [{ op: "mana", amount: 4 }], 2),
  ...supply("sup-revive", "Revive Phial", "any-hero", "A downed ally stands with 12 health. A standing ally heals 12.", [{ op: "revive", amount: 12 }], 2),
  ...supply("sup-stew", "Hearth Stew", "none", "Every hero heals 7.", [{ op: "heal", amount: 7, all: true }], 2),
  ...supply("sup-bandage", "Linen Bandage", "ally", "Heal an ally for 5. In a fight they also gain 4 Block.", [{ op: "heal", amount: 5 }, { op: "block", amount: 4 }], 3),
];

export const SUPPLY_COST: Record<string, number> = {
  "sup-salve": 12,
  "sup-rations": 14,
  "sup-oil": 16,
  "sup-smoke": 18,
  "sup-shields": 16,
  "sup-phoenix": 36,
  "sup-focus": 28,
  "sup-anti": 18,
  "sup-knives": 14,
  "sup-horn": 16,
  "sup-mana": 22,
  "sup-revive": 34,
  "sup-stew": 24,
  "sup-bandage": 10,
};

export function relicCost(rarity: Rarity): number {
  if (rarity === "mythic") return 78;
  if (rarity === "rare") return 46;
  return 24;
}

export const RELICS: Record<string, RelicDef> = {};

function relic(def: RelicDef, copies: number): string[] {
  RELICS[def.id] = def;
  return Array.from({ length: copies }, () => def.id);
}

export const TREASURE_DECKS: { common: string[]; rare: string[]; mythic: string[] } = {
  common: [
    ...relic({ id: "rel-band", name: "Iron Band", rarity: "common", text: "+2 Attack.", atk: 2 }, 2),
    ...relic({ id: "rel-wrap", name: "Leather Wrap", rarity: "common", text: "+2 Defense.", def: 2 }, 2),
    ...relic({ id: "rel-cord", name: "Vitality Cord", rarity: "common", text: "+8 maximum health.", hp: 8 }, 2),
    ...relic({ id: "rel-edge", name: "Sharpened Edge", rarity: "common", text: "+1 Attack. +4 maximum health.", atk: 1, hp: 4 }, 2),
    ...relic({ id: "rel-cloak", name: "Scout's Cloak", rarity: "common", text: "+1 Defense. Start each battle with 3 Block.", def: 1, startBlock: 3 }, 2),
    ...relic({ id: "rel-charm", name: "Blood Charm", rarity: "common", text: "Your attacks heal you for 1.", lifesteal: 1 }, 2),
    ...relic({ id: "rel-brooch", name: "Thorn Brooch", rarity: "common", text: "When you gain Block, deal 2 to a random foe.", thorns: 2 }, 2),
    ...relic({ id: "rel-vial", name: "Venom Vial", rarity: "common", text: "Your attacks apply 1 Poison.", poisonOnHit: 1 }, 2),
    ...relic({
      id: "rel-fang",
      name: "Mana Fang",
      rarity: "common",
      text: "When an attack deals damage, gain 3 mana.",
      manaOnHit: 3,
    }, 2),
    ...relic({
      id: "rel-bead",
      name: "Bulwark Bead",
      rarity: "common",
      text: "When you gain Block, gain 3 mana.",
      manaOnBlock: 3,
    }, 2),
    ...relic({ id: "rel-saw", name: "Sawtooth", rarity: "common", text: "Your attacks apply 2 Bleed.", bleedOnHit: 2 }, 2),
    ...relic({ id: "rel-hook", name: "Gut Hook", rarity: "common", text: "+1 Attack. Your attacks apply 1 Bleed.", atk: 1, bleedOnHit: 1 }, 2),
    ...relic({
      id: "rel-thread",
      name: "Mender's Thread",
      rarity: "common",
      text: "After each fight, you heal 5.",
      postFightHeal: 5,
    }, 2),
  ],
  rare: [
    ...relic({ id: "rel-sun", name: "Sunbrand", rarity: "rare", text: "+4 Attack.", atk: 4 }, 2),
    ...relic({ id: "rel-aegis", name: "Aegis Plate", rarity: "rare", text: "+3 Defense. +6 maximum health.", def: 3, hp: 6 }, 2),
    ...relic({ id: "rel-heart", name: "Vampire Pin", rarity: "rare", text: "+2 Attack. Your attacks heal you for 2.", atk: 2, lifesteal: 2 }, 2),
    ...relic({ id: "rel-mail", name: "Thornmail", rarity: "rare", text: "+2 Defense. Gaining Block deals 3 to a random foe.", def: 2, thorns: 3 }, 2),
    ...relic({ id: "rel-splash", name: "Splinter Crown", rarity: "rare", text: "+2 Attack. Attacks also deal 2 to other foes.", atk: 2, splash: 2 }, 2),
    ...relic({ id: "rel-oath", name: "Saint's Oath", rarity: "rare", text: "+8 health, +1 Defense. The first time you would fall, stay at 1 health.", hp: 8, def: 1, deathWard: true }, 1),
    ...relic({
      id: "rel-crest",
      name: "Holt Crest",
      rarity: "rare",
      text: "Knight only. +2 Defense. While worn, Holt's Oath is in the deck.",
      classes: ["knight"],
      def: 2,
      grantCards: ["k-crest"],
    }, 1),
    ...relic({
      id: "rel-staff",
      name: "Chanter's Staff",
      rarity: "rare",
      text: "Mage Bard only. +2 Attack. While worn, Staff Crescendo is in the deck.",
      classes: ["bard"],
      atk: 2,
      grantCards: ["b-staff"],
    }, 1),
    ...relic({
      id: "rel-halo",
      name: "Oath Halo",
      rarity: "rare",
      text: "Paladin only. +1 Attack, +4 health. While worn, Halo Smite is in the deck.",
      classes: ["paladin"],
      atk: 1,
      hp: 4,
      grantCards: ["p-halo"],
    }, 1),
    ...relic({
      id: "rel-grove",
      name: "Grove Staff",
      rarity: "rare",
      text: "Druid only. +1 Attack, +1 Defense. While worn, Staffroot is in the deck.",
      classes: ["druid"],
      atk: 1,
      def: 1,
      grantCards: ["d-staff"],
    }, 1),
    ...relic({
      id: "rel-knives",
      name: "Veil Knives",
      rarity: "rare",
      text: "Rogue only. Attacks apply 1 Poison. While worn, Veil Flurry is in the deck.",
      classes: ["rogue"],
      poisonOnHit: 1,
      grantCards: ["r-knives"],
    }, 1),
    ...relic({
      id: "rel-focus",
      name: "Cinder Focus",
      rarity: "rare",
      text: "Witch only. +2 Attack. While worn, Focused Pyre is in the deck.",
      classes: ["witch"],
      atk: 2,
      grantCards: ["w-focus"],
    }, 1),
    ...relic({
      id: "rel-bell",
      name: "Grave Bell",
      rarity: "rare",
      text: "Cleric only. +6 health. While worn, Bell Mend is in the deck.",
      classes: ["cleric"],
      hp: 6,
      grantCards: ["c-bell"],
    }, 1),
    ...relic({
      id: "rel-totem",
      name: "Storm Totem",
      rarity: "rare",
      text: "Warden only. Start each battle with 4 Block. While worn, Totem Gale is in the deck.",
      classes: ["warden"],
      startBlock: 4,
      grantCards: ["s-totem"],
    }, 1),
    ...relic({
      id: "rel-scepter",
      name: "Bone Scepter",
      rarity: "rare",
      text: "Necromancer only. +1 Attack. While worn, Scepter Call is in the deck.",
      classes: ["necro"],
      atk: 1,
      grantCards: ["n-scepter"],
    }, 1),
    ...relic({
      id: "rel-godhand",
      name: "Godhand",
      rarity: "rare",
      text: "Nephilim only. +3 Attack. While worn, Hand of God is in the deck.",
      classes: ["nephilim"],
      atk: 3,
      grantCards: ["nph-hand"],
    }, 1),
    ...relic({
      id: "rel-covenant",
      name: "Ley Covenant",
      rarity: "rare",
      text: "When an attack deals damage, or you gain Block, gain 1 mana. While worn, Unpriced Word is in the deck: once each room, your next spell costs no mana.",
      manaOnHit: 1,
      manaOnBlock: 1,
      grantCards: ["cov-word"],
    }, 1),
    ...relic({
      id: "rel-leech",
      name: "Leech Blade",
      rarity: "rare",
      text: "Your attacks apply 2 Bleed and heal you for 2.",
      bleedOnHit: 2,
      lifesteal: 2,
    }, 1),
    ...relic({
      id: "rel-grudge",
      name: "Grudge Plate",
      rarity: "rare",
      text: "Damage you weather is stored, up to 12. While worn, Grudge Blow is in the deck. At 12 it deals that much, ignoring armor, heals 8, and empties.",
      storeCap: 12,
      grudgeHeal: 8,
      grantCards: ["grd-blow"],
    }, 1),
    ...relic({
      id: "rel-censer",
      name: "Saint's Censer",
      rarity: "rare",
      text: "Your single-target heals restore 2 more.",
      healBonus: 2,
    }, 1),
    ...relic({
      id: "rel-bloodwell",
      name: "Bloodwell Amulet",
      rarity: "rare",
      text: "The first time each fight you drop below half health, heal 8.",
      lowHpHeal: 8,
    }, 1),
    ...relic({
      id: "rel-monocle",
      name: "Seer's Monocle",
      rarity: "rare",
      text: "You draw 4 cards each turn instead of 3. You still play one.",
      handSize: 1,
    }, 1),
  ],
  mythic: [
    ...relic({ id: "rel-dragon", name: "Dragonheart", rarity: "mythic", text: "+5 Attack. +12 maximum health.", atk: 5, hp: 12 }, 1),
    ...relic({ id: "rel-root", name: "Worldroot", rarity: "mythic", text: "+4 Defense. Start each battle with 8 Block.", def: 4, startBlock: 8 }, 1),
    ...relic({ id: "rel-ember", name: "Crown of Embers", rarity: "mythic", text: "+4 Attack. Attacks splash 3 and apply 1 Poison.", atk: 4, splash: 3, poisonOnHit: 1 }, 1),
    ...relic({ id: "rel-warden", name: "Last Light", rarity: "mythic", text: "+10 health, +2 Defense. The first time you would fall, stay at 1. Attacks heal 1.", hp: 10, def: 2, deathWard: true, lifesteal: 1 }, 1),
  ],
};

export const MONSTERS: Record<string, MonsterDef> = {};

function monster(def: MonsterDef, copies = 0): string[] {
  MONSTERS[def.id] = def;
  return Array.from({ length: copies }, () => def.id);
}

export const WEAK_DECK = [
  ...monster({ id: "goblin", name: "Goblin Skirmisher", blurb: "Quick, mean, and underpaid.", hp: 12, atk: 6, armor: 0, xp: 6, tier: "weak" }, 6),
  ...monster({ id: "bat", name: "Cave Bat", blurb: "A shriek, then teeth.", hp: 9, atk: 5, armor: 0, xp: 6, tier: "weak" }, 4),
  ...monster({ id: "slime", name: "Ash Slime", blurb: "It tightens when hurt.", hp: 15, atk: 5, armor: 0, xp: 7, tier: "weak", enrageAtHalf: 3 }, 4),
];

export const STANDARD_DECK = [
  ...monster({ id: "bone", name: "Bone Guard", blurb: "Old armor, older orders.", hp: 16, atk: 7, armor: 1, xp: 8, tier: "standard" }, 4),
  ...monster({ id: "cultist", name: "Cultist", blurb: "Chants that sharpen a knife.", hp: 13, atk: 8, armor: 0, xp: 8, tier: "standard", intent: "amount" }, 4),
  ...monster({ id: "spider", name: "Crypt Spider", blurb: "The bite keeps working.", hp: 12, atk: 6, armor: 0, xp: 8, tier: "standard", poisonOnHit: 2 }, 4),
];

export const ELITE_DECK = [
  ...monster({ id: "ogre", name: "Hall Ogre", blurb: "The ceiling is a suggestion.", hp: 26, atk: 9, armor: 1, xp: 14, tier: "elite" }, 2),
  ...monster({ id: "wraith", name: "Veil Wraith", blurb: "Armor means less to smoke.", hp: 18, atk: 8, armor: 0, xp: 14, tier: "elite", pierce: 2, intent: "hidden" }, 2),
  ...monster({ id: "hunter", name: "Seal Hunter", blurb: "It came for your heart.", hp: 20, atk: 10, armor: 0, xp: 16, tier: "elite", intent: "hunt" }, 2),
];

monster({
  id: "warden",
  name: "Grim Warden",
  blurb: "Keeper of the first seal. Armor first, then the whole table.",
  hp: 34,
  atk: 9,
  armor: 2,
  xp: 40,
  tier: "boss",
  rageAt: 0.5,
  rageBonus: 3,
  phases: 3,
  shifts: [
    {
      form: "Oathbroken",
      line: "The oath snaps. Armor means less to the Warden now.",
      hp: 8,
      atk: 2,
      armor: 0,
      pierce: 2,
    },
    {
      form: "Unsealed",
      line: "The seal is gone. Grim Warden strikes everyone still standing.",
      hp: 8,
      atk: 2,
      armor: 1,
      alwaysCleave: true,
      rageBonus: 2,
    },
  ],
});
monster({
  id: "hydra",
  name: "Mire Hydra",
  blurb: "One mouth, until you cut it off.",
  hp: 32,
  atk: 7,
  armor: 0,
  xp: 42,
  tier: "boss",
  rageAt: 0.5,
  rageBonus: 1,
  rageDouble: true,
  phases: 3,
  shifts: [
    {
      form: "Two Heads",
      line: "A second head tears free. Both bite, and the venom sticks.",
      hp: 8,
      atk: 1,
      armor: 0,
      alwaysDouble: true,
      poisonOnHit: 1,
    },
    {
      form: "The Maw",
      line: "The maw opens. Two bites, and a little venom.",
      hp: 8,
      atk: 1,
      armor: 0,
      pierce: 1,
      poisonOnHit: 1,
    },
  ],
});
monster({
  id: "priestess",
  name: "Ash Priestess",
  blurb: "Her sermon is fire. It does not stay a private one.",
  hp: 30,
  atk: 8,
  armor: 1,
  xp: 42,
  tier: "boss",
  rageAt: 0.5,
  rageBonus: 3,
  rageCleave: true,
  phases: 3,
  shifts: [
    {
      form: "Sermon",
      line: "The sermon catches. Ash Priestess burns the whole party.",
      hp: 6,
      atk: 2,
      armor: 0,
      alwaysCleave: true,
    },
    {
      form: "Pyre",
      line: "The pyre answers. Fire, poison, and nowhere to stand aside.",
      hp: 8,
      atk: 2,
      armor: 0,
      pierce: 2,
      poisonOnHit: 2,
      rageBonus: 2,
    },
  ],
});
monster({
  id: "king",
  name: "The Hollow King",
  blurb: "The last door has a crown. He stands up once.",
  hp: 48,
  atk: 11,
  armor: 2,
  xp: 64,
  tier: "final",
  rageAt: 0.5,
  rageBonus: 4,
  rageCleave: true,
  phases: 2,
  shifts: [
    {
      form: "Crowned",
      line: "The crown seats itself. The room is the target.",
      hp: 14,
      atk: 3,
      armor: 1,
      pierce: 2,
      alwaysCleave: true,
      rageBonus: 2,
    },
  ],
});

export const MINIBOSS_IDS = ["warden", "hydra", "priestess"];

export const CLASSES: Record<string, ClassDef> = {
  knight: {
    id: "knight",
    name: "Rough Knight",
    role: "Tank",
    blurb: "High health, heavier armor, and the nerve to be hit on purpose.",
    excel: "Excels at taking the hit. High health and defense, big Block, and taunts that pull the monsters onto him.",
    icon: "shield",
    heroName: "Brann Holt",
    baseHp: 34,
    hpPerLevel: 4,
    baseAtk: 4,
    baseDef: 3,
    deck: ["k-strike", "k-strike", "k-strike", "k-guard", "k-guard", "k-bash", "k-bash", "k-cleave", "k-taunt", "k-rally"],
    milestones: [
      { level: 5, cardId: "k-bulwark" },
      { level: 12, cardId: "k-earthsplit" },
      { level: 25, cardId: "k-kingwall" },
    ],
    unlock: null,
  },
  bard: {
    id: "bard",
    name: "Mage Bard",
    role: "Support",
    blurb: "Bolts, songs, and the kind of courage that keeps everyone else standing.",
    excel: "Excels at mana and morale. Well Bolt spends mana for a heavy hit, and songs raise attack or patch the party.",
    icon: "music",
    heroName: "Lira Voss",
    baseHp: 24,
    hpPerLevel: 3,
    baseAtk: 5,
    baseDef: 1,
    deck: ["b-bolt", "b-bolt", "b-well", "b-inspire", "b-inspire", "b-discord", "b-discord", "b-encore", "b-encore", "b-verse"],
    milestones: [
      { level: 5, cardId: "b-highnote" },
      { level: 12, cardId: "b-chorus" },
      { level: 25, cardId: "b-finale" },
    ],
    mana: 8,
    unlock: null,
  },
  paladin: {
    id: "paladin",
    name: "Oath Paladin",
    role: "Guard",
    blurb: "Smite the wicked, then put the party back together.",
    excel: "Excels at smiting a wounded foe and mending afterward. A guard who can heal as well as hit.",
    icon: "sun",
    heroName: "Ser Caldus",
    baseHp: 30,
    hpPerLevel: 3,
    baseAtk: 4,
    baseDef: 2,
    deck: ["p-smite", "p-smite", "p-smite", "p-hands", "p-hands", "p-ward", "p-ward", "p-judgment", "p-judgment", "p-aura"],
    milestones: [
      { level: 5, cardId: "p-mend" },
      { level: 12, cardId: "p-radiant" },
      { level: 25, cardId: "p-sanctuary" },
    ],
    unlock: null,
  },
  druid: {
    id: "druid",
    name: "Grove Druid",
    role: "Ward",
    blurb: "Poison, bark, and a deck that gets meaner when you throw cards away.",
    excel: "Excels at poison and staying in the fight. Mana thorns, bark for Block, and cards that get meaner when thrown away.",
    icon: "leaf",
    heroName: "Moss Quill",
    baseHp: 28,
    hpPerLevel: 3,
    baseAtk: 4,
    baseDef: 2,
    deck: ["d-thorn", "d-thorn", "d-well", "d-bark", "d-bark", "d-shed", "d-shed", "d-regrowth", "d-regrowth", "d-entangle"],
    milestones: [
      { level: 5, cardId: "d-briar" },
      { level: 12, cardId: "d-deeproot" },
      { level: 25, cardId: "d-ancient" },
    ],
    mana: 6,
    unlock: null,
  },
  rogue: {
    id: "rogue",
    name: "Veil Rogue",
    role: "Striker",
    blurb: "Opens on the healthy and finishes what poison started.",
    excel: "Excels at opening on a healthy foe and stacking poison. Fast hits, little armor, and a second strike.",
    icon: "feather",
    heroName: "Nyx Vale",
    baseHp: 22,
    hpPerLevel: 2,
    baseAtk: 6,
    baseDef: 1,
    deck: ["r-shiv", "r-shiv", "r-shiv", "r-backstab", "r-backstab", "r-fade", "r-fade", "r-venom", "r-venom", "r-flurry"],
    milestones: [
      { level: 5, cardId: "r-garrote" },
      { level: 12, cardId: "r-shadowstep" },
      { level: 25, cardId: "r-killstroke" },
    ],
    unlock: { key: "door-ambush", label: "Clear an Ambush Stair" },
  },
  witch: {
    id: "witch",
    name: "Cinder Witch",
    role: "Striker",
    blurb: "Pays in blood for bolts that end arguments.",
    excel: "Excels at mana bolts that end a foe. She pays health for the biggest single hits at the table.",
    icon: "flame",
    heroName: "Sable Morne",
    baseHp: 22,
    hpPerLevel: 2,
    baseAtk: 6,
    baseDef: 1,
    deck: ["w-cinder", "w-cinder", "w-well", "w-hex", "w-hex", "w-pact", "w-pact", "w-ash", "w-ash", "w-wildfire"],
    milestones: [
      { level: 5, cardId: "w-immolate" },
      { level: 12, cardId: "w-curse" },
      { level: 25, cardId: "w-cataclysm" },
    ],
    mana: 8,
    unlock: { key: "door-curse", label: "Survive a Cursed Reliquary" },
  },
  cleric: {
    id: "cleric",
    name: "Grave Cleric",
    role: "Support",
    blurb: "Big heals, clean poison, and a smite with dirt under its nails.",
    excel: "Excels at healing, wiping poison, and standing the fallen back up. The party's medicine.",
    icon: "heart",
    heroName: "Osric Bale",
    baseHp: 28,
    hpPerLevel: 3,
    baseAtk: 3,
    baseDef: 2,
    deck: ["c-mend", "c-mend", "c-mend", "c-smite", "c-smite", "c-sanctuary", "c-sanctuary", "c-purify", "c-purify", "c-requiem"],
    milestones: [
      { level: 5, cardId: "c-miracle" },
      { level: 12, cardId: "c-litany" },
      { level: 25, cardId: "c-ascension" },
    ],
    unlock: { key: "door-font", label: "Step into a Ley Font" },
  },
  warden: {
    id: "warden",
    name: "Storm Warden",
    role: "Guard",
    blurb: "A wall that throws lightning back.",
    excel: "Excels at shielding the whole party, then throwing the storm back. Block for everyone, and lightning on top.",
    icon: "storm",
    heroName: "Hera Flint",
    baseHp: 32,
    hpPerLevel: 3,
    baseAtk: 4,
    baseDef: 2,
    deck: ["s-lance", "s-lance", "s-lance", "s-howl", "s-howl", "s-charge", "s-charge", "s-gale", "s-gale", "s-thunder"],
    milestones: [
      { level: 5, cardId: "s-tempest" },
      { level: 12, cardId: "s-bastion" },
      { level: 25, cardId: "s-eye" },
    ],
    unlock: { key: "boss-warden", label: "Slay the Grim Warden" },
  },
  necro: {
    id: "necro",
    name: "Bone Necromancer",
    role: "Summoner",
    blurb: "Spends mana to raise thralls that strike beside the party and sometimes take the blow.",
    excel: "Excels at thralls. Spends mana to raise up to two bones that strike on their own and sometimes take the blow.",
    icon: "skull",
    heroName: "Vesper Cain",
    baseHp: 24,
    hpPerLevel: 2,
    baseAtk: 3,
    baseDef: 1,
    deck: ["n-lash", "n-lash", "n-lash", "n-raise", "n-raise", "n-guard", "n-guard", "n-drain", "n-drain", "n-command"],
    milestones: [
      { level: 5, cardId: "n-legion" },
      { level: 12, cardId: "n-grave" },
      { level: 25, cardId: "n-king" },
    ],
    mana: 7,
    unlock: null,
  },
  nephilim: {
    id: "nephilim",
    name: "Nephilim",
    role: "Ascendant",
    blurb: "The power of the gods in one body. Smite, shelter, and a mana bolt that ends rooms.",
    excel: "Excels at ending the room. A huge body, a mana bolt, smites, and shelter for the whole party.",
    icon: "crown",
    heroName: "The Nephilim",
    baseHp: 38,
    hpPerLevel: 4,
    baseAtk: 6,
    baseDef: 2,
    deck: ["nph-palm", "nph-palm", "nph-smite", "nph-smite", "nph-aegis", "nph-aegis", "nph-wrath", "nph-wrath", "nph-mercy", "nph-bolt"],
    milestones: [
      { level: 5, cardId: "nph-host" },
      { level: 12, cardId: "nph-judgment" },
      { level: 25, cardId: "nph-apocalypse" },
    ],
    mana: 6,
    unlock: null,
  },
};

export const CLASS_ORDER = ["knight", "bard", "paladin", "druid", "rogue", "witch", "cleric", "warden", "necro", "nephilim"];

export function defaultRoster(): PersistedHero[] {
  return CLASS_ORDER.map((id) => {
    const c = CLASSES[id];
    return {
      id,
      name: c.heroName,
      classId: id,
      level: 1,
      xp: 0,
      keepsakeId: null,
      unlocked: c.unlock === null,
    };
  });
}

export interface DoorTemplate {
  kind: DoorKind;
  title: string;
  risk: Risk;
  lootLabel: string;
  odds: { common: number; rare: number; mythic: number } | null;
  hints: string[];
  fight: boolean;
}

export const DOOR_TEMPLATES: Record<Exclude<DoorKind, "miniboss" | "final">, DoorTemplate> = {
  quiet: {
    kind: "quiet",
    title: "Quiet Hall",
    risk: "Low",
    lootLabel: "Common or rare",
    odds: { common: 76, rare: 24, mythic: 0 },
    hints: [
      "Scratching, then nothing. Probably nothing.",
      "A draft that smells like wet coin.",
      "One set of footprints, already drying.",
    ],
    fight: true,
  },
  vault: {
    kind: "vault",
    title: "Guarded Vault",
    risk: "Measured",
    lootLabel: "Common or rare",
    odds: { common: 58, rare: 42, mythic: 0 },
    hints: [
      "A lock, and someone still holding the key.",
      "Torchlight moves on the far side of the bars.",
      "The chest is real. So is the breathing.",
    ],
    fight: true,
  },
  ambush: {
    kind: "ambush",
    title: "Ambush Stair",
    risk: "High",
    lootLabel: "Rare leaning",
    odds: { common: 30, rare: 50, mythic: 20 },
    hints: [
      "The quiet is arranged.",
      "Something large shifted its weight and pretended not to.",
      "A hunter's mark, freshly cut.",
    ],
    fight: true,
  },
  nest: {
    kind: "nest",
    title: "Monster Nest",
    risk: "Measured",
    lootLabel: "Common or rare. No mythic.",
    odds: { common: 82, rare: 18, mythic: 0 },
    hints: [
      "Too many eyes for one animal.",
      "Bones stacked the way a creature stacks toys.",
      "The skittering has a rhythm.",
    ],
    fight: true,
  },
  supplies: {
    kind: "supplies",
    title: "Supply Nook",
    risk: "Low",
    lootLabel: "No relics — bandages and oil",
    odds: null,
    hints: [
      "Cork, linen, and the ghost of a cookfire.",
      "Someone cached a pack and never came back.",
      "The door sticks like a pantry.",
    ],
    fight: false,
  },
  curse: {
    kind: "curse",
    title: "Cursed Reliquary",
    risk: "High",
    lootLabel: "Rare likely, after the bite",
    odds: { common: 20, rare: 55, mythic: 25 },
    hints: [
      "The lid is warm. The lock is already open.",
      "A sweet smell, and a click that isn't a lock.",
      "Gold, if you don't mind paying in skin.",
    ],
    fight: false,
  },
  shop: {
    kind: "shop",
    title: "Wayside Stall",
    risk: "Low",
    lootLabel: "Buy supplies, relics, or a revive",
    odds: null,
    hints: [
      "A lamp, a scale, and a merchant who does not ask names.",
      "Corks, charms, and prices scratched into the wood.",
      "The stall is open. The road behind it is not.",
    ],
    fight: false,
  },
  font: {
    kind: "font",
    title: "Ley Font",
    risk: "Low",
    lootLabel: "Mana, and a phial",
    odds: null,
    hints: [
      "The air tastes like rain on hot stone.",
      "A basin that refills itself with pale light.",
      "Spellcasters know this smell.",
    ],
    fight: false,
  },
  campfire: {
    kind: "campfire",
    title: "Campfire",
    risk: "Low",
    lootLabel: "Rest, or forage one supply",
    odds: null,
    hints: [
      "Orange light, and no footprints leading away.",
      "A ring of stones still warm. Nobody is waiting.",
      "Sparks climb the ruin. The hall is quiet.",
    ],
    fight: false,
  },
};

export const BOSS_DOOR = {
  title: "Seal Gate",
  risk: "Deadly" as Risk,
  lootLabel: "Rare or better",
  odds: { common: 10, rare: 55, mythic: 35 },
  hints: [
    "It falls. Then it stands. Then it stands again.",
    "A crown-shaped shadow, and the sense it has more than one life.",
    "This is not a rumor. Something enthroned is listening.",
  ],
};

export const FINAL_DOOR = {
  title: "The Hollow Gate",
  risk: "Deadly" as Risk,
  lootLabel: "A king's hoard",
  odds: { common: 0, rare: 45, mythic: 55 },
  hints: ["Three seals are broken. The King falls once, then wears the crown."],
};

export const POUCH_MAX = 5;
export const RELIC_SLOTS = 3;
export const LEVEL_CAP = 50;

export function xpThreshold(level: number): number {
  if (level >= LEVEL_CAP) return 0;
  return 22 + level * 8;
}

export function relicIdsOf(keepsakeId: string | null, equipped: string[]): string[] {
  const ids = [...equipped];
  if (keepsakeId && RELICS[keepsakeId]) ids.push(keepsakeId);
  return ids;
}

export function computeStats(classId: string, level: number, relicIds: string[]) {
  const c = CLASSES[classId];
  const lvl = Math.max(1, Math.min(LEVEL_CAP, level));
  let maxHp = c.baseHp + (lvl - 1) * c.hpPerLevel;
  let atk = c.baseAtk + Math.floor((lvl - 1) / 2);
  let def = c.baseDef + Math.floor((lvl - 1) / 3);
  let startBlock = 0;
  let lifesteal = 0;
  let thorns = 0;
  let splash = 0;
  let deathWard = false;
  let poisonOnHit = 0;
  let manaOnHit = 0;
  let manaOnBlock = 0;
  let bleedOnHit = 0;
  let storeCap = 0;
  let grudgeHeal = 0;
  let postFightHeal = 0;
  let healBonus = 0;
  let lowHpHeal = 0;
  let handSize = 0;
  for (const id of relicIds) {
    const r = RELICS[id];
    if (!r) continue;
    maxHp += r.hp ?? 0;
    atk += r.atk ?? 0;
    def += r.def ?? 0;
    startBlock += r.startBlock ?? 0;
    lifesteal += r.lifesteal ?? 0;
    thorns += r.thorns ?? 0;
    splash += r.splash ?? 0;
    poisonOnHit += r.poisonOnHit ?? 0;
    manaOnHit += r.manaOnHit ?? 0;
    manaOnBlock += r.manaOnBlock ?? 0;
    bleedOnHit += r.bleedOnHit ?? 0;
    storeCap += r.storeCap ?? 0;
    grudgeHeal += r.grudgeHeal ?? 0;
    postFightHeal += r.postFightHeal ?? 0;
    healBonus += r.healBonus ?? 0;
    lowHpHeal += r.lowHpHeal ?? 0;
    handSize += r.handSize ?? 0;
    if (r.deathWard) deathWard = true;
  }
  return {
    maxHp,
    atk,
    def,
    startBlock,
    lifesteal,
    thorns,
    splash,
    deathWard,
    poisonOnHit,
    manaOnHit,
    manaOnBlock,
    bleedOnHit,
    storeCap,
    grudgeHeal,
    postFightHeal,
    healBonus,
    lowHpHeal,
    handSize,
  };
}

export function deckFor(classId: string, level: number): string[] {
  const c = CLASSES[classId];
  const ids = [...c.deck];
  for (const m of c.milestones) {
    if (level >= m.level) ids.push(m.cardId);
  }
  return ids;
}

export function relicEffects(relic: RelicDef): string[] {
  const bits: string[] = [];
  if (relic.atk) bits.push(`+${relic.atk} Attack`);
  if (relic.def) bits.push(`+${relic.def} Defense`);
  if (relic.hp) bits.push(`+${relic.hp} maximum health`);
  if (relic.startBlock) bits.push(`${relic.startBlock} Block at battle start`);
  if (relic.lifesteal) bits.push(`Attacks heal ${relic.lifesteal}`);
  if (relic.thorns) bits.push(`Block deals ${relic.thorns} to a foe`);
  if (relic.splash) bits.push(`Splash ${relic.splash}`);
  if (relic.poisonOnHit) bits.push(`Attacks apply ${relic.poisonOnHit} Poison`);
  if (relic.manaOnHit) bits.push(`Attacks grant ${relic.manaOnHit} mana`);
  if (relic.manaOnBlock) bits.push(`Block grants ${relic.manaOnBlock} mana`);
  if (relic.bleedOnHit) bits.push(`Attacks apply ${relic.bleedOnHit} Bleed`);
  if (relic.storeCap) bits.push(`Stores ${relic.storeCap} damage`);
  if (relic.grudgeHeal) bits.push(`Full plate heals ${relic.grudgeHeal}`);
  if (relic.postFightHeal) bits.push(`Heals ${relic.postFightHeal} after each fight`);
  if (relic.healBonus) bits.push(`Single-target heals +${relic.healBonus}`);
  if (relic.lowHpHeal) bits.push(`Below half: heal ${relic.lowHpHeal} once per fight`);
  if (relic.handSize) bits.push(relic.handSize === 1 ? "Hand +1 card" : `Hand +${relic.handSize} cards`);
  if (relic.deathWard) bits.push("First lethal blow leaves you at 1");
  return bits;
}

export function isCampHealSupply(def: SupplyDef): boolean {
  if (def.effects.length === 0) return false;
  const heals = def.effects.some((e) => e.op === "heal" || e.op === "revive" || e.op === "cleanse");
  const only = def.effects.every((e) => e.op === "heal" || e.op === "revive" || e.op === "cleanse" || e.op === "block");
  return heals && only;
}

export function foePlan(kind: DoorKind, party: number): { label: string; count: number } {
  if (kind === "supplies") return { label: "No fight", count: 0 };
  if (kind === "shop") return { label: "Spend gold on supplies and relics", count: 0 };
  if (kind === "font") return { label: "A spring of mana. No fight", count: 0 };
  if (kind === "campfire") return { label: "No foes. Rest or forage", count: 0 };
  if (kind === "curse") return { label: "A trap, then treasure", count: 0 };
  if (kind === "miniboss") {
    return { label: "Seal boss · 3 forms, each harder", count: 1 };
  }
  if (kind === "final") {
    return { label: "Hollow King · 2 forms", count: 1 };
  }
  if (kind === "quiet") {
    const n = party >= 4 ? 2 : 1;
    return { label: n === 1 ? "1 foe" : "2 foes", count: n };
  }
  if (kind === "vault") {
    const n = party <= 2 ? 1 : party === 3 ? 2 : 3;
    return { label: n === 1 ? "1 foe" : `${n} foes`, count: n };
  }
  if (kind === "ambush") {
    const n = party >= 3 ? 2 : 1;
    return { label: n === 1 ? "1 elite" : "An elite and a foe", count: n };
  }
  const n = Math.min(4, party + 1);
  return { label: `${n} foes`, count: n };
}

function assertContent() {
  for (const c of Object.values(CLASSES)) {
    for (const id of c.deck) {
      if (!CARDS[id]) throw new Error(`Missing card ${id}`);
    }
    for (const m of c.milestones) {
      if (!CARDS[m.cardId]) throw new Error(`Missing milestone ${m.cardId}`);
    }
  }
  for (const id of [...WEAK_DECK, ...STANDARD_DECK, ...ELITE_DECK]) {
    if (!MONSTERS[id]) throw new Error(`Missing monster ${id}`);
  }
  for (const id of [...MINIBOSS_IDS, "king"]) {
    const m = MONSTERS[id];
    if (!m) throw new Error(`Missing monster ${id}`);
    const forms = m.phases ?? 1;
    if ((m.shifts?.length ?? 0) !== forms - 1) throw new Error(`Boss ${id} phases do not match shifts`);
  }
  for (const id of SUPPLY_DECK) {
    if (!SUPPLIES[id]) throw new Error(`Missing supply ${id}`);
  }
  for (const pile of [TREASURE_DECKS.common, TREASURE_DECKS.rare, TREASURE_DECKS.mythic]) {
    for (const id of pile) if (!RELICS[id]) throw new Error(`Missing relic ${id}`);
  }
  for (const relic of Object.values(RELICS)) {
    for (const id of relic.grantCards ?? []) {
      if (!CARDS[id]) throw new Error(`Missing grant ${relic.id}:${id}`);
    }
  }
}

assertContent();
