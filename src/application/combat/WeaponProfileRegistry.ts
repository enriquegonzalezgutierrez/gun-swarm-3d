import { WeaponTier } from '../../domain/value-objects/WeaponTier';
import type { WeaponProfile } from './WeaponProfile';

const PROFILES: Readonly<Record<WeaponTier, WeaponProfile>> = {
  [WeaponTier.ServicePistol]: {
    fireRate: 2.5,
    damage: 1,
    projectileSpeed: 45,
    penetration: 0,
  },
  [WeaponTier.DualSmgs]: {
    fireRate: 6,
    damage: 1,
    projectileSpeed: 50,
    penetration: 0,
  },
  [WeaponTier.CombatShotgun]: {
    fireRate: 1.4,
    damage: 2.5,
    projectileSpeed: 40,
    penetration: 0,
  },
  [WeaponTier.AssaultRifle]: {
    fireRate: 4.5,
    damage: 2,
    projectileSpeed: 55,
    penetration: 1,
  },
  [WeaponTier.RocketLauncher]: {
    fireRate: 0.8,
    damage: 15,
    projectileSpeed: 30,
    penetration: 0,
  },
};

export class WeaponProfileRegistry {
  public static forTier(tier: WeaponTier): WeaponProfile {
    return PROFILES[tier];
  }
}
