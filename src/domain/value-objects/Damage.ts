export class Damage {
  public readonly amount: number;

  public constructor(amount: number) {
    if (!Number.isFinite(amount) || amount < 0) {
      throw new RangeError('Damage amount must be a non-negative finite number.');
    }
    this.amount = amount;
  }

  public static zero(): Damage {
    return new Damage(0);
  }

  public get isZero(): boolean {
    return this.amount === 0;
  }

  public add(other: Damage): Damage {
    return new Damage(this.amount + other.amount);
  }

  public multiply(factor: number): Damage {
    if (!Number.isFinite(factor) || factor < 0) {
      throw new RangeError('Damage multiplier must be a non-negative finite number.');
    }
    return new Damage(this.amount * factor);
  }

  public equals(other: Damage): boolean {
    return this.amount === other.amount;
  }
}
