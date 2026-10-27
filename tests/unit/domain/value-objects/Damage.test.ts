import { describe, expect, it } from 'vitest';
import { Damage } from '@domain/value-objects/Damage';

describe('Damage', () => {
  it('stores a non-negative amount', () => {
    const damage = new Damage(2.5);

    expect(damage.amount).toBe(2.5);
    expect(damage.isZero).toBe(false);
    expect(Damage.zero().isZero).toBe(true);
  });

  it('adds and multiplies values immutably', () => {
    const damage = new Damage(10);
    const combined = damage.add(new Damage(5));
    const boosted = damage.multiply(1.5);

    expect(combined.amount).toBe(15);
    expect(boosted.amount).toBe(15);
    expect(damage.amount).toBe(10);
  });

  it('rejects invalid amounts and multipliers', () => {
    expect(() => new Damage(-1)).toThrow(RangeError);
    expect(() => new Damage(Number.NaN)).toThrow(RangeError);
    expect(() => new Damage(1).multiply(-2)).toThrow(RangeError);
    expect(() => new Damage(1).multiply(Number.POSITIVE_INFINITY)).toThrow(RangeError);
  });
});
