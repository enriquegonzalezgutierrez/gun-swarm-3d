import type { SaveGameDTO } from '../../dtos/SaveGameDTO';

export interface StoragePort {
  save(data: SaveGameDTO): Promise<void>;
  load(): Promise<SaveGameDTO | null>;
  clear(): Promise<void>;
}
