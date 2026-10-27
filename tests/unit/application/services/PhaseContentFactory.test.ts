import { describe, expect, it } from 'vitest';
import { PhaseContentFactory } from '@application/services/PhaseContentFactory';
import { PhaseCatalog } from '@infrastructure/levels/PhaseCatalog';
import { PickupType } from '@domain/entities/PickupType';
import { GateLane } from '@domain/entities/GateLane';

describe('PhaseContentFactory', () => {
  it('builds gates, obstacles, pickups and a boss for phase one', () => {
    const config = PhaseCatalog.get(1);
    const content = new PhaseContentFactory().create(config);

    expect(content.gates).toHaveLength(6);
    expect(content.gates.every((gate) => gate.position.z < config.trackLength)).toBe(true);
    expect(new Set(content.gates.map((gate) => gate.id)).size).toBe(6);
    expect(content.gates.some((gate) => gate.lane === GateLane.Left)).toBe(true);
    expect(content.gates.some((gate) => gate.lane === GateLane.Right)).toBe(true);

    expect(content.obstacles.size).toBe(6);
    expect(content.obstacles.size).toBeGreaterThan(0);
    expect(content.pickups.size).toBe(6);
    expect(content.boss.health.max).toBe(config.bossMaxHealth);
    expect(content.boss.position.z).toBe(config.trackLength + 20);
  });

  it('includes coins, a shield orb and a weapon chest', () => {
    const content = new PhaseContentFactory().create(PhaseCatalog.get(3));
    const types = [...content.pickups.values()].map((pickup) => pickup.type);

    expect(types.filter((type) => type === PickupType.GoldCoin).length).toBeGreaterThan(0);
    expect(types).toContain(PickupType.ShieldOrb);
    expect(types).toContain(PickupType.WeaponChest);
  });

  it('scales content with longer phases', () => {
    const first = new PhaseContentFactory().create(PhaseCatalog.get(1));
    const last = new PhaseContentFactory().create(PhaseCatalog.get(5));

    expect(last.gates.length).toBeGreaterThan(first.gates.length);
    expect(last.obstacles.size).toBeGreaterThan(first.obstacles.size);
    expect(last.pickups.size).toBeGreaterThan(first.pickups.size);
  });

  it('keeps every obstacle anchored to the ground and inside the track', () => {
    const config = PhaseCatalog.get(2);
    const content = new PhaseContentFactory().create(config);

    for (const obstacle of content.obstacles.values()) {
      expect(obstacle.position.y).toBe(0);
      expect(obstacle.position.z).toBeLessThan(config.trackLength);
      expect(Math.abs(obstacle.position.x)).toBeLessThan(4.5);
      expect(obstacle.hitbox.center.y).toBeGreaterThan(0);
    }
  });
});
