import { describe, expect, it } from 'vitest';
import { ResolveCollisionsUseCase } from '@application/use-cases/ResolveCollisionsUseCase';
import { SquadAggregate } from '@domain/aggregates/SquadAggregate';
import { Pickup } from '@domain/entities/Pickup';
import { PickupType } from '@domain/entities/PickupType';
import { Trooper } from '@domain/entities/Trooper';
import { Position3D } from '@domain/value-objects/Position3D';
import { WeaponTier } from '@domain/value-objects/WeaponTier';
import { FakePhysicsPort } from '../../../fixtures/FakePhysicsPort';

function createSquad(): SquadAggregate {
  return new SquadAggregate('squad-1', new Trooper('leader-1', Position3D.zero()));
}

describe('ResolveCollisionsUseCase — pickups', () => {
  it('collects gold coins', () => {
    const physics = new FakePhysicsPort();
    const useCase = new ResolveCollisionsUseCase(physics);
    const squad = createSquad();
    const coin = new Pickup('coin-1', PickupType.GoldCoin, Position3D.zero(), 3);
    const pickups = new Map([['coin-1', coin]]);
    physics.queryOverlaps.mockReturnValue(['leader-1']);

    useCase.execute(squad, [], new Map(), pickups);

    expect(useCase.collectedGold).toBe(3);
    expect(coin.isCollected).toBe(true);
    expect(pickups.size).toBe(0);
  });

  it('upgrades the weapon tier from a chest', () => {
    const physics = new FakePhysicsPort();
    const useCase = new ResolveCollisionsUseCase(physics);
    const squad = createSquad();
    const chest = new Pickup('chest-1', PickupType.WeaponChest, Position3D.zero());
    physics.queryOverlaps.mockReturnValue(['leader-1']);

    useCase.execute(squad, [], new Map(), new Map([['chest-1', chest]]));

    expect(squad.weaponTier).toBe(WeaponTier.DualSmgs);
  });

  it('grants shield duration from an orb', () => {
    const physics = new FakePhysicsPort();
    const useCase = new ResolveCollisionsUseCase(physics);
    const squad = createSquad();
    const orb = new Pickup('orb-1', PickupType.ShieldOrb, Position3D.zero(), 3.5);
    physics.queryOverlaps.mockReturnValue(['leader-1']);

    useCase.execute(squad, [], new Map(), new Map([['orb-1', orb]]));

    expect(useCase.shieldSeconds).toBe(3.5);
  });

  it('ignores pickups without overlap and resets run stats', () => {
    const physics = new FakePhysicsPort();
    const useCase = new ResolveCollisionsUseCase(physics);
    const squad = createSquad();
    const coin = new Pickup('coin-1', PickupType.GoldCoin, Position3D.zero());

    useCase.execute(squad, [], new Map(), new Map([['coin-1', coin]]));
    expect(useCase.collectedGold).toBe(0);

    physics.queryOverlaps.mockReturnValue(['leader-1']);
    useCase.execute(squad, [], new Map(), new Map([['coin-1', coin]]));
    useCase.resetRunStats();
    expect(useCase.collectedGold).toBe(0);
  });
});
