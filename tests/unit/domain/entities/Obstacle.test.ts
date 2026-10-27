import { describe, expect, it } from 'vitest';
import { Obstacle } from '@domain/entities/Obstacle';
import { ObstacleType } from '@domain/entities/ObstacleType';
import { BoundingBox3D } from '@domain/value-objects/BoundingBox3D';
import { Damage } from '@domain/value-objects/Damage';
import { Health } from '@domain/value-objects/Health';
import { Position3D } from '@domain/value-objects/Position3D';

const HITBOX = BoundingBox3D.fromCenterAndSize(
  Position3D.zero(),
  new Position3D(1, 1, 1),
);

describe('Obstacle', () => {
  it('tracks health for destructible obstacles', () => {
    const crate = new Obstacle(
      'crate-1',
      ObstacleType.WoodCrate,
      Position3D.zero(),
      HITBOX,
      Health.full(10),
    );

    expect(crate.isDestructible).toBe(true);
    expect(crate.isDestroyed).toBe(false);
    expect(crate.applyDamage(new Damage(4))).toBe(4);
    expect(crate.health.current).toBe(6);
  });

  it('is destroyed when health reaches zero', () => {
    const crate = new Obstacle(
      'crate-1',
      ObstacleType.WoodCrate,
      Position3D.zero(),
      HITBOX,
      Health.full(10),
    );

    expect(crate.applyDamage(new Damage(10))).toBe(10);
    expect(crate.isDestroyed).toBe(true);
    expect(crate.health.isDead).toBe(true);
    expect(crate.applyDamage(new Damage(5))).toBe(0);
    expect(crate.health.current).toBe(0);
  });

  it('ignores damage on indestructible obstacles', () => {
    const roller = new Obstacle(
      'roller-1',
      ObstacleType.RotatingSpikeRoller,
      Position3D.zero(),
      HITBOX,
      Health.full(1),
    );
    const blade = new Obstacle(
      'blade-1',
      ObstacleType.SwingingBlade,
      Position3D.zero(),
      HITBOX,
      Health.full(1),
    );

    expect(roller.isDestructible).toBe(false);
    expect(blade.isDestructible).toBe(false);
    expect(roller.applyDamage(new Damage(50))).toBe(0);
    expect(blade.applyDamage(new Damage(50))).toBe(0);
    expect(roller.health.current).toBe(1);
    expect(roller.isDestroyed).toBe(false);
  });

  it('rejects an empty id', () => {
    expect(
      () =>
        new Obstacle(
          '',
          ObstacleType.ConcreteBlock,
          Position3D.zero(),
          HITBOX,
          Health.full(20),
        ),
    ).toThrow(RangeError);
  });
});
