export interface RunSummaryDTO {
  readonly phaseNumber: number;
  readonly runCoins: number;
  readonly survivingTroopers: number;
  readonly goldMultiplier: number;
  readonly finalGold: number;
  readonly nextPhase: number | null;
}
