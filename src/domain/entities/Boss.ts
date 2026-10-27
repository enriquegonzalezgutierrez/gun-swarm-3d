import { Damage } from '../value-objects/Damage';
import { Health } from '../value-objects/Health';
import { Position3D } from '../value-objects/Position3D';
import type { Damageable } from './Damageable';

const PHASE_TWO_THRESHOLD = 2 / 3;
const PHASE_THREE_THRESHOLD = 1 / 3;

export class Boss implements Damageable {
  public readonly id: string;
  public readonly name: string;
  private currentHealth: Health;
  private currentPosition: Position3D;
  private readonly approachSpeed: number;

  public constructor(
    id: string,
    name: string,
    position: Position3D,
    maxHealth: number,
    approachSpeed = 2.0,
  ) {
    if (id.trim().length === 0) {
      throw new RangeError('Boss id must not be empty.');
    }
    if (name.trim().length === 0) {
      throw new RangeError('Boss name must not be empty.');
    }
    if (!Number.isFinite(approachSpeed) || approachSpeed < 0) {
      throw new RangeError('Boss approach speed must be a non-negative number.');
    }
    this.id = id;
    this.name = name;
    this.currentPosition = position;
    this.currentHealth = Health.full(maxHealth);
    this.approachSpeed = approachSpeed;
  }

  public get health(): Health {
    return this.currentHealth;
  }

  public get position(): Position3D {
    return this.currentPosition;
  }

  public get isDefeated(): boolean {
    return this.currentHealth.isDead;
  }

  public get phase(): number {
    const ratio = this.currentHealth.ratio();
    if (ratio > PHASE_TWO_THRESHOLD) {
      return 1;
    }
    if (ratio > PHASE_THREE_THRESHOLD) {
      return 2;
    }
    return 3;
  }

  public applyDamage(damage: Damage): number {
    if (this.isDefeated) {
      return 0;
    }
    const previous = this.currentHealth.current;
    this.currentHealth = this.currentHealth.applyDamage(damage);
    return previous - this.currentHealth.current;
  }

  public approach(deltaTime: number): Position3D {
    if (!Number.isFinite(deltaTime) || deltaTime < 0) {
      throw new RangeError('Boss deltaTime must be a non-negative number.');
    }
    if (!this.isDefeated) {
      this.currentPosition = this.currentPosition.withZ(
        this.currentPosition.z - this.approachSpeed * deltaTime,
      );
    }
    return this.currentPosition;
  }

  public moveTo(position: Position3D): void {
    this.currentPosition = position;
  }
}
