import type { InputPort } from '../ports/driven/InputPort';
import type { SquadAggregate } from '../../domain/aggregates/SquadAggregate';
import type { StageAggregate } from '../../domain/aggregates/StageAggregate';
import { LateralMovementEngine } from '../../domain/services/LateralMovementEngine';
import type { Position3D } from '../../domain/value-objects/Position3D';

export class MoveSquadUseCase {
  public constructor(
    private readonly input: InputPort,
    private readonly squad: SquadAggregate,
    private readonly stage: StageAggregate,
  ) {}

  public execute(): Position3D {
    const rawDelta = this.input.getNormalizedLateralDelta();
    this.input.resetDelta();
    if (!Number.isFinite(rawDelta)) {
      throw new RangeError('MoveSquad input delta must be a finite number.');
    }
    const inputDelta = Math.min(1, Math.max(-1, rawDelta));
    const currentPosition = this.squad.leaderPosition;
    const nextX = LateralMovementEngine.computeNextX(
      currentPosition.x,
      inputDelta,
      this.stage.minLateralX,
      this.stage.maxLateralX,
    );
    const nextPosition = currentPosition.withX(nextX);
    this.squad.moveLeaderTo(nextPosition);
    return nextPosition;
  }
}
