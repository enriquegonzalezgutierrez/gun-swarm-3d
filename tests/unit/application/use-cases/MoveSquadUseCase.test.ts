import { describe, expect, it } from 'vitest';
import { MoveSquadUseCase } from '@application/use-cases/MoveSquadUseCase';
import type { InputPort } from '@application/ports/driven/InputPort';
import { SquadAggregate } from '@domain/aggregates/SquadAggregate';
import { StageAggregate } from '@domain/aggregates/StageAggregate';
import { Trooper } from '@domain/entities/Trooper';
import { Position3D } from '@domain/value-objects/Position3D';

class FakeInputPort implements InputPort {
  public delta = 0;
  public resetCount = 0;

  public getNormalizedLateralDelta(): number {
    return this.delta;
  }

  public resetDelta(): void {
    this.resetCount += 1;
  }

  public isActionTriggered(): boolean {
    return false;
  }
}

function createSquad(x = 0): SquadAggregate {
  const leader = new Trooper('leader-1', new Position3D(x, 0, 0));
  return new SquadAggregate('squad-1', leader);
}

describe('MoveSquadUseCase', () => {
  it('moves the leader with transfer and smoothing', () => {
    const input = new FakeInputPort();
    const squad = createSquad();
    const stage = new StageAggregate(1, 220);
    const useCase = new MoveSquadUseCase(input, squad, stage);
    input.delta = 1;

    const position = useCase.execute();

    expect(position.y).toBe(0);
    expect(position.z).toBe(0);
    expect(position.x).toBeCloseTo(0.0875, 10);
    expect(squad.leaderPosition.equals(position)).toBe(true);
  });

  it('consumes the input delta after each frame', () => {
    const input = new FakeInputPort();
    const useCase = new MoveSquadUseCase(input, createSquad(), new StageAggregate(1, 220));
    input.delta = 1;

    useCase.execute();

    expect(input.resetCount).toBe(1);
  });

  it('moves left for negative input', () => {
    const input = new FakeInputPort();
    const squad = createSquad();
    const useCase = new MoveSquadUseCase(input, squad, new StageAggregate(1, 220));
    input.delta = -1;

    const position = useCase.execute();

    expect(position.x).toBeCloseTo(-0.0875, 10);
  });

  it('clamps the normalized input and track boundaries', () => {
    const input = new FakeInputPort();
    const squad = createSquad(4.5);
    const useCase = new MoveSquadUseCase(input, squad, new StageAggregate(1, 220));
    input.delta = 1000;

    const position = useCase.execute();

    expect(position.x).toBe(4.5);
    expect(squad.leaderPosition.x).toBe(4.5);
  });

  it('keeps the leader stationary without input', () => {
    const input = new FakeInputPort();
    const squad = createSquad(2);
    const useCase = new MoveSquadUseCase(input, squad, new StageAggregate(1, 220));

    const position = useCase.execute();

    expect(position.equals(new Position3D(2, 0, 0))).toBe(true);
  });

  it('rejects non-finite input values', () => {
    const input = new FakeInputPort();
    const useCase = new MoveSquadUseCase(input, createSquad(), new StageAggregate(1, 220));
    input.delta = Number.NaN;

    expect(() => useCase.execute()).toThrow(RangeError);
  });
});
