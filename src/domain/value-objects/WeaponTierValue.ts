import { WeaponTier } from './WeaponTier';

const MIN_TIER = WeaponTier.ServicePistol;
const MAX_TIER = WeaponTier.RocketLauncher;

export class WeaponTierValue {
  public readonly tier: WeaponTier;

  private constructor(tier: WeaponTier) {
    this.tier = tier;
  }

  public static from(tier: WeaponTier): WeaponTierValue {
    if (!Number.isInteger(tier) || tier < MIN_TIER || tier > MAX_TIER) {
      throw new RangeError('Weapon tier must be an integer between 1 and 5.');
    }
    return new WeaponTierValue(tier);
  }

  public static servicePistol(): WeaponTierValue {
    return new WeaponTierValue(WeaponTier.ServicePistol);
  }

  public get level(): number {
    return this.tier;
  }

  public get isMax(): boolean {
    return this.tier === MAX_TIER;
  }

  public next(): WeaponTierValue {
    if (this.isMax) {
      return this;
    }
    return WeaponTierValue.from((this.tier + 1) as WeaponTier);
  }

  public equals(other: WeaponTierValue): boolean {
    return this.tier === other.tier;
  }
}
