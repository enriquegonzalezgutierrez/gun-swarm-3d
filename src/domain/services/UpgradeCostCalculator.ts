export class UpgradeCostCalculator {
  public static calculate(baseCost: number, currentLevel: number): number {
    if (!Number.isFinite(baseCost) || baseCost < 0) {
      throw new RangeError('Upgrade base cost must be a non-negative finite number.');
    }
    if (!Number.isInteger(currentLevel) || currentLevel < 1) {
      throw new RangeError('Upgrade current level must be a positive integer.');
    }
    return Math.floor(baseCost * Math.pow(1.45, currentLevel - 1));
  }
}
