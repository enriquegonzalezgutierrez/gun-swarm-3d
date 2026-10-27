import { describe, expect, it } from 'vitest';
import { Position3D } from '@domain/value-objects/Position3D';

describe('Position3D', () => {
  it('defaults to the origin', () => {
    const position = new Position3D();

    expect(position.x).toBe(0);
    expect(position.y).toBe(0);
    expect(position.z).toBe(0);
  });

  it('rejects non-finite coordinates', () => {
    expect(() => new Position3D(Number.NaN, 0, 0)).toThrow(RangeError);
    expect(() => new Position3D(0, Number.POSITIVE_INFINITY, 0)).toThrow(RangeError);
    expect(() => new Position3D(0, 0, Number.NEGATIVE_INFINITY)).toThrow(RangeError);
  });

  it('adds, subtracts and scales without mutating the source', () => {
    const first = new Position3D(1, 2, 3);
    const second = new Position3D(4, 5, 6);

    expect(first.add(second).equals(new Position3D(5, 7, 9))).toBe(true);
    expect(second.subtract(first).equals(new Position3D(3, 3, 3))).toBe(true);
    expect(first.scale(2).equals(new Position3D(2, 4, 6))).toBe(true);
    expect(first.equals(new Position3D(1, 2, 3))).toBe(true);
  });

  it('computes euclidean distance', () => {
    const origin = new Position3D();
    const target = new Position3D(3, 4, 0);

    expect(origin.distanceTo(target)).toBe(5);
  });

  it('interpolates and clamps the alpha factor', () => {
    const origin = new Position3D();
    const target = new Position3D(10, 20, 0);

    expect(origin.lerp(target, 0.5).equals(new Position3D(5, 10, 0))).toBe(true);
    expect(origin.lerp(target, -1).equals(origin)).toBe(true);
    expect(origin.lerp(target, 2).equals(target)).toBe(true);
  });

  it('returns copies with a replaced axis', () => {
    const position = new Position3D(1, 2, 3);

    expect(position.withX(9).equals(new Position3D(9, 2, 3))).toBe(true);
    expect(position.withY(9).equals(new Position3D(1, 9, 3))).toBe(true);
    expect(position.withZ(9).equals(new Position3D(1, 2, 9))).toBe(true);
  });

  it('compares positions with a configurable epsilon', () => {
    const first = new Position3D(1, 1, 1);
    const second = new Position3D(1.0001, 1, 1);

    expect(first.equals(second)).toBe(false);
    expect(first.equals(second, 0.001)).toBe(true);
  });
});
