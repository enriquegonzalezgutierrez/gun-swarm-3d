import { describe, expect, it } from 'vitest';
import {
  LocalStorageAdapter,
  SAVE_STORAGE_KEY,
} from '@infrastructure/storage/LocalStorageAdapter';
import { createDefaultSave } from '../../fixtures/SaveGameFixture';
import { MemoryStorage } from '../../fixtures/MemoryStorage';

describe('LocalStorageAdapter integration', () => {
  it('persists and restores a save under the canonical key', async () => {
    const storage = new MemoryStorage();
    const adapter = new LocalStorageAdapter(storage);
    const save = createDefaultSave();

    await adapter.save(save);

    const raw = storage.getItem(SAVE_STORAGE_KEY);
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw ?? 'null')).toEqual(save);
    expect(await adapter.load()).toEqual(save);
  });

  it('overwrites previous save data', async () => {
    const storage = new MemoryStorage();
    const adapter = new LocalStorageAdapter(storage);
    const first = createDefaultSave();
    const second = { ...first, currency: { gold: 1250 } };

    await adapter.save(first);
    await adapter.save(second);

    expect((await adapter.load())?.currency.gold).toBe(1250);
  });

  it('clears persisted data', async () => {
    const storage = new MemoryStorage();
    const adapter = new LocalStorageAdapter(storage);
    await adapter.save(createDefaultSave());

    await adapter.clear();

    expect(storage.getItem(SAVE_STORAGE_KEY)).toBeNull();
    expect(await adapter.load()).toBeNull();
  });

  it('returns null when no save exists', async () => {
    const adapter = new LocalStorageAdapter(new MemoryStorage());

    expect(await adapter.load()).toBeNull();
  });

  it('returns null for malformed or non-object payloads', async () => {
    const storage = new MemoryStorage();
    const adapter = new LocalStorageAdapter(storage);

    storage.setItem(SAVE_STORAGE_KEY, '{not-json');
    expect(await adapter.load()).toBeNull();

    storage.setItem(SAVE_STORAGE_KEY, '42');
    expect(await adapter.load()).toBeNull();

    storage.setItem(SAVE_STORAGE_KEY, 'null');
    expect(await adapter.load()).toBeNull();
  });
});
