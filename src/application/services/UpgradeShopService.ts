import type { SaveGameDTO } from '../dtos/SaveGameDTO';
import type { UpgradeAttribute } from '../dtos/UpgradeAttribute';
import type { UpgradeShopItem } from '../dtos/UpgradeShopItem';
import { UpgradeCostCalculator } from '../../domain/services/UpgradeCostCalculator';
import { UPGRADE_CATALOG } from '../upgrades/UpgradeDefinition';

const LABELS: Readonly<Record<UpgradeAttribute, string>> = {
  startingSquadSize: 'Starting Squad',
  baseDamageMultiplier: 'Base Damage',
  coinMultiplier: 'Coin Multiplier',
};

export class UpgradeShopService {
  public list(save: SaveGameDTO): readonly UpgradeShopItem[] {
    return (Object.keys(UPGRADE_CATALOG) as UpgradeAttribute[]).map((attribute) => {
      const definition = UPGRADE_CATALOG[attribute];
      const state = save.upgrades[attribute];
      const maxed = state.level >= definition.maxLevel;
      const cost = maxed
        ? 0
        : UpgradeCostCalculator.calculate(definition.baseCost, state.level);
      return {
        attribute,
        label: LABELS[attribute],
        level: state.level,
        maxLevel: definition.maxLevel,
        cost,
        affordable: !maxed && save.currency.gold >= cost,
        maxed,
      };
    });
  }
}
