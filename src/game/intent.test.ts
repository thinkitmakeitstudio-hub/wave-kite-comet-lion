import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { defaultRoster } from "./content.ts";
import { chooseDoor, chooseIntentTarget, planIntents, playCard, startRun, stepEnemies } from "./engine.ts";
import type { Run } from "./types.ts";

function fight(seed = 4): Run {
  let run = startRun(defaultRoster(), ["knight", "bard", "paladin"], seed);
  run.doors = [
    {
      uid: "hall",
      kind: "quiet",
      title: "Quiet Hall",
      hint: "Quiet.",
      risk: "Low",
      lootLabel: "Common or rare",
      foes: "1 foe",
      odds: { common: 76, rare: 24, mythic: 0 },
    },
  ];
  run = chooseDoor(run, "hall").run;
  assert.ok(run.enemies.length > 0);
  return run;
}

describe("enemy intentions", () => {
  it("a foe attacks the target it showed at the start of the round", () => {
    const run = fight(6);
    const foe = run.enemies.find((enemy) => enemy.intentTargetId && enemy.intentTargetId !== "all");
    assert.ok(foe);
    const shown = run.party.find((hero) => hero.id === foe.intentTargetId)!;
    const other = run.party.find((hero) => hero.id !== shown.id && !hero.down)!;
    shown.hp = shown.maxHp;
    shown.def = 0;
    shown.defBuff = 0;
    shown.block = 0;
    other.hp = 1;
    foe.atk = 6;
    foe.baseAtk = 6;
    foe.pierce = 0;
    foe.alwaysCleave = false;
    foe.alwaysDouble = false;
    foe.raging = false;
    foe.rageCleave = false;
    foe.skip = false;
    run.enemies = [foe];
    run.phase = "enemy";
    run.beat = "strikes";
    run.strikeIndex = 0;
    run.strikeHitsLeft = 0;
    run.tauntHeroId = null;
    const stepped = stepEnemies(run).run;
    assert.ok(stepped.party.find((hero) => hero.id === shown.id)!.hp < shown.maxHp);
    assert.equal(stepped.party.find((hero) => hero.id === other.id)!.hp, 1);
    assert.match(stepped.log.at(-1) ?? "", new RegExp(shown.name));
  });

  it("taunt switches every foe's target", () => {
    let run = fight(8);
    run.phase = "battle";
    run.actorIndex = run.party.findIndex((hero) => hero.classId === "knight");
    run.hand = [{ uid: "taunt", cardId: "k-taunt" }];
    run.playsLeft = 1;
    const knight = run.party[run.actorIndex]!;
    run = playCard(run, "taunt", null).run;
    assert.equal(run.tauntHeroId, knight.id);
    for (const enemy of run.enemies) {
      if (enemy.hp <= 0 || enemy.skip || enemy.staggered) continue;
      if (enemy.alwaysCleave || (enemy.raging && enemy.rageCleave)) {
        assert.equal(enemy.intentTargetId, "all");
      } else {
        assert.equal(enemy.intentTargetId, knight.id);
      }
    }
  });

  it("replaces a downed target with a living hero", () => {
    const run = fight(9);
    const foe = run.enemies[0]!;
    foe.alwaysCleave = false;
    foe.raging = false;
    foe.rageCleave = false;
    foe.skip = false;
    foe.staggered = false;
    foe.intent = "full";
    const fallen = run.party[0]!;
    const living = run.party[1]!;
    for (const hero of run.party) {
      if (hero.id === living.id) continue;
      hero.down = true;
      hero.hp = 0;
    }
    foe.intentTargetId = fallen.id;
    living.def = 0;
    living.defBuff = 0;
    living.block = 0;
    foe.atk = 5;
    foe.baseAtk = 5;
    foe.pierce = 0;
    run.enemies = [foe];
    run.phase = "enemy";
    run.beat = "strikes";
    run.strikeIndex = 0;
    run.strikeHitsLeft = 0;
    run.tauntHeroId = null;
    const before = living.hp;
    const stepped = stepEnemies(run).run;
    assert.notEqual(stepped.enemies[0]!.intentTargetId, fallen.id);
    assert.ok(stepped.party.find((hero) => hero.id === living.id)!.hp < before);
  });

  it("the Seal Hunter targets the lowest-HP hero", () => {
    const run = fight(11);
    const foe = run.enemies[0]!;
    foe.defId = "hunter";
    foe.intent = "hunt";
    foe.name = "Seal Hunter";
    foe.alwaysCleave = false;
    foe.raging = false;
    foe.skip = false;
    run.tauntHeroId = null;
    const low = run.party[1]!;
    const high = run.party[0]!;
    low.hp = 3;
    high.hp = high.maxHp;
    planIntents(run);
    assert.equal(foe.intentTargetId, low.id);
    assert.equal(chooseIntentTarget(run, foe), low.id);
  });

  it("cleave foes show all", () => {
    const run = fight(12);
    const foe = run.enemies[0]!;
    foe.alwaysCleave = true;
    foe.skip = false;
    foe.staggered = false;
    foe.intent = "full";
    planIntents(run);
    assert.equal(foe.intentTargetId, "all");
  });
});
