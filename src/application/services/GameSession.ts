import type { GameSystem } from '../ports/driving/GameSystem';
import type { Position3D } from '../../domain/value-objects/Position3D';
import type { GameSessionOptions } from './GameSessionOptions';
import { SessionHudUpdater } from './SessionHudUpdater';
import { SessionOutcomeHandler } from './SessionOutcomeHandler';
import { SessionState } from './SessionState';

const COUNTDOWN_SECONDS = 3;

export class GameSession implements GameSystem {
  private stateValue = SessionState.Idle;
  private countdownRemaining = 0;

  public constructor(private readonly options: GameSessionOptions) {}

  public get state(): SessionState {
    return this.stateValue;
  }

  public get leaderPosition(): Position3D {
    return this.options.squad.leaderPosition;
  }

  public get distanceTravelled(): number {
    return this.options.stage.distanceTravelled;
  }

  public get squadSize(): number {
    return this.options.squad.totalSize;
  }

  public start(): void {
    if (this.stateValue !== SessionState.Idle) {
      return;
    }
    this.stateValue = SessionState.Countdown;
    this.countdownRemaining = COUNTDOWN_SECONDS;
    this.options.view.showCountdown(COUNTDOWN_SECONDS);
  }

  public update(deltaTimeSeconds: number): void {
    if (!Number.isFinite(deltaTimeSeconds) || deltaTimeSeconds < 0) {
      throw new RangeError('Session delta time must be a non-negative number.');
    }
    switch (this.stateValue) {
      case SessionState.Countdown:
        this.updateCountdown(deltaTimeSeconds);
        break;
      case SessionState.Running:
        this.updateRunning(deltaTimeSeconds);
        break;
      case SessionState.Boss:
        this.updateBoss(deltaTimeSeconds);
        break;
      default:
        break;
    }
  }

  public dispose(): void {
    this.options.world.dispose();
  }

  private updateCountdown(deltaTimeSeconds: number): void {
    this.countdownRemaining -= deltaTimeSeconds;
    if (this.countdownRemaining <= 0) {
      this.stateValue = SessionState.Running;
      this.options.view.showRunning();
      this.updateHud();
      return;
    }
    this.options.view.showCountdown(Math.ceil(this.countdownRemaining));
  }

  private updateRunning(deltaTimeSeconds: number): void {
    const { world, squad, stage, content, view } = this.options;
    world.update(deltaTimeSeconds, true);
    this.updateHud();
    if (squad.isWiped) {
      this.finishDefeat();
      return;
    }
    if (stage.hasReachedBossArena) {
      this.stateValue = SessionState.Boss;
      view.updateBossHealth(content.boss.health.current, content.boss.health.max);
    }
  }

  private updateBoss(deltaTimeSeconds: number): void {
    const { world, squad, content, view } = this.options;
    world.update(deltaTimeSeconds, false);
    world.approachBoss(deltaTimeSeconds);
    this.updateHud();
    view.updateBossHealth(content.boss.health.current, content.boss.health.max);
    if (content.boss.isDefeated) {
      this.finishVictory();
      return;
    }
    if (content.boss.position.z <= squad.leaderPosition.z + 2 || squad.isWiped) {
      this.finishDefeat();
    }
  }

  private updateHud(): void {
    SessionHudUpdater.updateFromOptions(
      this.options,
      this.stateValue === SessionState.Boss,
    );
  }

  private finishVictory(): void {
    if (this.stateValue === SessionState.Victory) {
      return;
    }
    this.stateValue = SessionState.Victory;
    SessionOutcomeHandler.victory(this.options);
  }

  private finishDefeat(): void {
    if (this.stateValue === SessionState.Defeat) {
      return;
    }
    this.stateValue = SessionState.Defeat;
    SessionOutcomeHandler.defeat(
      this.options,
      this.options.world.destroyedObstacles,
    );
  }
}
