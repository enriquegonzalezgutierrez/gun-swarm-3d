import type { SaveGameDTO } from '@application/dtos/SaveGameDTO';

export function createDefaultSave(): SaveGameDTO {
  return {
    version: 1,
    currency: { gold: 0 },
    upgrades: {
      startingSquadSize: { level: 1, baseValue: 1, step: 1 },
      baseDamageMultiplier: { level: 1, baseValue: 1, step: 0.15 },
      coinMultiplier: { level: 1, baseValue: 1, step: 0.2 },
    },
    progression: {
      highestUnlockedPhase: 1,
      lastPlayedPhase: 1,
    },
  };
}
