import type { WeaponTier } from '../../domain/value-objects/WeaponTier';

export interface PhaseConfig {
  readonly phaseNumber: number;
  readonly name: string;
  readonly biomeId: number;
  readonly trackLength: number;
  readonly startingWeaponTier: WeaponTier;
  readonly bossName: string;
  readonly bossMaxHealth: number;
  readonly nextPhase: number | null;
}
