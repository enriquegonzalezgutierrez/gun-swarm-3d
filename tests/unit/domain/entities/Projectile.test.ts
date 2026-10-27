import { describe, expect, it } from 'vitest';
import { Projectile } from '@domain/entities/Projectile';
import { Damage } from '@domain/value-objects/Damage';
import { Position3D } from '@domain/value-objects/Position3D';
import { Velocity3D } from '@domain/value-objects/Velocity3D';

describe('Projectile', () => {
  it('exposes its combat payload', () => {
    const projectile = new Projectile(
      'bullet-1',
      new Position3D(0, 1, 0),
      new Velocity3D(0, 0, 45),
      new Damage(2),
    );

    expect(projectile.id).toBe('bullet-1');
    expect(projectile.position.equals(new Position3D(0, 1, 0))).toBe(true);
    expect(projectile.damage.amount).toBe(2);
    expect(projectile.isActive).toBe(true);
    expect(projectile.remainingPenetrations).toBe(0);
  });

  it('advances along its velocity', () => {
    const projectile = new Projectile(
      'bullet-1',
      Position3D.zero(),
      new Velocity3D(0, 0, 10),
      new Damage(1),
    );

    expect(projectile.advance(0.5).equals(new Position3D(0, 0, 5))).toBe(true);
    expect(projectile.advance(0.5).equals(new Position3D(0, 0, 10))).toBe(true);
  });

  it('deactivates after a hit without penetration', () => {
    const projectile = new Projectile(
      'bullet-1',
      Position3D.zero(),
      Velocity3D.zero(),
      new Damage(1),
    );

    expect(projectile.registerHit()).toBe(false);
    expect(projectile.isActive).toBe(false);
    expect(projectile.registerHit()).toBe(false);
  });

  it('survives hits while penetration remains', () => {
    const projectile = new Projectile(
      'bullet-1',
      Position3D.zero(),
      Velocity3D.zero(),
      new Damage(2),
      2,
    );

    expect(projectile.registerHit()).toBe(true);
    expect(projectile.remainingPenetrations).toBe(1);
    expect(projectile.registerHit()).toBe(true);
    expect(projectile.remainingPenetrations).toBe(0);
    expect(projectile.registerHit()).toBe(false);
    expect(projectile.isActive).toBe(false);
  });

  it('can be deactivated explicitly', () => {
    const projectile = new Projectile(
      'bullet-1',
      Position3D.zero(),
      Velocity3D.zero(),
      new Damage(1),
    );
    projectile.deactivate();

    expect(projectile.isActive).toBe(false);
    expect(projectile.registerHit()).toBe(false);
  });

  it('rejects invalid identifiers, penetration and time steps', () => {
    expect(
      () =>
        new Projectile('', Position3D.zero(), Velocity3D.zero(), new Damage(1)),
    ).toThrow(RangeError);
    expect(
      () =>
        new Projectile('bullet-1', Position3D.zero(), Velocity3D.zero(), new Damage(1), -1),
    ).toThrow(RangeError);

    const projectile = new Projectile(
      'bullet-1',
      Position3D.zero(),
      Velocity3D.zero(),
      new Damage(1),
    );
    expect(() => projectile.advance(-0.1)).toThrow(RangeError);
  });
});
