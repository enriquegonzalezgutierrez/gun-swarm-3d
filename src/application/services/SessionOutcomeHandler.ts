import type { GameSessionOptions } from './GameSessionOptions';
import { SessionSnapshotFactory } from './SessionSnapshotFactory';

export class SessionOutcomeHandler {
  public static victory(options: GameSessionOptions): void {
    options.view.hideBossHealth();
    const summary = SessionSnapshotFactory.victory(
      options.config,
      options.squad,
      options.world.collectedGold,
    );
    options.onVictory(summary);
    options.view.showVictory(summary);
  }

  public static defeat(
    options: GameSessionOptions,
    destroyedObstacles: number,
  ): void {
    options.view.hideBossHealth();
    const stats = SessionSnapshotFactory.defeat(
      options.config,
      options.squad,
      options.stage,
      destroyedObstacles,
      options.world.collectedGold,
    );
    options.onDefeat(stats);
    options.view.showDefeat(stats);
  }
}
