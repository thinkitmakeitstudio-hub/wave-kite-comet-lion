import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { defaultRoster } from "./content.ts";
import { beginBattle, chooseDoor, playCard, startRun, stepEnemies, useSupply } from "./engine.ts";
import type { DoorState, Run } from "./types.ts";

function quietDoor(uid: string): DoorState {
  return {
    uid,
    kind: "quiet",
    title: "Hall",
    hint: "h",
    risk: "Low",
    lootLabel: "l",
    foes: "1",
    odds: { common: 70, rare: 30, mythic: 0 },
  };
}

function toPrep(ids: string[], seed: number): Run {
  let run = startRun(defaultRoster(), ids, seed);
  run.doors = [quietDoor("d1")];
  run = chooseDoor(run, "d1").run;
  assert.equal(run.phase, "prep");
  return run;
}

describe("camp healing and new relics", () => {
  it("Hearth Stew heals every hero by 7 on the door screen", () => {
    const run = startRun(defaultRoster(), ["knight", "paladin"], 11);
    assert.equal(run.phase, "doors");
    for (const hero of run.party) hero.hp = hero.maxHp - 10;
    run.supplies = [{ uid: "stew", defId: "sup-stew" }];
    const used = useSupply(run, "stew", null);
    assert.equal(used.run.phase, "doors");
    assert.equal(used.run.prepSupplyUsed, false);
    assert.equal(used.run.supplies.some((s) => s.defId === "sup-stew"), false);
    for (const hero of used.run.party) {
      assert.equal(hero.hp, hero.maxHp - 3);
      assert.equal(hero.block, 0);
    }
  });

  it("Linen Bandage heals outside a fight and skips the block", () => {
    const run = startRun(defaultRoster(), ["knight"], 12);
    run.party[0]!.hp = run.party[0]!.maxHp - 10;
    run.supplies = [{ uid: "wrap", defId: "sup-bandage" }];
    const used = useSupply(run, "wrap", "knight");
    assert.equal(used.run.party[0]!.hp, used.run.party[0]!.maxHp - 5);
    assert.equal(used.run.party[0]!.block, 0);

    const prep = toPrep(["knight"], 13);
    prep.party[0]!.hp = prep.party[0]!.maxHp - 10;
    prep.supplies = [{ uid: "wrap", defId: "sup-bandage" }];
    const fought = useSupply(prep, "wrap", "knight");
    assert.equal(fought.run.party[0]!.hp, fought.run.party[0]!.maxHp - 5);
    assert.equal(fought.run.party[0]!.block, 4);
    assert.equal(fought.run.prepSupplyUsed, true);
  });

  it("Mender's Thread heals 5 after a cleared fight", () => {
    let run = toPrep(["knight"], 14);
    run = beginBattle(run).run;
    const hero = run.party[0]!;
    run.equipped[hero.id] = ["rel-thread"];
    hero.hp = hero.maxHp - 9;
    const foe = run.enemies[0]!;
    foe.hp = 1;
    foe.armor = 0;
    run.hand = [{ uid: "hit", cardId: "k-strike" }];
    run = playCard(run, "hit", foe.uid).run;
    assert.equal(run.enemies.filter((e) => e.hp > 0).length, 0);
    assert.equal(run.party[0]!.hp, run.party[0]!.maxHp - 4);
    assert.ok(run.party[0]!.hp <= run.party[0]!.maxHp);
  });

  it("Saint's Censer adds 2 to Lay on Hands but not to Aura or Litany", () => {
    let run = toPrep(["paladin", "knight"], 15);
    run = beginBattle(run).run;
    const pal = run.party[0]!;
    const ally = run.party[1]!;
    run.equipped[pal.id] = ["rel-censer"];
    pal.hp = 8;
    ally.hp = 8;
    run.enemies[0]!.hp = 500;
    run.hand = [{ uid: "hands", cardId: "p-hands" }];
    run = playCard(run, "hands", ally.id).run;
    assert.equal(run.party[1]!.hp, 18);
    assert.equal(run.party[0]!.hp, 8);

    run.phase = "battle";
    run.actorIndex = 0;
    run.playsLeft = 1;
    run.hand = [{ uid: "self", cardId: "p-hands" }];
    run = playCard(run, "self", pal.id).run;
    assert.equal(run.party[0]!.hp, 16);

    run.phase = "battle";
    run.actorIndex = 0;
    run.playsLeft = 1;
    run.hand = [{ uid: "aura", cardId: "p-aura" }];
    const auraPal = run.party[0]!.hp;
    const auraAlly = run.party[1]!.hp;
    run = playCard(run, "aura", null).run;
    assert.equal(run.party[0]!.hp, auraPal + 2);
    assert.equal(run.party[1]!.hp, auraAlly + 2);

    run.phase = "battle";
    run.actorIndex = 0;
    run.playsLeft = 1;
    run.hand = [{ uid: "lit", cardId: "c-litany" }];
    const litPal = run.party[0]!.hp;
    const litAlly = run.party[1]!.hp;
    run = playCard(run, "lit", null).run;
    assert.equal(run.party[0]!.hp, litPal + 6);
    assert.equal(run.party[1]!.hp, litAlly + 6);
  });

  it("Bloodwell triggers once per fight", () => {
    let run = toPrep(["knight"], 16);
    run.equipped.knight = ["rel-bloodwell"];
    const hero = () => run.party[0]!;
    hero().hp = 20;
    hero().def = 0;
    hero().defBuff = 0;
    hero().block = 0;
    const foe = run.enemies[0]!;
    foe.atk = 6;
    foe.baseAtk = 6;
    foe.pierce = 0;
    foe.weaken = 0;
    foe.skip = false;
    foe.bleed = 0;
    foe.poison = 0;
    foe.alwaysDouble = false;
    foe.raging = false;
    run.phase = "enemy";
    run.beat = "strikes";
    run.strikeIndex = 0;
    run.strikeHitsLeft = 0;
    run.minions = [];
    run = stepEnemies(run).run;
    assert.equal(hero().hp, 22);
    assert.equal(hero().lowHpHealUsed, true);

    run.phase = "enemy";
    run.beat = "strikes";
    run.strikeIndex = 0;
    run.strikeHitsLeft = 0;
    const before = hero().hp;
    run = stepEnemies(run).run;
    assert.equal(hero().hp, before - 6);
    assert.equal(hero().lowHpHealUsed, true);

    run.phase = "doors";
    run.doors = [quietDoor("d2")];
    run = chooseDoor(run, "d2").run;
    assert.equal(run.phase, "prep");
    assert.equal(run.party[0]!.lowHpHealUsed, false);
    run.equipped.knight = ["rel-bloodwell"];
    run.party[0]!.hp = 20;
    run.party[0]!.def = 0;
    run.party[0]!.defBuff = 0;
    run.party[0]!.block = 0;
    const next = run.enemies[0]!;
    next.atk = 6;
    next.baseAtk = 6;
    next.pierce = 0;
    next.weaken = 0;
    next.skip = false;
    next.bleed = 0;
    next.poison = 0;
    next.alwaysDouble = false;
    next.raging = false;
    run.phase = "enemy";
    run.beat = "strikes";
    run.strikeIndex = 0;
    run.strikeHitsLeft = 0;
    run = stepEnemies(run).run;
    assert.equal(run.party[0]!.hp, 22);
  });

  it("the Monocle deals 4 cards", () => {
    let run = toPrep(["knight"], 17);
    run.equipped.knight = ["rel-monocle"];
    run = beginBattle(run).run;
    assert.equal(run.hand.length, 4);
    assert.equal(run.playsLeft, 1);
  });
});
