import { describe, expect, it } from 'vitest';
import { Boss } from '@domain/entities/Boss';
import { Damage } from '@domain/value-objects/Damage';
import { Position3D } from '@domain/value-objects/Position3D';

function createBoss(): Boss {
  return new Boss('boss-1', 'War Rig', new Position3D(0, 0, 20), 300, 2);
}

describe('Boss', () => {
  it('starts at full health in phase one', () => {
    const boss = createBoss();

    expect(boss.health.current).toBe(300);
    expect(boss.health.max).toBe(300);
    expect(boss.phase).toBe(1);
    expect(boss.isDefeated).toBe(false);
  });

  it('transitions through health phases', () => {
    const boss = createBoss();

    expect(boss.applyDamage(new Damage(120))).toBe(120);
    expect(boss.health.current).toBe(180);
    expect(boss.phase).toBe(2);

    expect(boss.applyDamage(new Damage(90))).toBe(90);
    expect(boss.health.current).toBe(90);
    expect(boss.phase).toBe(3);
  });

  it('is defeated at zero health', () => {
    const boss = createBoss();

    expect(boss.applyDamage(new Damage(500))).toBe(300);
    expect(boss.health.current).toBe(0);
    expect(boss.isDefeated).toBe(true);
    expect(boss.applyDamage(new Damage(10))).toBe(0);
  });

  it('approaches the squad along the negative Z axis', () => {
    const boss = createBoss();
    const approached = boss.approach(1);

    expect(approached.z).toBe(18);
    expect(boss.position.z).toBe(18);
    expect(boss.approach(2.5).z).toBe(13);
  });

  it('stops approaching after defeat', () => {
    const boss = createBoss();
    boss.applyDamage(new Damage(500));
    boss.approach(1);

    expect(boss.position.z).toBe(20);
  });

  it('can be repositioned', () => {
    const boss = createBoss();
    boss.moveTo(new Position3D(3, 0, 50));

    expect(boss.position.equals(new Position3D(3, 0, 50))).toBe(true);
  });

  it('rejects invalid configuration', () => {
    expect(() => new Boss('', 'War Rig', Position3D.zero(), 100)).toThrow(RangeError);
    expect(() => new Boss('boss-1', ' ', Position3D.zero(), 100)).toThrow(RangeError);
    expect(() => new Boss('boss-1', 'War Rig', Position3D.zero(), 0)).toThrow(RangeError);
    expect(
      () => new Boss('boss-1', 'War Rig', Position3D.zero(), 100, -1),
    ).toThrow(RangeError);
    expect(() => createBoss().approach(-1)).toThrow(RangeError);
  });
});
