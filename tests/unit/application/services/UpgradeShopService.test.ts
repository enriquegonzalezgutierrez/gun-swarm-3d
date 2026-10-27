import { describe, expect, it } from 'vitest';
import { UpgradeShopService } from '@application/services/UpgradeShopService';
import { createDefaultSave } from '../../../fixtures/SaveGameFixture';

describe('UpgradeShopService', () => {
  it('lists every upgrade with its level and cost', () => {
    const items = new UpgradeShopService().list(createDefaultSave());

    expect(items).toHaveLength(3);
    expect(items.map((item) => item.attribute)).toEqual([
      'startingSquadSize',
      'baseDamageMultiplier',
      'coinMultiplier',
    ]);
    expect(items[0]?.label).toBe('Starting Squad');
    expect(items[0]?.cost).toBe(100);
    expect(items[1]?.cost).toBe(150);
    expect(items[2]?.cost).toBe(80);
    expect(items.every((item) => !item.affordable)).toBe(true);
  });

  it('marks affordable upgrades based on current gold', () => {
    const save = { ...createDefaultSave(), currency: { gold: 120 } };
    const items = new UpgradeShopService().list(save);

    expect(items.find((item) => item.attribute === 'startingSquadSize')?.affordable).toBe(
      true,
    );
    expect(items.find((item) => item.attribute === 'baseDamageMultiplier')?.affordable).toBe(
      false,
    );
  });

  it('marks maxed upgrades with no cost', () => {
    const save = createDefaultSave();
    const maxed = {
      ...save,
      currency: { gold: 100000 },
      upgrades: {
        ...save.upgrades,
        coinMultiplier: { ...save.upgrades.coinMultiplier, level: 10 },
      },
    };

    const item = new UpgradeShopService()
      .list(maxed)
      .find((entry) => entry.attribute === 'coinMultiplier');

    expect(item?.maxed).toBe(true);
    expect(item?.cost).toBe(0);
    expect(item?.affordable).toBe(false);
  });
});
