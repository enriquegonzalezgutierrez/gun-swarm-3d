import { describe, expect, it } from 'vitest';
import { BoundingBox3D } from '@domain/value-objects/BoundingBox3D';
import { Position3D } from '@domain/value-objects/Position3D';

describe('BoundingBox3D', () => {
  it('builds axis-aligned bounds from a center and size', () => {
    const box = BoundingBox3D.fromCenterAndSize(
      new Position3D(0, 0, 0),
      new Position3D(2, 4, 6),
    );

    expect(box.min.equals(new Position3D(-1, -2, -3))).toBe(true);
    expect(box.max.equals(new Position3D(1, 2, 3))).toBe(true);
    expect(box.halfExtents.equals(new Position3D(1, 2, 3))).toBe(true);
  });

  it('builds bounds from minimum and maximum corners', () => {
    const box = BoundingBox3D.fromMinMax(
      new Position3D(-1, -1, -1),
      new Position3D(1, 1, 1),
    );

    expect(box.center.equals(Position3D.zero())).toBe(true);
    expect(box.halfExtents.equals(new Position3D(1, 1, 1))).toBe(true);
  });

  it('detects overlapping and touching boxes', () => {
    const first = BoundingBox3D.fromCenterAndSize(Position3D.zero(), new Position3D(2, 2, 2));
    const overlapping = BoundingBox3D.fromCenterAndSize(
      new Position3D(1, 0, 0),
      new Position3D(2, 2, 2),
    );
    const touching = BoundingBox3D.fromCenterAndSize(
      new Position3D(2, 0, 0),
      new Position3D(2, 2, 2),
    );

    expect(first.intersects(overlapping)).toBe(true);
    expect(first.intersects(touching)).toBe(true);
  });

  it('rejects separated boxes', () => {
    const first = BoundingBox3D.fromCenterAndSize(Position3D.zero(), new Position3D(2, 2, 2));
    const separated = BoundingBox3D.fromCenterAndSize(
      new Position3D(3, 0, 0),
      new Position3D(2, 2, 2),
    );

    expect(first.intersects(separated)).toBe(false);
  });

  it('contains points including its boundaries', () => {
    const box = BoundingBox3D.fromCenterAndSize(Position3D.zero(), new Position3D(2, 2, 2));

    expect(box.containsPoint(Position3D.zero())).toBe(true);
    expect(box.containsPoint(new Position3D(1, 1, 1))).toBe(true);
    expect(box.containsPoint(new Position3D(1.1, 0, 0))).toBe(false);
  });

  it('translates to a new box without mutating the source', () => {
    const box = BoundingBox3D.fromCenterAndSize(Position3D.zero(), new Position3D(2, 2, 2));
    const moved = box.translated(new Position3D(5, 0, 0));

    expect(moved.center.equals(new Position3D(5, 0, 0))).toBe(true);
    expect(box.center.equals(Position3D.zero())).toBe(true);
  });

  it('rejects invalid dimensions', () => {
    expect(
      () => new BoundingBox3D(Position3D.zero(), new Position3D(-1, 1, 1)),
    ).toThrow(RangeError);
    expect(
      () => BoundingBox3D.fromMinMax(new Position3D(1, 0, 0), Position3D.zero()),
    ).toThrow(RangeError);
  });
});
