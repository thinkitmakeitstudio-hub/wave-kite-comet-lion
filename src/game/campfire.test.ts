import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { defaultRoster, MONSTERS, POUCH_MAX } from "./content.ts";
import {
  chooseDoor,
  forageAtCampfire,
  goDeeper,
  restAtCampfire,
  restAtStall,
  startRun,
  stepEnemies,
} from "./engine.ts";
import type { DoorState, Run } from "./types.ts";

function campDoor(): DoorState {
  return {
    uid: "fire",
    kind: "campfire",
    title: "Campfire",
    hint: "Warm stones.",
    risk: "Low",
    lootLabel: "Rest, or forage one supply",
    foes: "No foes. Rest or forage",
    odds: null,
  };
}

function atCampfire(seed = 3): Run {
  let run = startRun(defaultRoster(), ["knight", "bard"], seed);
  run.doors = [campDoor()];
  run = chooseDoor(run, "fire").run;
  assert.equal(run.phase, "campfire");
  assert.equal(run.enemies.length, 0);
  return run;
}

describe("campfire and stall rest", () => {
  it("rest heals standing heroes 30% and raises the downed at 25%", () => {
    let run = atCampfire(8);
    const standing = run.party[0]!;
    const fallen = run.party[1]!;
    standing.hp = 10;
    fallen.down = true;
    fallen.hp = 0;
    const standGain = Math.round(standing.maxHp * 0.3);
    const rise = Math.max(1, Math.round(fallen.maxHp * 0.25));
    run = restAtCampfire(run).run;
    assert.equal(run.phase, "onward");
    assert.equal(run.party[0]!.hp, Math.min(standing.maxHp, 10 + standGain));
    assert.equal(run.party[1]!.down, false);
    assert.equal(run.party[1]!.hp, rise);
  });

  it("forage adds one supply, and does nothing when the pouch is full", () => {
    let run = atCampfire(9);
    const before = run.supplies.length;
    assert.ok(before < POUCH_MAX);
    run = forageAtCampfire(run).run;
    assert.equal(run.phase, "onward");
    assert.equal(run.supplies.length, before + 1);

    run = atCampfire(10);
    while (run.supplies.length < POUCH_MAX) {
      run.supplies.push({ uid: `pad-${run.supplies.length}`, defId: "sup-salve" });
    }
    const full = forageAtCampfire(run);
    assert.equal(full.run.phase, "campfire");
    assert.equal(full.run.supplies.length, POUCH_MAX);
    assert.equal(full.events.some((e) => e.banner === "Pouch full"), true);
  });

  it("the stall rest costs 30 gold once, heals 20%, and does not revive", () => {
    let run = startRun(defaultRoster(), ["knight", "bard"], 11);
    run.phase = "shop";
    run.shop = [];
    run.shopRested = false;
    run.gold = 30;
    const knight = run.party[0]!;
    const bard = run.party[1]!;
    knight.hp = 8;
    bard.down = true;
    bard.hp = 0;
    const gain = Math.round(knight.maxHp * 0.2);
    run = restAtStall(run).run;
    assert.equal(run.gold, 0);
    assert.equal(run.shopRested, true);
    assert.equal(run.phase, "shop");
    assert.equal(run.party[0]!.hp, Math.min(knight.maxHp, 8 + gain));
    assert.equal(run.party[1]!.down, true);
    assert.equal(run.party[1]!.hp, 0);
    const again = restAtStall(run).run;
    assert.equal(again.gold, 0);
    assert.equal(again.party[0]!.hp, run.party[0]!.hp);

    run.gold = 10;
    run.shopRested = false;
    const broke = restAtStall(run).run;
    assert.equal(broke.gold, 10);
    assert.equal(broke.shopRested, false);
  });

  it("shows up about as often as a supply nook and never as the boss door", () => {
    let camp = 0;
    let supply = 0;
    for (let seed = 1; seed <= 240; seed++) {
      const run = startRun(defaultRoster(), ["knight"], seed);
      for (const door of run.doors) {
        if (door.kind === "campfire") camp += 1;
        if (door.kind === "supplies") supply += 1;
        assert.equal(door.bossId, undefined);
      }
      let deeper = run;
      deeper.phase = "onward";
      deeper = goDeeper(deeper).run;
      const boss = deeper.doors.find((door) => door.bossId);
      assert.ok(boss);
      assert.equal(boss.kind, "miniboss");
      assert.notEqual(boss.kind, "campfire");
    }
    assert.ok(camp > 40 && supply > 40);
    assert.ok(Math.abs(camp - supply) / Math.max(camp, supply) < 0.35);
  });

  it("caps poison from a foe's venom at 6, and leaves other poison alone", () => {
    const maw = MONSTERS.hydra?.shifts?.[1];
    assert.equal(maw?.atk, 1);
    assert.equal(maw?.poisonOnHit, 1);
    assert.equal(maw?.pierce, 1);
    assert.equal(MONSTERS.hydra?.shifts?.[0]?.alwaysDouble, true);
    assert.equal(MONSTERS.hydra?.shifts?.[0]?.poisonOnHit, 1);

    let run = startRun(defaultRoster(), ["knight"], 12);
    run.doors = [
      {
        uid: "b",
        kind: "miniboss",
        title: "Seal",
        hint: "h",
        risk: "Deadly",
        lootLabel: "l",
        foes: "boss",
        odds: { common: 0, rare: 50, mythic: 50 },
        bossId: "hydra",
      },
    ];
    run = chooseDoor(run, "b").run;
    const hero = run.party[0]!;
    const foe = run.enemies[0]!;
    hero.def = 0;
    hero.defBuff = 0;
    hero.block = 0;
    hero.poison = 5;
    foe.poisonOnHit = 3;
    foe.atk = 6;
    foe.baseAtk = 6;
    foe.pierce = 0;
    run.phase = "enemy";
    run.beat = "strikes";
    run.strikeIndex = 0;
    run.strikeHitsLeft = 0;
    run = stepEnemies(run).run;
    assert.equal(run.party[0]!.poison, 6);

    run.party[0]!.poison = 8;
    run.phase = "enemy";
    run.beat = "strikes";
    run.strikeIndex = 0;
    run.strikeHitsLeft = 0;
    run.enemies[0]!.poisonOnHit = 3;
    run.enemies[0]!.hp = run.enemies[0]!.maxHp;
    run = stepEnemies(run).run;
    assert.equal(run.party[0]!.poison, 8);
  });
});
