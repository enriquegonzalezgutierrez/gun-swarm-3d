import { BoundingBox3D } from '../value-objects/BoundingBox3D';
import { Damage } from '../value-objects/Damage';
import { Health } from '../value-objects/Health';
import { Position3D } from '../value-objects/Position3D';
import type { Damageable } from './Damageable';
import { ObstacleType } from './ObstacleType';

const INDESTRUCTIBLE_TYPES: ReadonlySet<ObstacleType> = new Set([
  ObstacleType.RotatingSpikeRoller,
  ObstacleType.SwingingBlade,
]);

export class Obstacle implements Damageable {
  public readonly id: string;
  public readonly type: ObstacleType;
  public readonly position: Position3D;
  public readonly hitbox: BoundingBox3D;
  private currentHealth: Health;

  public constructor(
    id: string,
    type: ObstacleType,
    position: Position3D,
    hitbox: BoundingBox3D,
    health: Health,
  ) {
    if (id.trim().length === 0) {
      throw new RangeError('Obstacle id must not be empty.');
    }
    this.id = id;
    this.type = type;
    this.position = position;
    this.hitbox = hitbox;
    this.currentHealth = health;
  }

  public get health(): Health {
    return this.currentHealth;
  }

  public get isDestructible(): boolean {
    return !INDESTRUCTIBLE_TYPES.has(this.type);
  }

  public get isDestroyed(): boolean {
    return this.isDestructible && this.currentHealth.isDead;
  }

  public applyDamage(damage: Damage): number {
    if (!this.isDestructible || this.isDestroyed) {
      return 0;
    }
    const previous = this.currentHealth.current;
    this.currentHealth = this.currentHealth.applyDamage(damage);
    return previous - this.currentHealth.current;
  }
}
