import { Damage } from './Damage';

export class Health {
  public readonly max: number;
  public readonly current: number;

  public constructor(max: number, current: number = max) {
    if (!Number.isInteger(max) || max < 1) {
      throw new RangeError('Health maximum must be a positive integer.');
    }
    if (!Number.isInteger(current) || current < 0 || current > max) {
      throw new RangeError('Health current must be an integer between 0 and the maximum.');
    }
    this.max = max;
    this.current = current;
  }

  public static full(max: number): Health {
    return new Health(max);
  }

  public get isAlive(): boolean {
    return this.current > 0;
  }

  public get isDead(): boolean {
    return this.current === 0;
  }

  public applyDamage(damage: Damage): Health {
    const points = Math.max(0, Math.round(damage.amount));
    return new Health(this.max, Math.max(0, this.current - points));
  }

  public heal(amount: number): Health {
    if (!Number.isFinite(amount) || amount < 0) {
      throw new RangeError('Health heal amount must be a non-negative number.');
    }
    return new Health(this.max, Math.min(this.max, this.current + Math.round(amount)));
  }

  public ratio(): number {
    return this.current / this.max;
  }

  public equals(other: Health): boolean {
    return this.max === other.max && this.current === other.current;
  }
}
