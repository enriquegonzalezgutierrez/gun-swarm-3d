import { describe, expect, it } from 'vitest';
import { Trooper } from '@domain/entities/Trooper';
import { SwarmCenterCalculator } from '@domain/services/SwarmCenterCalculator';
import { Position3D } from '@domain/value-objects/Position3D';

describe('SwarmCenterCalculator', () => {
  it('averages the leader and active troopers', () => {
    const leader = new Trooper('leader-1', new Position3D(0, 0, 0));
    const first = new Trooper('trooper-1', new Position3D(2, 0, 2));
    const second = new Trooper('trooper-2', new Position3D(4, 0, 4));

    const center = SwarmCenterCalculator.calculate(leader, [first, second]);

    expect(center.equals(new Position3D(2, 0, 2))).toBe(true);
  });

  it('falls back to the leader position when nobody is active', () => {
    const leader = new Trooper('leader-1', new Position3D(1, 0, 3));
    leader.kill();

    const center = SwarmCenterCalculator.calculate(leader, []);

    expect(center.equals(new Position3D(1, 0, 3))).toBe(true);
  });
});
