import type { StoragePort } from '../../application/ports/driven/StoragePort';
import type { SaveGameDTO } from '../../application/dtos/SaveGameDTO';

export const SAVE_STORAGE_KEY = 'gun_swarm_3d_save';

export class LocalStorageAdapter implements StoragePort {
  public constructor(private readonly storage: Storage = window.localStorage) {}

  public async save(data: SaveGameDTO): Promise<void> {
    this.storage.setItem(SAVE_STORAGE_KEY, JSON.stringify(data));
  }

  public async load(): Promise<SaveGameDTO | null> {
    const raw = this.storage.getItem(SAVE_STORAGE_KEY);
    if (raw === null) {
      return null;
    }
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (typeof parsed !== 'object' || parsed === null) {
        return null;
      }
      return parsed as SaveGameDTO;
    } catch {
      return null;
    }
  }

  public async clear(): Promise<void> {
    this.storage.removeItem(SAVE_STORAGE_KEY);
  }
}
