import { Damage } from '../value-objects/Damage';
import { Position3D } from '../value-objects/Position3D';
import { Velocity3D } from '../value-objects/Velocity3D';

export class Projectile {
  public readonly id: string;
  public readonly velocity: Velocity3D;
  public readonly damage: Damage;
  private readonly origin: Position3D;
  private currentPosition: Position3D;
  private penetrationsLeft: number;
  private active = true;

  public constructor(
    id: string,
    position: Position3D,
    velocity: Velocity3D,
    damage: Damage,
    penetrationCount = 0,
  ) {
    if (id.trim().length === 0) {
      throw new RangeError('Projectile id must not be empty.');
    }
    if (!Number.isInteger(penetrationCount) || penetrationCount < 0) {
      throw new RangeError('Projectile penetration count must be a non-negative integer.');
    }
    this.id = id;
    this.currentPosition = position;
    this.origin = position;
    this.velocity = velocity;
    this.damage = damage;
    this.penetrationsLeft = penetrationCount;
  }

  public get position(): Position3D {
    return this.currentPosition;
  }

  public get isActive(): boolean {
    return this.active;
  }

  public get remainingPenetrations(): number {
    return this.penetrationsLeft;
  }

  public get travelledDistance(): number {
    return this.currentPosition.distanceTo(this.origin);
  }

  public advance(deltaTime: number): Position3D {
    if (!Number.isFinite(deltaTime) || deltaTime < 0) {
      throw new RangeError('Projectile deltaTime must be a non-negative number.');
    }
    this.currentPosition = this.velocity.applyTo(this.currentPosition, deltaTime);
    return this.currentPosition;
  }

  public registerHit(): boolean {
    if (!this.active) {
      return false;
    }
    if (this.penetrationsLeft > 0) {
      this.penetrationsLeft -= 1;
      return true;
    }
    this.active = false;
    return false;
  }

  public deactivate(): void {
    this.active = false;
  }
}
