import { Projectile } from '../../domain/entities/Projectile';
import type { Damageable } from '../../domain/entities/Damageable';
import { BoundingBox3D } from '../../domain/value-objects/BoundingBox3D';
import { Damage } from '../../domain/value-objects/Damage';
import { Position3D } from '../../domain/value-objects/Position3D';
import { Velocity3D } from '../../domain/value-objects/Velocity3D';
import type { PhysicsPort } from '../ports/driven/PhysicsPort';
import type { RenderPort } from '../ports/driven/RenderPort';

const PROJECTILE_MAX_DISTANCE = 100;
const PROJECTILE_SIZE = new Position3D(0.2, 0.2, 0.2);

export class ProjectilePool {
  private readonly projectiles = new Map<string, Projectile>();
  private nextProjectileId = 1;

  public constructor(
    private readonly physics: PhysicsPort,
    private readonly render: RenderPort,
  ) {}

  public get size(): number {
    return this.projectiles.size;
  }

  public spawn(
    position: Position3D,
    damage: number,
    speed: number,
    penetration: number,
  ): void {
    const id = `projectile-${this.nextProjectileId}`;
    this.nextProjectileId += 1;
    const projectile = new Projectile(
      id,
      position,
      new Velocity3D(0, 0, speed),
      new Damage(damage),
      penetration,
    );
    this.projectiles.set(id, projectile);
    this.render.createEntityMesh(id, 'projectile', position);
    this.physics.registerCollider(
      id,
      BoundingBox3D.fromCenterAndSize(position, PROJECTILE_SIZE),
      false,
    );
  }

  public update(
    targets: ReadonlyMap<string, Damageable>,
    deltaTimeSeconds: number,
  ): void {
    for (const projectile of [...this.projectiles.values()]) {
      const position = projectile.advance(deltaTimeSeconds);
      this.render.updateEntityTransform(projectile.id, position);
      this.physics.updateColliderPosition(projectile.id, position);
      if (position.z > PROJECTILE_MAX_DISTANCE) {
        this.remove(projectile.id);
        continue;
      }
      const overlappingIds = this.physics.queryOverlaps(projectile.id);
      const targetId = overlappingIds.find((id) => targets.has(id));
      if (targetId === undefined) {
        continue;
      }
      const target = targets.get(targetId);
      if (target === undefined) {
        continue;
      }
      target.applyDamage(projectile.damage);
      if (!projectile.registerHit()) {
        this.remove(projectile.id);
      }
    }
  }

  public clear(): void {
    for (const id of [...this.projectiles.keys()]) {
      this.remove(id);
    }
  }

  private remove(id: string): void {
    this.projectiles.delete(id);
    this.render.removeEntityMesh(id);
    this.physics.removeCollider(id);
  }
}
