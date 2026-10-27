import { describe, expect, it } from 'vitest';
import { Currency } from '@domain/value-objects/Currency';

describe('Currency', () => {
  it('starts at zero by default', () => {
    const currency = new Currency();

    expect(currency.gold).toBe(0);
    expect(currency.equals(Currency.zero())).toBe(true);
  });

  it('adds gold immutably', () => {
    const currency = new Currency(50);
    const increased = currency.add(25);

    expect(increased.gold).toBe(75);
    expect(currency.gold).toBe(50);
  });

  it('deducts gold when funds are sufficient', () => {
    const currency = new Currency(100).deduct(40);

    expect(currency.gold).toBe(60);
  });

  it('rejects overdrafts', () => {
    expect(() => new Currency(10).deduct(11)).toThrow(RangeError);
  });

  it('checks affordability', () => {
    const currency = new Currency(100);

    expect(currency.canAfford(100)).toBe(true);
    expect(currency.canAfford(101)).toBe(false);
  });

  it('rejects negative and fractional amounts', () => {
    expect(() => new Currency(-1)).toThrow(RangeError);
    expect(() => new Currency(1.5)).toThrow(RangeError);
    expect(() => new Currency(1).add(-1)).toThrow(RangeError);
    expect(() => new Currency(1).deduct(0.5)).toThrow(RangeError);
    expect(() => new Currency(1).canAfford(-1)).toThrow(RangeError);
  });
});
