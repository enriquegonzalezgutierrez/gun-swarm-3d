import { describe, expect, it } from 'vitest';
import { ResolveCollisionsUseCase } from '@application/use-cases/ResolveCollisionsUseCase';
import { SquadAggregate } from '@domain/aggregates/SquadAggregate';
import { GateLane } from '@domain/entities/GateLane';
import { GateOperation } from '@domain/entities/GateOperation';
import { MathGate } from '@domain/entities/MathGate';
import { Trooper } from '@domain/entities/Trooper';
import { Position3D } from '@domain/value-objects/Position3D';
import { FakePhysicsPort } from '../../../fixtures/FakePhysicsPort';

function createSquad(trooperCount: number): SquadAggregate {
  const squad = new SquadAggregate(
    'squad-1',
    new Trooper('leader-1', Position3D.zero()),
  );
  for (let index = 0; index < trooperCount; index += 1) {
    squad.addTrooper(
      new Trooper(`trooper-${index}`, new Position3D(index + 1, 0, 0)),
    );
  }
  return squad;
}

function createGate(
  id: string,
  operation: GateOperation,
  value: number,
  lane = GateLane.Left,
  z = 10,
): MathGate {
  return new MathGate(id, operation, value, lane, new Position3D(0, 0, z));
}

describe('ResolveCollisionsUseCase — gates', () => {
  it('applies an additive gate and consumes its sibling', () => {
    const physics = new FakePhysicsPort();
    const useCase = new ResolveCollisionsUseCase(physics);
    const squad = createSquad(2);
    const left = createGate('gate-left', GateOperation.Add, 5, GateLane.Left);
    const right = createGate('gate-right', GateOperation.Multiply, 2, GateLane.Right);
    physics.queryOverlaps.mockImplementation((id) =>
      id === 'gate-left' ? ['leader-1'] : [],
    );

    useCase.execute(squad, [left, right], new Map(), new Map());

    expect(squad.totalSize).toBe(8);
    expect(squad.trooperCount).toBe(7);
    expect(left.isActive).toBe(false);
    expect(right.isActive).toBe(false);
  });

  it('applies multiplicative gates', () => {
    const physics = new FakePhysicsPort();
    const useCase = new ResolveCollisionsUseCase(physics);
    const squad = createSquad(2);
    const gate = createGate('gate-1', GateOperation.Multiply, 2);
    physics.queryOverlaps.mockReturnValue(['leader-1']);

    useCase.execute(squad, [gate], new Map(), new Map());

    expect(squad.totalSize).toBe(6);
    expect(squad.trooperCount).toBe(5);
  });

  it('removes troopers without eliminating the leader', () => {
    const physics = new FakePhysicsPort();
    const useCase = new ResolveCollisionsUseCase(physics);
    const squad = createSquad(3);
    const gate = createGate('gate-1', GateOperation.Subtract, 2);
    physics.queryOverlaps.mockReturnValue(['leader-1']);

    useCase.execute(squad, [gate], new Map(), new Map());

    expect(squad.totalSize).toBe(2);
    expect(squad.trooperCount).toBe(1);

    const loneSquad = createSquad(0);
    useCase.execute(loneSquad, [createGate('gate-2', GateOperation.Subtract, 9)], new Map(), new Map());
    expect(loneSquad.totalSize).toBe(1);
    expect(loneSquad.isWiped).toBe(false);
  });

  it('applies division gates with floor rounding', () => {
    const physics = new FakePhysicsPort();
    const useCase = new ResolveCollisionsUseCase(physics);
    const squad = createSquad(3);
    const gate = createGate('gate-1', GateOperation.Divide, 2);
    physics.queryOverlaps.mockReturnValue(['leader-1']);

    useCase.execute(squad, [gate], new Map(), new Map());

    expect(squad.totalSize).toBe(2);
    expect(squad.trooperCount).toBe(1);
  });

  it('ignores inactive gates, dead troopers and missing overlaps', () => {
    const physics = new FakePhysicsPort();
    const useCase = new ResolveCollisionsUseCase(physics);
    const squad = createSquad(2);
    const inactive = createGate('gate-1', GateOperation.Add, 5);
    inactive.consume();
    const deadTrooperGate = createGate('gate-2', GateOperation.Add, 5, GateLane.Left, 20);
    squad.killTrooper('trooper-0');
    physics.queryOverlaps.mockImplementation((id) =>
      id === 'gate-2' ? ['trooper-0'] : [],
    );

    useCase.execute(squad, [inactive, deadTrooperGate], new Map(), new Map());

    expect(squad.totalSize).toBe(2);
  });
});
