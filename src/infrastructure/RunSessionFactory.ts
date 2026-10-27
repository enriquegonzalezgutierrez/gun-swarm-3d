import type { InputPort } from '../application/ports/driven/InputPort';
import type { PhysicsPort } from '../application/ports/driven/PhysicsPort';
import type { RenderPort } from '../application/ports/driven/RenderPort';
import type { GameViewPort } from '../application/ports/driven/GameViewPort';
import type { PhaseConfig } from '../application/dtos/PhaseConfig';
import type { RunStatsDTO } from '../application/dtos/RunStatsDTO';
import type { RunSummaryDTO } from '../application/dtos/RunSummaryDTO';
import type { SaveGameDTO } from '../application/dtos/SaveGameDTO';
import { ProcessCombatUseCase } from '../application/use-cases/ProcessCombatUseCase';
import { ResolveCollisionsUseCase } from '../application/use-cases/ResolveCollisionsUseCase';
import { MoveSquadUseCase } from '../application/use-cases/MoveSquadUseCase';
import { GameSession } from '../application/services/GameSession';
import { PhaseContentFactory } from '../application/services/PhaseContentFactory';
import { PhaseContentView } from '../application/services/PhaseContentView';
import { SquadPresenter } from '../application/services/SquadPresenter';
import { WorldRunner } from '../application/services/WorldRunner';
import { SquadAggregate } from '../domain/aggregates/SquadAggregate';
import { StageAggregate } from '../domain/aggregates/StageAggregate';
import { Trooper } from '../domain/entities/Trooper';
import { Position3D } from '../domain/value-objects/Position3D';

export class RunSessionFactory {
  public constructor(
    private readonly render: RenderPort,
    private readonly physics: PhysicsPort,
    private readonly input: InputPort,
    private readonly view: GameViewPort,
  ) {}

  public create(
    config: PhaseConfig,
    save: SaveGameDTO,
    onVictory: (summary: RunSummaryDTO) => void,
    onDefeat: (stats: RunStatsDTO) => void,
  ): GameSession {
    const content = new PhaseContentFactory().create(config);
    const squad = this.createSquad(config, save);
    const stage = new StageAggregate(config.phaseNumber, config.trackLength, content.boss);
    const moveSquad = new MoveSquadUseCase(this.input, squad, stage);
    const processCombat = new ProcessCombatUseCase(this.physics, this.render);
    const resolveCollisions = new ResolveCollisionsUseCase(this.physics);
    const squadPresenter = new SquadPresenter(this.render, this.physics);
    const contentView = new PhaseContentView(this.render, this.physics);
    this.input.resetDelta();
    contentView.spawn(content, config.phaseNumber);
    squadPresenter.sync(squad);
    this.render.updateCameraTarget(squad.leaderPosition);
    const world = new WorldRunner({
      squad,
      stage,
      content,
      render: this.render,
      moveSquad,
      processCombat,
      resolveCollisions,
      squadPresenter,
      contentView,
    });
    return new GameSession({
      config,
      squad,
      stage,
      content,
      world,
      view: this.view,
      onVictory,
      onDefeat,
    });
  }

  private createSquad(config: PhaseConfig, save: SaveGameDTO): SquadAggregate {
    const leader = new Trooper('leader-1', Position3D.zero());
    const squad = new SquadAggregate(
      `squad-${config.phaseNumber}`,
      leader,
      config.startingWeaponTier,
    );
    const upgrade = save.upgrades.startingSquadSize;
    const count = Math.max(
      0,
      Math.round(upgrade.baseValue + upgrade.step * (upgrade.level - 1)),
    );
    for (let index = 0; index < count; index += 1) {
      const x = ((index % 3) - 1) * 0.8;
      const z = -0.6 - Math.floor(index / 3) * 0.7;
      squad.addTrooper(
        new Trooper(`meta-trooper-${index}`, new Position3D(x, 0, z)),
      );
    }
    return squad;
  }
}
