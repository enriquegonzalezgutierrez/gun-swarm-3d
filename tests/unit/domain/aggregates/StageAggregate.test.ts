import { describe, expect, it } from 'vitest';
import { StageAggregate } from '@domain/aggregates/StageAggregate';
import { Boss } from '@domain/entities/Boss';
import { Damage } from '@domain/value-objects/Damage';
import { Position3D } from '@domain/value-objects/Position3D';

function createBoss(): Boss {
  return new Boss('boss-1', 'War Rig', new Position3D(0, 0, 220), 200);
}

describe('StageAggregate', () => {
  it('starts at the beginning of the track without a boss', () => {
    const stage = new StageAggregate(1, 220);

    expect(stage.phaseNumber).toBe(1);
    expect(stage.trackLength).toBe(220);
    expect(stage.distanceTravelled).toBe(0);
    expect(stage.remainingDistance).toBe(220);
    expect(stage.progressRatio).toBe(0);
    expect(stage.hasReachedBossArena).toBe(false);
    expect(stage.bossState).toBe('NONE');
    expect(stage.isBossDefeated).toBe(false);
  });

  it('advances and clamps at the track end', () => {
    const stage = new StageAggregate(1, 220);

    expect(stage.advance(100)).toBe(100);
    expect(stage.distanceTravelled).toBe(100);
    expect(stage.remainingDistance).toBe(120);
    expect(stage.progressRatio).toBeCloseTo(100 / 220, 10);

    expect(stage.advance(500)).toBe(120);
    expect(stage.distanceTravelled).toBe(220);
    expect(stage.remainingDistance).toBe(0);
    expect(stage.hasReachedBossArena).toBe(true);
    expect(stage.advance(10)).toBe(0);
  });

  it('tracks boss lifecycle state', () => {
    const stage = new StageAggregate(1, 220);
    stage.setBoss(createBoss());

    expect(stage.bossState).toBe('ALIVE');
    expect(stage.isBossDefeated).toBe(false);

    stage.boss?.applyDamage(new Damage(200));

    expect(stage.bossState).toBe('DEFEATED');
    expect(stage.isBossDefeated).toBe(true);
  });

  it('accepts a boss at construction time', () => {
    const stage = new StageAggregate(1, 220, createBoss());

    expect(stage.bossState).toBe('ALIVE');
    expect(stage.boss?.name).toBe('War Rig');
  });

  it('clamps lateral movement to the track boundaries', () => {
    const stage = new StageAggregate(1, 220);

    expect(stage.minLateralX).toBe(-4.5);
    expect(stage.maxLateralX).toBe(4.5);
    expect(stage.clampLateral(10)).toBe(4.5);
    expect(stage.clampLateral(-10)).toBe(-4.5);
    expect(stage.clampLateral(2)).toBe(2);
    expect(() => stage.clampLateral(Number.NaN)).toThrow(RangeError);
  });

  it('rejects invalid configurations and advances', () => {
    expect(() => new StageAggregate(0, 220)).toThrow(RangeError);
    expect(() => new StageAggregate(6, 220)).toThrow(RangeError);
    expect(() => new StageAggregate(1.5, 220)).toThrow(RangeError);
    expect(() => new StageAggregate(1, 0)).toThrow(RangeError);
    expect(() => new StageAggregate(1, -10)).toThrow(RangeError);
    expect(() => new StageAggregate(1, 220).advance(-1)).toThrow(RangeError);
  });
});
