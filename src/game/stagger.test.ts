import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { defaultRoster } from "./content.ts";
import { beginBattle, chooseDoor, enemyIntent, playCard, startRun, stepEnemies } from "./engine.ts";
import type { DoorState, EnemyState, Run } from "./types.ts";

function bossDoor(uid: string): DoorState {
  return {
    uid,
    kind: "miniboss",
    title: "Seal",
    hint: "h",
    risk: "Deadly",
    lootLabel: "l",
    foes: "boss",
    odds: { common: 0, rare: 60, mythic: 40 },
    bossId: "warden",
  };
}

function enterBoss(ids: string[], seed: number): Run {
  let run = startRun(defaultRoster(), ids, seed);
  run.doors = [bossDoor("seal")];
  run = chooseDoor(run, "seal").run;
  assert.equal(run.phase, "prep");
  run = beginBattle(run).run;
  assert.equal(run.phase, "battle");
  assert.equal(run.enemies[0]!.boss, true);
  assert.equal(run.enemies[0]!.form, 1);
  return run;
}

function quietAdd(boss: EnemyState): EnemyState {
  return {
    ...boss,
    uid: "add",
    defId: "goblin",
    name: "Goblin Skirmisher",
    blurb: "Adds a swing of its own.",
    hp: 40,
    maxHp: 40,
    atk: 7,
    baseAtk: 7,
    armor: 0,
    xp: 6,
    tier: "weak",
    poison: 0,
    bleed: 0,
    weaken: 0,
    skip: false,
    raging: false,
    halfEnraged: false,
    poisonTicked: false,
    bleedTicked: false,
    poisonOnHit: 0,
    pierce: 0,
    enrageAtHalf: 0,
    rageAt: 0,
    rageBonus: 0,
    rageCleave: false,
    rageDouble: false,
    form: 1,
    forms: 1,
    formName: "",
    alwaysCleave: false,
    alwaysDouble: false,
    boss: false,
    final: false,
    staggered: false,
    formLock: false,
    intent: "full",
    intentTargetId: null,
  };
}

describe("boss stagger", () => {
  it("a form change on the hero turn skips the boss's next strike", () => {
    let run = enterBoss(["knight", "paladin"], 21);
    const boss = () => run.enemies[0]!;
    boss().hp = 1;
    boss().armor = 0;
    run.hand = [{ uid: "hit", cardId: "k-strike" }];
    const played = playCard(run, "hit", boss().uid);
    run = played.run;
    assert.equal(boss().form, 2);
    assert.equal(boss().formName, "Oathbroken");
    assert.equal(boss().hp, boss().maxHp);
    assert.equal(boss().skip, true);
    assert.equal(boss().staggered, true);
    assert.equal(enemyIntent(boss(), run.round), "Staggered");
    assert.equal(
      played.events.some((e) => e.banner === "Grim Warden is STAGGERED! Oathbroken — the party strikes first." && e.shake),
      true,
    );

    assert.equal(run.phase, "battle");
    const weaken = boss().weaken;
    run.hand = [{ uid: "ent", cardId: "d-entangle" }];
    run = playCard(run, "ent", boss().uid).run;
    assert.equal(boss().weaken, weaken + 2);
    assert.equal(boss().skip, true);
    assert.equal(boss().staggered, true);
    assert.equal(
      run.log.some((line) => line.includes("already staggered")),
      true,
    );

    run.enemies.push(quietAdd(boss()));
    for (const hero of run.party) {
      hero.def = 0;
      hero.defBuff = 0;
      hero.block = 0;
      hero.poison = 0;
    }
    const before = run.party.reduce((sum, hero) => sum + hero.hp, 0);
    run = stepEnemies(run).run;
    assert.equal(
      run.party.reduce((sum, hero) => sum + hero.hp, 0),
      before,
    );
    assert.equal(boss().staggered, false);
    assert.equal(boss().skip, false);
    assert.equal(
      run.log.some((line) => line === "Grim Warden is still reeling from its transformation."),
      true,
    );

    run = stepEnemies(run).run;
    assert.equal(
      run.party.reduce((sum, hero) => sum + hero.hp, 0),
      before - 7,
    );
  });

  it("a form change from a poison tick skips the next strike", () => {
    let run = enterBoss(["knight"], 22);
    const boss = () => run.enemies[0]!;
    boss().hp = 4;
    boss().poison = 30;
    boss().poisonTicked = false;
    boss().bleed = 0;
    run.phase = "enemy";
    run.beat = "poison";
    run.strikeIndex = 0;
    run.strikeHitsLeft = 0;
    const hero = run.party[0]!;
    hero.def = 0;
    hero.defBuff = 0;
    hero.block = 0;
    const before = hero.hp;
    const ticked = stepEnemies(run);
    run = ticked.run;
    assert.equal(boss().form, 2);
    assert.equal(boss().hp, boss().maxHp);
    assert.equal(boss().staggered, true);
    assert.equal(boss().skip, true);
    assert.equal(run.party[0]!.hp, before);
    assert.equal(
      ticked.events.some((e) => e.banner === "Grim Warden is STAGGERED! Oathbroken — the party strikes first."),
      true,
    );

    let guard = 0;
    while (boss().staggered && run.phase === "enemy" && guard++ < 6) run = stepEnemies(run).run;
    assert.equal(boss().staggered, false);
    assert.equal(run.party[0]!.hp, before);
    assert.equal(
      run.log.some((line) => line === "Grim Warden is still reeling from its transformation."),
      true,
    );
  });

  it("one big hit advances a single form, at full health, and staggers once", () => {
    let run = enterBoss(["knight"], 23);
    const boss = () => run.enemies[0]!;
    const hero = run.party[0]!;
    hero.atk = 400;
    hero.atkBuff = 0;
    boss().hp = 5;
    boss().armor = 0;
    run.hand = [{ uid: "hit", cardId: "k-strike" }];
    run = playCard(run, "hit", boss().uid).run;
    assert.equal(boss().form, 2);
    assert.equal(boss().hp, boss().maxHp);
    assert.equal(boss().staggered, true);
    assert.equal(boss().skip, true);

    run = enterBoss(["knight"], 24);
    const again = () => run.enemies[0]!;
    run.party[0]!.atk = 400;
    run.party[0]!.atkBuff = 0;
    again().hp = 5;
    again().armor = 0;
    run.hand = [{ uid: "ks", cardId: "r-killstroke" }];
    run = playCard(run, "ks", again().uid).run;
    assert.equal(again().form, 2);
    assert.notEqual(again().form, 3);
    assert.equal(again().staggered, true);
    assert.equal(again().skip, true);
    assert.ok(again().hp > 0);
  });
});
