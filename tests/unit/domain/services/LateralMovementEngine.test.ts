import { describe, expect, it } from 'vitest';
import { LateralMovementEngine } from '@domain/services/LateralMovementEngine';

describe('LateralMovementEngine', () => {
  it('applies the transfer ratio and smoothing factor', () => {
    expect(LateralMovementEngine.computeNextX(0, 1, -4.5, 4.5)).toBeCloseTo(
      0.0875,
      10,
    );
  });

  it('clamps the target to the track boundaries', () => {
    expect(LateralMovementEngine.computeNextX(4.4, 100, -4.5, 4.5)).toBeCloseTo(
      4.425,
      10,
    );
    expect(LateralMovementEngine.computeNextX(-4.4, -100, -4.5, 4.5)).toBeCloseTo(
      -4.425,
      10,
    );
  });

  it('keeps the current position without input', () => {
    expect(LateralMovementEngine.computeNextX(2, 0, -4.5, 4.5)).toBe(2);
  });

  it('rejects invalid bounds and values', () => {
    expect(() => LateralMovementEngine.computeNextX(0, 1, 5, -5)).toThrow(RangeError);
    expect(() => LateralMovementEngine.computeNextX(Number.NaN, 1, -4.5, 4.5)).toThrow(
      RangeError,
    );
    expect(() => LateralMovementEngine.computeNextX(0, Infinity, -4.5, 4.5)).toThrow(
      RangeError,
    );
  });
});
