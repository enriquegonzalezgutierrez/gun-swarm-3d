import { describe, expect, it } from 'vitest';
import type { Damageable } from '@domain/entities/Damageable';
import { WeaponTier } from '@domain/value-objects/WeaponTier';
import { createCombatHarness } from '../../../fixtures/CombatHarness';

describe('ProcessCombatUseCase — firing behaviour', () => {
  it('respects the weapon fire-rate cooldown', () => {
    const { useCase, squad, targets } = createCombatHarness();

    useCase.execute(squad, targets, 0);
    useCase.execute(squad, targets, 0.1);
    expect(useCase.activeProjectileCount).toBe(1);

    useCase.execute(squad, targets, 0.3);
    expect(useCase.activeProjectileCount).toBe(2);
  });

  it('supports piercing projectiles', () => {
    const { useCase, physics, squad, target, targets } = createCombatHarness();
    squad.setWeaponTier(WeaponTier.AssaultRifle);
    useCase.execute(squad, targets, 0);
    physics.queryOverlaps.mockReturnValue(['target-1']);

    useCase.execute(squad, targets, 0.1);
    expect(target.damageTaken).toBe(2);
    expect(useCase.activeProjectileCount).toBe(1);

    useCase.execute(squad, targets, 0.1);
    expect(target.damageTaken).toBe(4);
    expect(useCase.activeProjectileCount).toBe(0);
  });

  it('removes projectiles beyond maximum travel distance', () => {
    const { useCase, squad, targets } = createCombatHarness();
    useCase.execute(squad, targets, 0);

    useCase.execute(squad, new Map<string, Damageable>(), 3);

    expect(useCase.activeProjectileCount).toBe(0);
  });

  it('keeps firing during a long run even when projectiles miss', () => {
    const { useCase, render, squad, targets } = createCombatHarness();
    render.createEntityMesh.mockClear();

    for (let frame = 0; frame < 600; frame += 1) {
      useCase.execute(squad, targets, 1 / 60);
    }

    expect(render.createEntityMesh.mock.calls.length).toBeGreaterThan(20);
    expect(useCase.activeProjectileCount).toBeGreaterThan(0);
  });
});
