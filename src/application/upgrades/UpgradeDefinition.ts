import type { UpgradeAttribute } from '../dtos/UpgradeAttribute';

export interface UpgradeDefinition {
  readonly attribute: UpgradeAttribute;
  readonly baseCost: number;
  readonly maxLevel: number;
  readonly baseValue: number;
  readonly step: number;
}

export const UPGRADE_CATALOG: Readonly<Record<UpgradeAttribute, UpgradeDefinition>> = {
  startingSquadSize: {
    attribute: 'startingSquadSize',
    baseCost: 100,
    maxLevel: 15,
    baseValue: 1,
    step: 1,
  },
  baseDamageMultiplier: {
    attribute: 'baseDamageMultiplier',
    baseCost: 150,
    maxLevel: 20,
    baseValue: 1,
    step: 0.15,
  },
  coinMultiplier: {
    attribute: 'coinMultiplier',
    baseCost: 80,
    maxLevel: 10,
    baseValue: 1,
    step: 0.2,
  },
};
