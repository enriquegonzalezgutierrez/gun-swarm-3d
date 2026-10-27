import type { SquadAggregate } from '../../domain/aggregates/SquadAggregate';
import type { StageAggregate } from '../../domain/aggregates/StageAggregate';
import type { PhaseConfig } from '../dtos/PhaseConfig';
import type { GameStateDTO } from '../dtos/GameStateDTO';
import type { RunStatsDTO } from '../dtos/RunStatsDTO';
import type { RunSummaryDTO } from '../dtos/RunSummaryDTO';
import type { PhaseContent } from './PhaseContent';

export class SessionSnapshotFactory {
  public static state(
    config: PhaseConfig,
    squad: SquadAggregate,
    stage: StageAggregate,
    content: PhaseContent,
    gold: number,
    shieldSeconds: number,
    bossActive: boolean,
  ): GameStateDTO {
    return {
      squadSize: squad.totalSize,
      weaponTier: squad.weaponTier,
      gold,
      distanceTravelled: stage.distanceTravelled,
      phaseNumber: config.phaseNumber,
      progressRatio: stage.progressRatio,
      bossHealth: bossActive ? content.boss.health.current : null,
      bossMaxHealth: bossActive ? content.boss.health.max : null,
      isBossDefeated: content.boss.isDefeated,
      isSquadWiped: squad.isWiped,
      shieldSeconds,
    };
  }

  public static victory(
    config: PhaseConfig,
    squad: SquadAggregate,
    runCoins: number,
  ): RunSummaryDTO {
    const survivingTroopers = squad.totalSize;
    return {
      phaseNumber: config.phaseNumber,
      runCoins,
      survivingTroopers,
      goldMultiplier: config.phaseNumber,
      finalGold: runCoins + survivingTroopers * 10 * config.phaseNumber,
      nextPhase: config.nextPhase,
    };
  }

  public static defeat(
    config: PhaseConfig,
    squad: SquadAggregate,
    stage: StageAggregate,
    destroyedObstacles: number,
    goldCollected: number,
  ): RunStatsDTO {
    return {
      phaseNumber: config.phaseNumber,
      distanceTravelled: stage.distanceTravelled,
      destroyedObstacles,
      goldCollected,
      survivingTroopers: squad.totalSize,
    };
  }
}
