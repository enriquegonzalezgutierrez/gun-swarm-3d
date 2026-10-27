import { describe, expect, it } from 'vitest';
import { Position3D } from '@domain/value-objects/Position3D';
import { Velocity3D } from '@domain/value-objects/Velocity3D';

describe('Velocity3D', () => {
  it('defaults to zero velocity', () => {
    const velocity = new Velocity3D();

    expect(velocity.length).toBe(0);
    expect(velocity.equals(Velocity3D.zero())).toBe(true);
  });

  it('adds, scales and interpolates immutably', () => {
    const first = new Velocity3D(1, 2, 3);
    const second = new Velocity3D(4, 5, 6);

    expect(first.add(second).equals(new Velocity3D(5, 7, 9))).toBe(true);
    expect(first.scale(2).equals(new Velocity3D(2, 4, 6))).toBe(true);
    expect(first.lerp(second, 0.5).equals(new Velocity3D(2.5, 3.5, 4.5))).toBe(true);
    expect(first.equals(new Velocity3D(1, 2, 3))).toBe(true);
  });

  it('computes length and normalized direction', () => {
    const velocity = new Velocity3D(3, 4, 0);
    const normalized = velocity.normalize();

    expect(velocity.length).toBe(5);
    expect(normalized.length).toBeCloseTo(1, 10);
    expect(normalized.equals(new Velocity3D(0.6, 0.8, 0))).toBe(true);
  });

  it('keeps a zero velocity when normalizing', () => {
    expect(Velocity3D.zero().normalize().equals(Velocity3D.zero())).toBe(true);
  });

  it('applies itself to a position over time', () => {
    const velocity = new Velocity3D(2, 0, -4);
    const position = new Position3D(1, 1, 10);

    expect(velocity.applyTo(position, 0.5).equals(new Position3D(2, 1, 8))).toBe(true);
  });

  it('rejects invalid time steps', () => {
    const velocity = new Velocity3D(1, 0, 0);

    expect(() => velocity.applyTo(Position3D.zero(), -0.1)).toThrow(RangeError);
    expect(() => velocity.applyTo(Position3D.zero(), Number.NaN)).toThrow(RangeError);
  });
});
