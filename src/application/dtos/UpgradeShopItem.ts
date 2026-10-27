import type { UpgradeAttribute } from './UpgradeAttribute';

export interface UpgradeShopItem {
  readonly attribute: UpgradeAttribute;
  readonly label: string;
  readonly level: number;
  readonly maxLevel: number;
  readonly cost: number;
  readonly affordable: boolean;
  readonly maxed: boolean;
}
