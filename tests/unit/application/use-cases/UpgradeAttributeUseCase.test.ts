import { describe, expect, it } from 'vitest';
import { UpgradeAttributeUseCase } from '@application/use-cases/UpgradeAttributeUseCase';
import { createDefaultSave } from '../../../fixtures/SaveGameFixture';

function createSaveWithGold(gold: number): ReturnType<typeof createDefaultSave> {
  const save = createDefaultSave();
  return { ...save, currency: { gold } };
}

describe('UpgradeAttributeUseCase', () => {
  it('calculates the exponential cost curve', () => {
    const useCase = new UpgradeAttributeUseCase();
    const save = createDefaultSave();

    expect(useCase.calculateCost('startingSquadSize', 1)).toBe(100);
    expect(useCase.calculateCost('startingSquadSize', 2)).toBe(145);
    expect(useCase.calculateCost('startingSquadSize', 3)).toBe(210);
    expect(useCase.calculateCost('baseDamageMultiplier', 1)).toBe(150);
    expect(useCase.calculateCost('coinMultiplier', 1)).toBe(80);
    expect(save.upgrades.startingSquadSize.level).toBe(1);
  });

  it('deducts gold and increments the upgrade level', () => {
    const useCase = new UpgradeAttributeUseCase();
    const save = createSaveWithGold(500);

    const upgraded = useCase.execute(save, 'startingSquadSize');

    expect(upgraded.currency.gold).toBe(400);
    expect(upgraded.upgrades.startingSquadSize.level).toBe(2);
    expect(upgraded.upgrades.baseDamageMultiplier.level).toBe(1);
    expect(upgraded.progression).toEqual(save.progression);
    expect(save.currency.gold).toBe(500);
    expect(save.upgrades.startingSquadSize.level).toBe(1);
  });

  it('rejects upgrades without enough gold', () => {
    const useCase = new UpgradeAttributeUseCase();
    const save = createSaveWithGold(50);

    expect(() => useCase.execute(save, 'startingSquadSize')).toThrow(Error);
  });

  it('rejects upgrades beyond the maximum level', () => {
    const useCase = new UpgradeAttributeUseCase();
    const save = createDefaultSave();
    const maxed = {
      ...save,
      upgrades: {
        ...save.upgrades,
        coinMultiplier: { ...save.upgrades.coinMultiplier, level: 10 },
      },
      currency: { gold: 100000 },
    };

    expect(() => useCase.execute(maxed, 'coinMultiplier')).toThrow(Error);
    expect(() => useCase.calculateCost('coinMultiplier', 10)).toThrow(Error);
  });

  it('rejects invalid levels', () => {
    const useCase = new UpgradeAttributeUseCase();

    expect(() => useCase.calculateCost('startingSquadSize', 0)).toThrow(RangeError);
    expect(() => useCase.calculateCost('startingSquadSize', 1.5)).toThrow(RangeError);
  });
});
