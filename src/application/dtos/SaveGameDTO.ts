import type { UpgradeStateDTO } from './UpgradeStateDTO';

export interface SaveGameDTO {
  readonly version: number;
  readonly currency: {
    readonly gold: number;
  };
  readonly upgrades: {
    readonly startingSquadSize: UpgradeStateDTO;
    readonly baseDamageMultiplier: UpgradeStateDTO;
    readonly coinMultiplier: UpgradeStateDTO;
  };
  readonly progression: {
    readonly highestUnlockedPhase: number;
    readonly lastPlayedPhase: number;
  };
}
