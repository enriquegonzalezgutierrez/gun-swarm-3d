import type { Damageable } from '../../domain/entities/Damageable';
import type { WorldRunnerOptions } from './WorldRunnerOptions';

const FORWARD_SPEED = 14;

export class WorldRunner {
  private readonly targets = new Map<string, Damageable>();
  private destroyedCount = 0;

  public constructor(private readonly options: WorldRunnerOptions) {
    for (const [id, obstacle] of options.content.obstacles) {
      this.targets.set(id, obstacle);
    }
    this.targets.set(options.content.boss.id, options.content.boss);
  }

  public get destroyedObstacles(): number {
    return this.destroyedCount;
  }

  public get collectedGold(): number {
    return this.options.resolveCollisions.collectedGold;
  }

  public get shieldSeconds(): number {
    return this.options.resolveCollisions.shieldSeconds;
  }

  public update(deltaTimeSeconds: number, advanceForward: boolean): void {
    const { squad, stage, content, render, moveSquad, processCombat, resolveCollisions } =
      this.options;
    moveSquad.execute();
    if (advanceForward) {
      const applied = stage.advance(FORWARD_SPEED * deltaTimeSeconds);
      squad.moveLeaderTo(squad.leaderPosition.withZ(squad.leaderPosition.z + applied));
    }
    this.options.squadPresenter.sync(squad);
    render.updateCameraTarget(squad.leaderPosition);
    processCombat.execute(squad, this.targets, deltaTimeSeconds);
    resolveCollisions.execute(squad, content.gates, content.obstacles, content.pickups);
    this.cleanup();
    this.options.contentView.syncBoss(content.boss);
  }

  public approachBoss(deltaTimeSeconds: number): void {
    this.options.content.boss.approach(deltaTimeSeconds);
    this.options.contentView.syncBoss(this.options.content.boss);
  }

  public dispose(): void {
    this.options.processCombat.dispose();
    this.options.squadPresenter.dispose();
    this.options.contentView.dispose();
  }

  private cleanup(): void {
    const { content, contentView } = this.options;
    for (const [id, obstacle] of content.obstacles) {
      if (obstacle.isDestroyed) {
        content.obstacles.delete(id);
        this.targets.delete(id);
        this.destroyedCount += 1;
      }
    }
    const active = new Set<string>();
    for (const gate of content.gates) {
      active.add(gate.id);
    }
    for (const id of content.obstacles.keys()) {
      active.add(id);
    }
    for (const id of content.pickups.keys()) {
      active.add(id);
    }
    active.add(content.boss.id);
    contentView.retain(active);
  }
}
