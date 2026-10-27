import { WeaponTier } from '../../domain/value-objects/WeaponTier';
import { BiomeRegistry } from '../../infrastructure/biomes/BiomeRegistry';
import type { PhaseConfig } from '../../application/dtos/PhaseConfig';

const BOSSES: ReadonlyArray<readonly [string, number]> = [
  ['War Rig', 200],
  ['Dread Chopper', 450],
  ['Spider Mech', 800],
  ['Frost Behemoth', 1400],
  ['Dread Nexus', 2500],
];

const STARTING_TIERS: readonly WeaponTier[] = [
  WeaponTier.ServicePistol,
  WeaponTier.DualSmgs,
  WeaponTier.CombatShotgun,
  WeaponTier.AssaultRifle,
  WeaponTier.RocketLauncher,
];

export class PhaseCatalog {
  public static get(phaseNumber: number): PhaseConfig {
    if (!Number.isInteger(phaseNumber) || phaseNumber < 1 || phaseNumber > 5) {
      throw new RangeError('Phase number must be an integer between 1 and 5.');
    }
    const biome = BiomeRegistry.get(phaseNumber);
    const boss = BOSSES[phaseNumber - 1];
    const startingTier = STARTING_TIERS[phaseNumber - 1];
    if (boss === undefined || startingTier === undefined) {
      throw new Error(`Missing phase configuration for phase ${phaseNumber}.`);
    }
    return {
      phaseNumber,
      name: biome.name,
      biomeId: biome.id,
      trackLength: biome.trackLength,
      startingWeaponTier: startingTier,
      bossName: boss[0],
      bossMaxHealth: boss[1],
      nextPhase: phaseNumber < 5 ? phaseNumber + 1 : null,
    };
  }

  public static getAll(): readonly PhaseConfig[] {
    return [1, 2, 3, 4, 5].map((phaseNumber) => PhaseCatalog.get(phaseNumber));
  }
}
