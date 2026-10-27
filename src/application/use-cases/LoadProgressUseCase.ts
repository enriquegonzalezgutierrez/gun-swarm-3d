import type { SaveGameDTO } from '../dtos/SaveGameDTO';
import type { UpgradeAttribute } from '../dtos/UpgradeAttribute';
import type { UpgradeStateDTO } from '../dtos/UpgradeStateDTO';
import { UPGRADE_CATALOG } from '../upgrades/UpgradeDefinition';
import type { StoragePort } from '../ports/driven/StoragePort';

const SAVE_VERSION = 1;
const MAX_PHASE = 5;

export class LoadProgressUseCase {
  public constructor(private readonly storage: StoragePort) {}

  public async execute(): Promise<SaveGameDTO> {
    const stored = await this.storage.load();
    if (stored === null) {
      return this.createDefaultSave();
    }
    return this.restore(stored);
  }

  private restore(loaded: SaveGameDTO): SaveGameDTO {
    if (loaded.version !== SAVE_VERSION) {
      return this.createDefaultSave();
    }
    return {
      version: SAVE_VERSION,
      currency: {
        gold: this.clampInteger(loaded.currency?.gold, 0, Number.MAX_SAFE_INTEGER, 0),
      },
      upgrades: {
        startingSquadSize: this.restoreUpgrade(
          'startingSquadSize',
          loaded.upgrades?.startingSquadSize?.level,
        ),
        baseDamageMultiplier: this.restoreUpgrade(
          'baseDamageMultiplier',
          loaded.upgrades?.baseDamageMultiplier?.level,
        ),
        coinMultiplier: this.restoreUpgrade(
          'coinMultiplier',
          loaded.upgrades?.coinMultiplier?.level,
        ),
      },
      progression: {
        highestUnlockedPhase: this.clampInteger(
          loaded.progression?.highestUnlockedPhase,
          1,
          MAX_PHASE,
          1,
        ),
        lastPlayedPhase: this.clampInteger(
          loaded.progression?.lastPlayedPhase,
          1,
          MAX_PHASE,
          1,
        ),
      },
    };
  }

  private restoreUpgrade(attribute: UpgradeAttribute, level: unknown): UpgradeStateDTO {
    const definition = UPGRADE_CATALOG[attribute];
    return {
      level: this.clampInteger(level, 1, definition.maxLevel, 1),
      baseValue: definition.baseValue,
      step: definition.step,
    };
  }

  private createDefaultSave(): SaveGameDTO {
    return {
      version: SAVE_VERSION,
      currency: { gold: 0 },
      upgrades: {
        startingSquadSize: this.defaultUpgrade('startingSquadSize'),
        baseDamageMultiplier: this.defaultUpgrade('baseDamageMultiplier'),
        coinMultiplier: this.defaultUpgrade('coinMultiplier'),
      },
      progression: {
        highestUnlockedPhase: 1,
        lastPlayedPhase: 1,
      },
    };
  }

  private defaultUpgrade(attribute: UpgradeAttribute): UpgradeStateDTO {
    const definition = UPGRADE_CATALOG[attribute];
    return {
      level: 1,
      baseValue: definition.baseValue,
      step: definition.step,
    };
  }

  private clampInteger(
    value: unknown,
    min: number,
    max: number,
    fallback: number,
  ): number {
    if (typeof value !== 'number' || !Number.isInteger(value)) {
      return fallback;
    }
    return Math.min(max, Math.max(min, value));
  }
}
