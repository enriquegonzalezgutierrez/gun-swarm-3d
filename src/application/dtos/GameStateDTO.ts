export interface GameStateDTO {
  readonly squadSize: number;
  readonly weaponTier: number;
  readonly gold: number;
  readonly distanceTravelled: number;
  readonly phaseNumber: number;
  readonly progressRatio: number;
  readonly bossHealth: number | null;
  readonly bossMaxHealth: number | null;
  readonly isBossDefeated: boolean;
  readonly isSquadWiped: boolean;
  readonly shieldSeconds: number;
}
