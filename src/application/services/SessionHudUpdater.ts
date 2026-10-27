import type { SquadAggregate } from '../../domain/aggregates/SquadAggregate';
import type { StageAggregate } from '../../domain/aggregates/StageAggregate';
import type { PhaseConfig } from '../dtos/PhaseConfig';
import type { GameViewPort } from '../ports/driven/GameViewPort';
import type { GameSessionOptions } from './GameSessionOptions';
import type { PhaseContent } from './PhaseContent';
import { SessionSnapshotFactory } from './SessionSnapshotFactory';
import type { WorldRunner } from './WorldRunner';

export class SessionHudUpdater {
  public static updateFromOptions(
    options: GameSessionOptions,
    bossActive: boolean,
  ): void {
    SessionHudUpdater.update(
      options.view,
      options.config,
      options.squad,
      options.stage,
      options.content,
      options.world,
      bossActive,
    );
  }

  public static update(
    view: GameViewPort,
    config: PhaseConfig,
    squad: SquadAggregate,
    stage: StageAggregate,
    content: PhaseContent,
    world: WorldRunner,
    bossActive: boolean,
  ): void {
    view.updateHud(
      SessionSnapshotFactory.state(
        config,
        squad,
        stage,
        content,
        world.collectedGold,
        world.shieldSeconds,
        bossActive,
      ),
    );
  }
}
