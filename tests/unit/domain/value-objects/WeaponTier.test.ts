import { describe, expect, it } from 'vitest';
import { WeaponTier } from '@domain/value-objects/WeaponTier';
import { WeaponTierValue } from '@domain/value-objects/WeaponTierValue';

describe('WeaponTier', () => {
  it('defines exactly five ascending tiers', () => {
    expect(WeaponTier.ServicePistol).toBe(1);
    expect(WeaponTier.DualSmgs).toBe(2);
    expect(WeaponTier.CombatShotgun).toBe(3);
    expect(WeaponTier.AssaultRifle).toBe(4);
    expect(WeaponTier.RocketLauncher).toBe(5);
  });

  it('creates a value object from a tier', () => {
    const tier = WeaponTierValue.from(WeaponTier.CombatShotgun);

    expect(tier.level).toBe(3);
    expect(tier.tier).toBe(WeaponTier.CombatShotgun);
    expect(tier.isMax).toBe(false);
  });

  it('advances one tier at a time and caps at maximum', () => {
    let tier = WeaponTierValue.servicePistol();

    expect(tier.next().level).toBe(2);
    expect(tier.next().next().next().next().level).toBe(5);

    for (let index = 0; index < 10; index += 1) {
      tier = tier.next();
    }

    expect(tier.level).toBe(5);
    expect(tier.isMax).toBe(true);
    expect(tier.next().equals(tier)).toBe(true);
  });

  it('rejects tiers outside the supported range', () => {
    expect(() => WeaponTierValue.from(0 as WeaponTier)).toThrow(RangeError);
    expect(() => WeaponTierValue.from(6 as WeaponTier)).toThrow(RangeError);
    expect(() => WeaponTierValue.from(2.5 as WeaponTier)).toThrow(RangeError);
  });
});
