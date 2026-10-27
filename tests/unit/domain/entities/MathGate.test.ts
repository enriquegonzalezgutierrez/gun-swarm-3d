import { describe, expect, it } from 'vitest';
import { GateLane } from '@domain/entities/GateLane';
import { GateOperation } from '@domain/entities/GateOperation';
import { MathGate } from '@domain/entities/MathGate';
import { Position3D } from '@domain/value-objects/Position3D';

function createGate(operation: GateOperation, value: number): MathGate {
  return new MathGate('gate-1', operation, value, GateLane.Left, Position3D.zero());
}

describe('MathGate', () => {
  it('adds troopers', () => {
    expect(createGate(GateOperation.Add, 5).applyTo(10)).toBe(15);
  });

  it('subtracts troopers without going below zero', () => {
    expect(createGate(GateOperation.Subtract, 4).applyTo(10)).toBe(6);
    expect(createGate(GateOperation.Subtract, 20).applyTo(10)).toBe(0);
  });

  it('multiplies troopers', () => {
    expect(createGate(GateOperation.Multiply, 3).applyTo(7)).toBe(21);
  });

  it('divides troopers and rounds down', () => {
    expect(createGate(GateOperation.Divide, 2).applyTo(17)).toBe(8);
  });

  it('classifies positive and negative operations', () => {
    expect(createGate(GateOperation.Add, 5).isPositive).toBe(true);
    expect(createGate(GateOperation.Multiply, 2).isPositive).toBe(true);
    expect(createGate(GateOperation.Subtract, 5).isNegative).toBe(true);
    expect(createGate(GateOperation.Divide, 2).isNegative).toBe(true);
  });

  it('can be consumed after passing', () => {
    const gate = createGate(GateOperation.Add, 5);

    expect(gate.isActive).toBe(true);
    gate.consume();
    expect(gate.isActive).toBe(false);
  });

  it('rejects invalid values and squad sizes', () => {
    expect(() => createGate(GateOperation.Add, 0)).toThrow(RangeError);
    expect(() => createGate(GateOperation.Add, 2.5)).toThrow(RangeError);
    expect(() => createGate(GateOperation.Add, 5).applyTo(-1)).toThrow(RangeError);
    expect(() => createGate(GateOperation.Add, 5).applyTo(2.5)).toThrow(RangeError);
  });
});
