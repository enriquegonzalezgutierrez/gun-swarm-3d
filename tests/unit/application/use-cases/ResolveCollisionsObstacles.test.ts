import { describe, expect, it } from 'vitest';
import { ResolveCollisionsUseCase } from '@application/use-cases/ResolveCollisionsUseCase';
import { SquadAggregate } from '@domain/aggregates/SquadAggregate';
import { Obstacle } from '@domain/entities/Obstacle';
import { ObstacleType } from '@domain/entities/ObstacleType';
import { Trooper } from '@domain/entities/Trooper';
import { BoundingBox3D } from '@domain/value-objects/BoundingBox3D';
import { Health } from '@domain/value-objects/Health';
import { Position3D } from '@domain/value-objects/Position3D';
import { FakePhysicsPort } from '../../../fixtures/FakePhysicsPort';

const HITBOX = BoundingBox3D.fromCenterAndSize(
  Position3D.zero(),
  new Position3D(1, 1, 1),
);

function createSquad(trooperCount = 1): SquadAggregate {
  const squad = new SquadAggregate(
    'squad-1',
    new Trooper('leader-1', Position3D.zero()),
  );
  for (let index = 0; index < trooperCount; index += 1) {
    squad.addTrooper(new Trooper(`trooper-${index}`, Position3D.zero()));
  }
  return squad;
}

function createObstacle(type: ObstacleType, health: number): Obstacle {
  return new Obstacle('obstacle-1', type, Position3D.zero(), HITBOX, Health.full(health));
}

describe('ResolveCollisionsUseCase — obstacles', () => {
  it('destroys destructible obstacles and eliminates one trooper', () => {
    const physics = new FakePhysicsPort();
    const useCase = new ResolveCollisionsUseCase(physics);
    const squad = createSquad(2);
    const crate = createObstacle(ObstacleType.WoodCrate, 10);
    const obstacles = new Map([['obstacle-1', crate]]);
    physics.queryOverlaps.mockReturnValue(['leader-1']);

    useCase.execute(squad, [], obstacles, new Map());

    expect(crate.isDestroyed).toBe(true);
    expect(obstacles.size).toBe(0);
    expect(squad.totalSize).toBe(2);
  });

  it('eliminates a trooper on indestructible obstacles', () => {
    const physics = new FakePhysicsPort();
    const useCase = new ResolveCollisionsUseCase(physics);
    const squad = createSquad(2);
    const roller = createObstacle(ObstacleType.RotatingSpikeRoller, 1);
    physics.queryOverlaps.mockReturnValue(['leader-1']);

    useCase.execute(squad, [], new Map([['obstacle-1', roller]]), new Map());

    expect(squad.totalSize).toBe(2);
    expect(squad.trooperCount).toBe(1);
  });

  it('wipes a lone leader on indestructible obstacles', () => {
    const physics = new FakePhysicsPort();
    const useCase = new ResolveCollisionsUseCase(physics);
    const squad = createSquad(0);
    const roller = createObstacle(ObstacleType.RotatingSpikeRoller, 1);
    physics.queryOverlaps.mockReturnValue(['leader-1']);

    useCase.execute(squad, [], new Map([['obstacle-1', roller]]), new Map());

    expect(squad.totalSize).toBe(0);
    expect(squad.isWiped).toBe(true);
  });
});
