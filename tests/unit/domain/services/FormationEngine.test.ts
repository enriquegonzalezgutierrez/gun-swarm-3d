import { describe, expect, it } from 'vitest';
import { FormationEngine } from '@domain/services/FormationEngine';
import { Position3D } from '@domain/value-objects/Position3D';

const GOLDEN_ANGLE = 2.399963;
const DEFAULT_SPACING = 0.65;

describe('FormationEngine', () => {
  it('returns no slots for an empty trooper count', () => {
    const engine = new FormationEngine();

    expect(engine.calculateOffsets(0)).toEqual([]);
  });

  it('places the first trooper on the Fermat spiral', () => {
    const engine = new FormationEngine();
    const offsets = engine.calculateOffsets(1);
    const first = offsets[0];

    expect(offsets).toHaveLength(1);
    expect(first?.x).toBeCloseTo(DEFAULT_SPACING * Math.cos(GOLDEN_ANGLE), 10);
    expect(first?.y).toBe(0);
    expect(first?.z).toBeCloseTo(-DEFAULT_SPACING * Math.sin(GOLDEN_ANGLE), 10);
  });

  it('distributes every trooper around the leader', () => {
    const engine = new FormationEngine();
    const offsets = engine.calculateOffsets(10);

    expect(offsets).toHaveLength(10);
    for (const offset of offsets) {
      expect(offset.y).toBe(0);
    }
    expect(offsets[0]?.distanceTo(Position3D.zero())).toBeLessThan(
      offsets[9]?.distanceTo(Position3D.zero()) ?? 0,
    );
  });

  it('translates local slots into world positions', () => {
    const engine = new FormationEngine();
    const leader = new Position3D(10, 0, 5);
    const offsets = engine.calculateOffsets(4);
    const worldPositions = engine.calculateWorldPositions(leader, 4);

    expect(worldPositions).toHaveLength(4);
    worldPositions.forEach((position, index) => {
      const offset = offsets[index];
      expect(offset).toBeDefined();
      expect(position.equals(leader.add(offset as Position3D))).toBe(true);
    });
  });

  it('supports custom spacing', () => {
    const engine = new FormationEngine();
    const first = engine.calculateOffsets(1, 1.3)[0];

    expect(first?.x).toBeCloseTo(1.3 * Math.cos(GOLDEN_ANGLE), 10);
    expect(first?.z).toBeCloseTo(-1.3 * Math.sin(GOLDEN_ANGLE), 10);
  });

  it('rejects invalid counts and spacing', () => {
    const engine = new FormationEngine();

    expect(() => engine.calculateOffsets(-1)).toThrow(RangeError);
    expect(() => engine.calculateOffsets(2.5)).toThrow(RangeError);
    expect(() => engine.calculateOffsets(1, 0)).toThrow(RangeError);
    expect(() => engine.calculateOffsets(1, -0.5)).toThrow(RangeError);
  });
});
