import { describe, expect, it } from 'vitest';
import { PhaseCatalog } from '@infrastructure/levels/PhaseCatalog';
import { WeaponTier } from '@domain/value-objects/WeaponTier';

const EXPECTED = [
  [1, 'Metropolis Boulevard', 'War Rig', 200, 220, WeaponTier.ServicePistol],
  [2, 'Scorched Canyon', 'Dread Chopper', 450, 250, WeaponTier.DualSmgs],
  [3, 'Toxic Foundry', 'Spider Mech', 800, 280, WeaponTier.CombatShotgun],
  [4, 'Arctic Fortress', 'Frost Behemoth', 1400, 300, WeaponTier.AssaultRifle],
  [5, 'Cyber Void', 'Dread Nexus', 2500, 350, WeaponTier.RocketLauncher],
] as const;

describe('PhaseCatalog', () => {
  it.each(EXPECTED)(
    'configures phase %i',
    (phaseNumber, name, bossName, bossHealth, trackLength, tier) => {
      const config = PhaseCatalog.get(phaseNumber);

      expect(config.phaseNumber).toBe(phaseNumber);
      expect(config.name).toBe(name);
      expect(config.biomeId).toBe(phaseNumber);
      expect(config.bossName).toBe(bossName);
      expect(config.bossMaxHealth).toBe(bossHealth);
      expect(config.trackLength).toBe(trackLength);
      expect(config.startingWeaponTier).toBe(tier);
      expect(config.nextPhase).toBe(phaseNumber < 5 ? phaseNumber + 1 : null);
    },
  );

  it('returns all phases in ascending order', () => {
    const phases = PhaseCatalog.getAll();

    expect(phases).toHaveLength(5);
    expect(phases.map((phase) => phase.phaseNumber)).toEqual([1, 2, 3, 4, 5]);
  });

  it('rejects invalid phase numbers', () => {
    expect(() => PhaseCatalog.get(0)).toThrow(RangeError);
    expect(() => PhaseCatalog.get(6)).toThrow(RangeError);
    expect(() => PhaseCatalog.get(2.5)).toThrow(RangeError);
  });
});
