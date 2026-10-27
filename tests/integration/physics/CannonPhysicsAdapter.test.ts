import { describe, expect, it } from 'vitest';
import { CannonPhysicsAdapter } from '@infrastructure/physics/CannonPhysicsAdapter';
import { BoundingBox3D } from '@domain/value-objects/BoundingBox3D';
import { Position3D } from '@domain/value-objects/Position3D';

function boxAt(x: number, size = 2): BoundingBox3D {
  return BoundingBox3D.fromCenterAndSize(
    new Position3D(x, 0, 0),
    new Position3D(size, size, size),
  );
}

describe('CannonPhysicsAdapter integration', () => {
  it('keeps overlap queries synchronized with domain coordinates', () => {
    const physics = new CannonPhysicsAdapter();
    const first = boxAt(0);
    const second = boxAt(1.5);
    physics.registerCollider('first', first, true);
    physics.registerCollider('second', second, true);

    expect(physics.queryOverlaps('first').includes('second')).toBe(
      first.intersects(second),
    );
    expect(physics.queryOverlaps('second').includes('first')).toBe(true);

    physics.updateColliderPosition('second', new Position3D(5, 0, 0));
    expect(physics.queryOverlaps('first')).not.toContain('second');
    expect(physics.queryOverlaps('second')).not.toContain('first');

    physics.updateColliderPosition('second', new Position3D(1.5, 0, 0));
    expect(physics.queryOverlaps('first')).toContain('second');
  });

  it('detects touching AABBs consistently with the domain box', () => {
    const physics = new CannonPhysicsAdapter();
    const first = boxAt(0);
    const touching = boxAt(2);
    physics.registerCollider('first', first, true);
    physics.registerCollider('touching', touching, true);

    expect(physics.queryOverlaps('first').includes('touching')).toBe(
      first.intersects(touching),
    );
  });

  it('raycasts the closest collider within range', () => {
    const physics = new CannonPhysicsAdapter();
    physics.registerCollider('near', boxAt(0), true);
    physics.registerCollider('far', boxAt(10), true);

    expect(
      physics.raycast(
        new Position3D(-5, 0, 0),
        new Position3D(1, 0, 0),
        20,
      ),
    ).toBe('near');
    expect(
      physics.raycast(
        new Position3D(-5, 0, 0),
        new Position3D(1, 0, 0),
        3,
      ),
    ).toBeNull();
    expect(
      physics.raycast(
        new Position3D(5, 0, 0),
        new Position3D(1, 0, 0),
        20,
      ),
    ).toBe('far');
  });

  it('reflects collider removal in queries and raycasts', () => {
    const physics = new CannonPhysicsAdapter();
    physics.registerCollider('crate', boxAt(0), true);

    physics.removeCollider('crate');

    expect(physics.queryOverlaps('crate')).toEqual([]);
    expect(
      physics.raycast(
        new Position3D(-5, 0, 0),
        new Position3D(1, 0, 0),
        20,
      ),
    ).toBeNull();
  });

  it('registers static and dynamic colliders and steps the world', () => {
    const physics = new CannonPhysicsAdapter();
    physics.registerCollider('static', boxAt(0), true);
    physics.registerCollider('dynamic', boxAt(4), false);

    expect(physics.queryOverlaps('static')).toEqual([]);
    expect(physics.queryOverlaps('dynamic')).toEqual([]);

    physics.step(1 / 60);
    expect(physics.queryOverlaps('static')).toEqual([]);
  });

  it('validates registration, updates and raycast inputs', () => {
    const physics = new CannonPhysicsAdapter();
    physics.registerCollider('crate', boxAt(0), true);

    expect(() => physics.registerCollider('crate', boxAt(0), true)).toThrow(Error);
    expect(() => physics.registerCollider('', boxAt(0), true)).toThrow(RangeError);
    expect(() => physics.updateColliderPosition('missing', Position3D.zero())).toThrow(
      Error,
    );
    expect(() => physics.step(-1)).toThrow(RangeError);
    expect(() =>
      physics.raycast(Position3D.zero(), new Position3D(0, 0, 0), 5),
    ).toThrow(RangeError);
    expect(() =>
      physics.raycast(Position3D.zero(), new Position3D(0, 0, 1), 0),
    ).toThrow(RangeError);
  });
});
