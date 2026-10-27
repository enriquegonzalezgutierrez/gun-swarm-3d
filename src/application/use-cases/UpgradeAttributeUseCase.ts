import { UpgradeCostCalculator } from '../../domain/services/UpgradeCostCalculator';
import type { SaveGameDTO } from '../dtos/SaveGameDTO';
import type { UpgradeAttribute } from '../dtos/UpgradeAttribute';
import { UPGRADE_CATALOG } from '../upgrades/UpgradeDefinition';

export class UpgradeAttributeUseCase {
  public calculateCost(attribute: UpgradeAttribute, currentLevel: number): number {
    const definition = UPGRADE_CATALOG[attribute];
    if (!Number.isInteger(currentLevel) || currentLevel < 1) {
      throw new RangeError('Upgrade current level must be a positive integer.');
    }
    if (currentLevel >= definition.maxLevel) {
      throw new Error(
        `Upgrade ${attribute} is already at maximum level ${definition.maxLevel}.`,
      );
    }
    return UpgradeCostCalculator.calculate(definition.baseCost, currentLevel);
  }

  public execute(save: SaveGameDTO, attribute: UpgradeAttribute): SaveGameDTO {
    const state = save.upgrades[attribute];
    const cost = this.calculateCost(attribute, state.level);
    if (save.currency.gold < cost) {
      throw new Error(
        `Insufficient gold: ${attribute} costs ${cost}, available ${save.currency.gold}.`,
      );
    }
    return {
      ...save,
      currency: { gold: save.currency.gold - cost },
      upgrades: {
        ...save.upgrades,
        [attribute]: { ...state, level: state.level + 1 },
      },
      progression: { ...save.progression },
    };
  }
}
