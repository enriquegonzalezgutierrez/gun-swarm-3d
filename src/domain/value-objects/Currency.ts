export class Currency {
  public readonly gold: number;

  public constructor(gold = 0) {
    Currency.assertAmount(gold, 'gold');
    this.gold = gold;
  }

  public static zero(): Currency {
    return new Currency(0);
  }

  public add(amount: number): Currency {
    Currency.assertAmount(amount, 'amount');
    return new Currency(this.gold + amount);
  }

  public deduct(amount: number): Currency {
    Currency.assertAmount(amount, 'amount');
    if (amount > this.gold) {
      throw new RangeError(
        `Insufficient gold: requested ${amount}, available ${this.gold}.`,
      );
    }
    return new Currency(this.gold - amount);
  }

  public canAfford(amount: number): boolean {
    Currency.assertAmount(amount, 'amount');
    return amount <= this.gold;
  }

  public equals(other: Currency): boolean {
    return this.gold === other.gold;
  }

  private static assertAmount(amount: number, label: string): void {
    if (!Number.isInteger(amount) || amount < 0) {
      throw new RangeError(`Currency ${label} must be a non-negative integer.`);
    }
  }
}
