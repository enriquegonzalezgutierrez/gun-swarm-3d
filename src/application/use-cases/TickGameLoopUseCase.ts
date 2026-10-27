import type { PhysicsPort } from '../ports/driven/PhysicsPort';
import type { RenderPort } from '../ports/driven/RenderPort';
import type { GameSystem } from '../ports/driving/GameSystem';

const MAX_FRAME_DELTA_SECONDS = 0.1;

export class TickGameLoopUseCase {
  private lastTimestampMilliseconds: number | null = null;

  public constructor(
    private readonly systems: readonly GameSystem[],
    private readonly physics: PhysicsPort,
    private readonly render: RenderPort,
  ) {}

  public execute(timestampMilliseconds: number): void {
    if (!Number.isFinite(timestampMilliseconds) || timestampMilliseconds < 0) {
      throw new RangeError('Game loop timestamp must be a non-negative number.');
    }
    const deltaTimeSeconds = this.computeDelta(timestampMilliseconds);
    this.lastTimestampMilliseconds = timestampMilliseconds;
    this.physics.step(deltaTimeSeconds);
    for (const system of this.systems) {
      system.update(deltaTimeSeconds);
    }
    this.render.render();
  }

  public reset(): void {
    this.lastTimestampMilliseconds = null;
  }

  private computeDelta(timestampMilliseconds: number): number {
    if (this.lastTimestampMilliseconds === null) {
      return 0;
    }
    const elapsedSeconds = (timestampMilliseconds - this.lastTimestampMilliseconds) / 1000;
    return Math.min(MAX_FRAME_DELTA_SECONDS, Math.max(0, elapsedSeconds));
  }
}
