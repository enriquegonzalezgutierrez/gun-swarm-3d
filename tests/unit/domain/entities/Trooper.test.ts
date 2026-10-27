import { describe, expect, it } from 'vitest';
import { Trooper } from '@domain/entities/Trooper';
import { TrooperState } from '@domain/entities/TrooperState';
import { Position3D } from '@domain/value-objects/Position3D';

describe('Trooper', () => {
  it('starts active at the supplied position', () => {
    const trooper = new Trooper('trooper-1', new Position3D(1, 0, 2));

    expect(trooper.id).toBe('trooper-1');
    expect(trooper.state).toBe(TrooperState.Active);
    expect(trooper.isActive).toBe(true);
    expect(trooper.position.equals(new Position3D(1, 0, 2))).toBe(true);
  });

  it('moves to a new position', () => {
    const trooper = new Trooper('trooper-1', Position3D.zero());
    trooper.moveTo(new Position3D(3, 0, 4));

    expect(trooper.position.equals(new Position3D(3, 0, 4))).toBe(true);
  });

  it('dies when killed', () => {
    const trooper = new Trooper('trooper-1', Position3D.zero());
    trooper.kill();

    expect(trooper.state).toBe(TrooperState.Dead);
    expect(trooper.isActive).toBe(false);
  });

  it('supports the victory hopping lifecycle', () => {
    const trooper = new Trooper('trooper-1', Position3D.zero());
    trooper.startHopping();
    expect(trooper.state).toBe(TrooperState.Hopping);

    trooper.finishHopping();
    expect(trooper.state).toBe(TrooperState.Active);
  });

  it('does not resurrect dead troopers through hopping', () => {
    const trooper = new Trooper('trooper-1', Position3D.zero());
    trooper.kill();
    trooper.startHopping();
    trooper.finishHopping();

    expect(trooper.state).toBe(TrooperState.Dead);
  });

  it('rejects an empty id', () => {
    expect(() => new Trooper('   ', Position3D.zero())).toThrow(RangeError);
  });
});
