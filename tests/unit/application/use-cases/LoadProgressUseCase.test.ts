import { describe, expect, it } from 'vitest';
import { LoadProgressUseCase } from '@application/use-cases/LoadProgressUseCase';
import type { SaveGameDTO } from '@application/dtos/SaveGameDTO';
import { FakeStoragePort } from '../../../fixtures/FakeStoragePort';
import { createDefaultSave } from '../../../fixtures/SaveGameFixture';

describe('LoadProgressUseCase', () => {
  it('creates a default save when storage is empty', async () => {
    const storage = new FakeStoragePort();
    const useCase = new LoadProgressUseCase(storage);

    const save = await useCase.execute();

    expect(storage.load).toHaveBeenCalledTimes(1);
    expect(save).toEqual(createDefaultSave());
  });

  it('restores stored progression and currency', async () => {
    const storage = new FakeStoragePort();
    storage.stored = {
      version: 1,
      currency: { gold: 250 },
      upgrades: {
        startingSquadSize: { level: 3, baseValue: 99, step: 99 },
        baseDamageMultiplier: { level: 4, baseValue: 99, step: 99 },
        coinMultiplier: { level: 5, baseValue: 99, step: 99 },
      },
      progression: { highestUnlockedPhase: 4, lastPlayedPhase: 2 },
    };
    const useCase = new LoadProgressUseCase(storage);

    const save = await useCase.execute();

    expect(save.currency.gold).toBe(250);
    expect(save.upgrades.startingSquadSize.level).toBe(3);
    expect(save.upgrades.baseDamageMultiplier.level).toBe(4);
    expect(save.upgrades.coinMultiplier.level).toBe(5);
    expect(save.upgrades.startingSquadSize.baseValue).toBe(1);
    expect(save.upgrades.baseDamageMultiplier.step).toBe(0.15);
    expect(save.progression).toEqual({ highestUnlockedPhase: 4, lastPlayedPhase: 2 });
  });

  it('falls back to defaults for unsupported versions', async () => {
    const storage = new FakeStoragePort();
    storage.stored = { ...createDefaultSave(), version: 99, currency: { gold: 999 } };
    const useCase = new LoadProgressUseCase(storage);

    expect(await useCase.execute()).toEqual(createDefaultSave());
  });

  it('clamps corrupted values into safe ranges', async () => {
    const storage = new FakeStoragePort();
    storage.stored = {
      version: 1,
      currency: { gold: -50 },
      upgrades: {
        startingSquadSize: { level: 0, baseValue: 1, step: 1 },
        baseDamageMultiplier: { level: 999, baseValue: 1, step: 0.15 },
        coinMultiplier: { level: 2.5, baseValue: 1, step: 0.2 },
      },
      progression: { highestUnlockedPhase: 99, lastPlayedPhase: 0 },
    } satisfies SaveGameDTO;
    const useCase = new LoadProgressUseCase(storage);

    const save = await useCase.execute();

    expect(save.currency.gold).toBe(0);
    expect(save.upgrades.startingSquadSize.level).toBe(1);
    expect(save.upgrades.baseDamageMultiplier.level).toBe(20);
    expect(save.upgrades.coinMultiplier.level).toBe(1);
    expect(save.progression).toEqual({ highestUnlockedPhase: 5, lastPlayedPhase: 1 });
  });

  it('preserves custom progression within phase bounds', async () => {
    const storage = new FakeStoragePort();
    const base = createDefaultSave();
    storage.stored = {
      ...base,
      progression: { highestUnlockedPhase: 5, lastPlayedPhase: 3 },
    };
    const useCase = new LoadProgressUseCase(storage);

    const save = await useCase.execute();

    expect(save.progression.highestUnlockedPhase).toBe(5);
    expect(save.progression.lastPlayedPhase).toBe(3);
  });
});
