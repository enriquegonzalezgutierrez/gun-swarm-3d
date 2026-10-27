import { describe, expect, it } from 'vitest';
import { Pickup } from '@domain/entities/Pickup';
import { PickupType } from '@domain/entities/PickupType';
import { Position3D } from '@domain/value-objects/Position3D';

describe('Pickup', () => {
  it('collects a gold coin once', () => {
    const coin = new Pickup('coin-1', PickupType.GoldCoin, Position3D.zero());

    expect(coin.isCollected).toBe(false);
    expect(coin.collect()).toBe(1);
    expect(coin.isCollected).toBe(true);
    expect(() => coin.collect()).toThrow(Error);
  });

  it('carries a weapon chest tier increment', () => {
    const chest = new Pickup('chest-1', PickupType.WeaponChest, Position3D.zero(), 1);

    expect(chest.value).toBe(1);
    expect(chest.collect()).toBe(1);
  });

  it('carries a shield duration', () => {
    const shield = new Pickup('shield-1', PickupType.ShieldOrb, Position3D.zero(), 3.5);

    expect(shield.type).toBe(PickupType.ShieldOrb);
    expect(shield.collect()).toBe(3.5);
  });

  it('rejects invalid values and identifiers', () => {
    expect(() => new Pickup('', PickupType.GoldCoin, Position3D.zero())).toThrow(
      RangeError,
    );
    expect(
      () => new Pickup('coin-1', PickupType.GoldCoin, Position3D.zero(), -1),
    ).toThrow(RangeError);
  });
});
