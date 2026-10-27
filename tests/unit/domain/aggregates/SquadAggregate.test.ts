import { describe, expect, it } from 'vitest';
import { SquadAggregate } from '@domain/aggregates/SquadAggregate';
import { Trooper } from '@domain/entities/Trooper';
import { Position3D } from '@domain/value-objects/Position3D';
import { WeaponTier } from '@domain/value-objects/WeaponTier';

function createSquad(): SquadAggregate {
  const leader = new Trooper('leader-1', Position3D.zero());
  return new SquadAggregate('squad-1', leader);
}

function createTrooper(id: string, x: number): Trooper {
  return new Trooper(id, new Position3D(x, 0, 0));
}

describe('SquadAggregate', () => {
  it('starts with the leader and the service pistol', () => {
    const squad = createSquad();

    expect(squad.id).toBe('squad-1');
    expect(squad.leaderEntity.id).toBe('leader-1');
    expect(squad.weaponTier).toBe(WeaponTier.ServicePistol);
    expect(squad.trooperCount).toBe(0);
    expect(squad.totalSize).toBe(1);
    expect(squad.isWiped).toBe(false);
  });

  it('adds active troopers to the squad', () => {
    const squad = createSquad();
    squad.addTrooper(createTrooper('trooper-1', 2));
    squad.addTrooper(createTrooper('trooper-2', 4));

    expect(squad.trooperCount).toBe(2);
    expect(squad.totalSize).toBe(3);
    expect(squad.activeTroopers).toHaveLength(2);
  });

  it('rejects duplicate, leader and dead troopers', () => {
    const squad = createSquad();
    const trooper = createTrooper('trooper-1', 2);
    squad.addTrooper(trooper);
    const deadTrooper = createTrooper('trooper-dead', 3);
    deadTrooper.kill();

    expect(() => squad.addTrooper(trooper)).toThrow(Error);
    expect(() => squad.addTrooper(squad.leaderEntity)).toThrow(Error);
    expect(() => squad.addTrooper(deadTrooper)).toThrow(Error);
  });

  it('kills and removes troopers', () => {
    const squad = createSquad();
    squad.addTrooper(createTrooper('trooper-1', 2));
    squad.addTrooper(createTrooper('trooper-2', 4));

    expect(squad.killTrooper('trooper-1')).toBe(true);
    expect(squad.trooperCount).toBe(1);
    expect(squad.totalSize).toBe(2);
    expect(squad.killTrooper('unknown')).toBe(false);
    expect(squad.removeTrooper('trooper-2')).toBe(true);
    expect(squad.removeTrooper('trooper-2')).toBe(false);
  });

  it('computes the swarm center from the leader and active troopers', () => {
    const squad = createSquad();
    squad.addTrooper(createTrooper('trooper-1', 2));
    squad.addTrooper(createTrooper('trooper-2', 4));

    expect(squad.center.equals(new Position3D(2, 0, 0))).toBe(true);

    squad.killTrooper('trooper-1');
    expect(squad.center.equals(new Position3D(2, 0, 0))).toBe(true);
  });

  it('moves the leader and finds members by id', () => {
    const squad = createSquad();
    const trooper = createTrooper('trooper-1', 2);
    squad.addTrooper(trooper);
    squad.moveLeaderTo(new Position3D(1, 0, 5));

    expect(squad.leaderPosition.equals(new Position3D(1, 0, 5))).toBe(true);
    expect(squad.findTrooper('leader-1')).toBe(squad.leaderEntity);
    expect(squad.findTrooper('trooper-1')).toBe(trooper);
    expect(squad.findTrooper('unknown')).toBeUndefined();
  });

  it('upgrades the weapon tier and caps at five', () => {
    const squad = createSquad();

    expect(squad.upgradeWeapon()).toBe(WeaponTier.DualSmgs);
    for (let index = 0; index < 10; index += 1) {
      squad.upgradeWeapon();
    }
    expect(squad.weaponTier).toBe(WeaponTier.RocketLauncher);

    squad.setWeaponTier(WeaponTier.AssaultRifle);
    expect(squad.weaponTier).toBe(WeaponTier.AssaultRifle);
  });

  it('is wiped when the leader dies', () => {
    const squad = createSquad();
    squad.addTrooper(createTrooper('trooper-1', 2));

    squad.killLeader();

    expect(squad.isWiped).toBe(true);
    expect(squad.totalSize).toBe(1);
  });
});
