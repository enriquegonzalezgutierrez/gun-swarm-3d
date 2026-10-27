import { vi } from 'vitest';
import type { StoragePort } from '@application/ports/driven/StoragePort';
import type { SaveGameDTO } from '@application/dtos/SaveGameDTO';

export class FakeStoragePort implements StoragePort {
  public stored: SaveGameDTO | null = null;

  public readonly save = vi.fn(async (data: SaveGameDTO): Promise<void> => {
    this.stored = data;
  });

  public readonly load = vi.fn(async (): Promise<SaveGameDTO | null> => this.stored);

  public readonly clear = vi.fn(async (): Promise<void> => {
    this.stored = null;
  });
}
