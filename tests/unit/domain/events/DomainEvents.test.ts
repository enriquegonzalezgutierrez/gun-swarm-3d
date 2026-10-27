import { describe, expect, it } from 'vitest';
import { BossDamagedEvent } from '@domain/events/BossDamagedEvent';
import { BossDefeatedEvent } from '@domain/events/BossDefeatedEvent';
import { GatePassedEvent } from '@domain/events/GatePassedEvent';
import { ObstacleDestroyedEvent } from '@domain/events/ObstacleDestroyedEvent';
import { SquadWipedEvent } from '@domain/events/SquadWipedEvent';
import { TrooperKilledEvent } from '@domain/events/TrooperKilledEvent';
import { TrooperRecruitedEvent } from '@domain/events/TrooperRecruitedEvent';

describe('Domain events', () => {
  it('exposes recruitment metadata', () => {
    const event = new TrooperRecruitedEvent('squad-1', 'trooper-1', 1000);

    expect(event.eventName).toBe('trooper.recruited');
    expect(event.aggregateId).toBe('squad-1');
    expect(event.trooperId).toBe('trooper-1');
    expect(event.occurredAt).toBe(1000);
  });

  it('exposes trooper death metadata', () => {
    const event = new TrooperKilledEvent('squad-1', 'trooper-2', 2000);

    expect(event.eventName).toBe('trooper.killed');
    expect(event.trooperId).toBe('trooper-2');
  });

  it('exposes obstacle destruction metadata', () => {
    const event = new ObstacleDestroyedEvent('stage-1', 'obstacle-1', 'WOOD_CRATE', 3000);

    expect(event.eventName).toBe('obstacle.destroyed');
    expect(event.obstacleType).toBe('WOOD_CRATE');
  });

  it('exposes gate metadata', () => {
    const event = new GatePassedEvent('stage-1', 'gate-1', 'MULTIPLY', 2, 4000);

    expect(event.eventName).toBe('gate.passed');
    expect(event.operation).toBe('MULTIPLY');
    expect(event.value).toBe(2);
  });

  it('exposes boss metadata', () => {
    const damaged = new BossDamagedEvent('stage-1', 'boss-1', 25, 175, 5000);
    const defeated = new BossDefeatedEvent('stage-1', 'boss-1', 5001);

    expect(damaged.eventName).toBe('boss.damaged');
    expect(damaged.remainingHealth).toBe(175);
    expect(defeated.eventName).toBe('boss.defeated');
  });

  it('exposes squad wipe metadata', () => {
    const event = new SquadWipedEvent('squad-1', 6000);

    expect(event.eventName).toBe('squad.wiped');
    expect(event.aggregateId).toBe('squad-1');
    expect(event.occurredAt).toBe(6000);
  });
});
