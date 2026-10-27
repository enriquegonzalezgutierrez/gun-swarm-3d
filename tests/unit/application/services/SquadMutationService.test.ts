import { describe, expect, it } from 'vitest';
import { SquadMutationService } from '@application/services/SquadMutationService';
import { SquadAggregate } from '@domain/aggregates/SquadAggregate';
import { Trooper } from '@domain/entities/Trooper';
import { Position3D } from '@domain/value-objects/Position3D';

function createSquad(trooperCount = 0): SquadAggregate {
  const squad = new SquadAggregate(
    'squad-1',
    new Trooper('leader-1', new Position3D(2, 0, 0)),
  );
  for (let index = 0; index < trooperCount; index += 1) {
    squad.addTrooper(new Trooper(`trooper-${index}`, new Position3D(2, 0, 0)));
  }
  return squad;
}

describe('SquadMutationService', () => {
  it('recruits the requested number of troopers at the swarm center', () => {
    const service = new SquadMutationService();
    const squad = createSquad(1);

    service.recruit(squad, 3);

    expect(squad.totalSize).toBe(5);
    expect(squad.trooperCount).toBe(4);
    for (const trooper of squad.activeTroopers) {
      expect(trooper.position.equals(new Position3D(2, 0, 0))).toBe(true);
    }
  });

  it('dismisses no more troopers than are active', () => {
    const service = new SquadMutationService();
    const squad = createSquad(2);

    service.dismiss(squad, 10);

    expect(squad.trooperCount).toBe(0);
    expect(squad.totalSize).toBe(1);
  });

  it('eliminates a trooper before the leader', () => {
    const service = new SquadMutationService();
    const squad = createSquad(1);

    service.eliminateOne(squad);

    expect(squad.trooperCount).toBe(0);
    expect(squad.isWiped).toBe(false);

    service.eliminateOne(squad);

    expect(squad.isWiped).toBe(true);
  });
});
