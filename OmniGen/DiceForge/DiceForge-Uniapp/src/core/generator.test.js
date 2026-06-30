import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { generateCharacter, modifierForScore } from './generator.js';

describe('DiceForge character generation', () => {
  it('calculates D&D ability modifiers from final ability scores', () => {
    assert.equal(modifierForScore(8), -1);
    assert.equal(modifierForScore(10), 0);
    assert.equal(modifierForScore(14), 2);
    assert.equal(modifierForScore(16), 3);
  });

  it('generates the same complete character for the same seed', () => {
    const first = generateCharacter('df-test-seed');
    const second = generateCharacter('df-test-seed');

    assert.deepEqual(first, second);
    assert.ok(first.name.full);
    assert.ok(first.race.name);
    assert.ok(first.class.name);
    assert.ok(first.background.name);
    assert.equal(Object.keys(first.abilities).length, 6);
    assert.equal(first.backstory.sentences.length, 3);
    assert.ok(first.exportText.includes(`Seed: ${first.seed}`));
  });

  it('keeps abilities internally consistent after race bonuses', () => {
    const character = generateCharacter('df-ability-check');

    for (const ability of Object.values(character.abilities)) {
      assert.equal(ability.total, ability.base + ability.bonus);
      assert.equal(ability.modifier, modifierForScore(ability.total));
      assert.equal(ability.rolls.length, 4);
      assert.equal(ability.base, ability.rolls.reduce((sum, roll) => sum + roll, 0) - ability.dropped);
    }
  });

  it('deduplicates generated proficiencies and gear', () => {
    const character = generateCharacter('df-dedupe-check');
    const proficiencyKeys = character.proficiencies.map((item) => `${item.type}:${item.name}`);
    const gearKeys = character.gear.map((item) => `${item.category}:${item.name}`);

    assert.equal(new Set(proficiencyKeys).size, proficiencyKeys.length);
    assert.equal(new Set(gearKeys).size, gearKeys.length);
  });
});
