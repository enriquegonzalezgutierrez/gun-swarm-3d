import type { GameStateDTO } from '../../dtos/GameStateDTO';
import type { RunStatsDTO } from '../../dtos/RunStatsDTO';
import type { RunSummaryDTO } from '../../dtos/RunSummaryDTO';

export interface GameViewPort {
  updateHud(state: GameStateDTO): void;
  showCountdown(value: number): void;
  showRunning(): void;
  showVictory(summary: RunSummaryDTO): void;
  showDefeat(stats: RunStatsDTO): void;
  updateBossHealth(current: number, max: number): void;
  hideBossHealth(): void;
}
