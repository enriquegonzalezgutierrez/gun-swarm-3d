import { describe, expect, it } from 'vitest';
import { Damage } from '@domain/value-objects/Damage';
import { Health } from '@domain/value-objects/Health';

describe('Health', () => {
  it('starts full', () => {
    const health = Health.full(100);

    expect(health.max).toBe(100);
    expect(health.current).toBe(100);
    expect(health.isAlive).toBe(true);
    expect(health.isDead).toBe(false);
    expect(health.ratio()).toBe(1);
  });

  it('applies damage without mutating the source', () => {
    const health = Health.full(100);
    const damaged = health.applyDamage(new Damage(30));

    expect(damaged.current).toBe(70);
    expect(damaged.max).toBe(100);
    expect(health.current).toBe(100);
  });

  it('clamps damage at zero', () => {
    const health = Health.full(20).applyDamage(new Damage(50));

    expect(health.current).toBe(0);
    expect(health.isDead).toBe(true);
    expect(health.isAlive).toBe(false);
    expect(health.ratio()).toBe(0);
  });

  it('heals up to the maximum', () => {
    const wounded = new Health(100, 40);
    const healed = wounded.heal(25);
    const overhealed = wounded.heal(500);

    expect(healed.current).toBe(65);
    expect(overhealed.current).toBe(100);
  });

  it('rejects invalid values', () => {
    expect(() => Health.full(0)).toThrow(RangeError);
    expect(() => Health.full(10.5)).toThrow(RangeError);
    expect(() => new Health(100, -1)).toThrow(RangeError);
    expect(() => new Health(100, 101)).toThrow(RangeError);
    expect(() => Health.full(100).heal(-1)).toThrow(RangeError);
  });
});
