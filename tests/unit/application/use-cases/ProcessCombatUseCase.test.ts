import { describe, expect, it } from 'vitest';
import type { Damageable } from '@domain/entities/Damageable';
import { Position3D } from '@domain/value-objects/Position3D';
import { createCombatHarness } from '../../../fixtures/CombatHarness';

describe('ProcessCombatUseCase', () => {
  it('auto-fires continuously while targets exist', () => {
    const { useCase, physics, render, squad, targets } = createCombatHarness();

    useCase.execute(squad, targets, 0);

    expect(physics.raycast).not.toHaveBeenCalled();
    expect(useCase.activeProjectileCount).toBe(1);
    expect(render.createEntityMesh).toHaveBeenCalledWith(
      'projectile-1',
      'projectile',
      new Position3D(0, 0.9, 0),
    );
    expect(physics.registerCollider).toHaveBeenCalledTimes(1);
  });

  it('applies damage when a projectile overlaps a target', () => {
    const { useCase, physics, render, squad, target, targets } = createCombatHarness();
    useCase.execute(squad, targets, 0);
    physics.queryOverlaps.mockReturnValue(['target-1']);

    useCase.execute(squad, targets, 0.4);

    expect(target.damageTaken).toBe(1);
    expect(useCase.activeProjectileCount).toBe(1);
    expect(render.updateEntityTransform).toHaveBeenCalledWith(
      'projectile-1',
      new Position3D(0, 0.9, 18),
    );
    expect(render.removeEntityMesh).toHaveBeenCalledWith('projectile-1');
    expect(physics.removeCollider).toHaveBeenCalledWith('projectile-1');
  });

  it('does not fire without targets', () => {
    const { useCase, squad } = createCombatHarness();
    const noTargets = new Map<string, Damageable>();

    useCase.execute(squad, noTargets, 0);

    expect(useCase.activeProjectileCount).toBe(0);
  });

  it('rejects invalid delta times', () => {
    const { useCase, squad, targets } = createCombatHarness();

    expect(() => useCase.execute(squad, targets, -1)).toThrow(RangeError);
    expect(() => useCase.execute(squad, targets, Number.NaN)).toThrow(RangeError);
  });
});
