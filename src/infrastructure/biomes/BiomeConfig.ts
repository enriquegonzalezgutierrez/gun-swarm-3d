import type { BiomeId } from './BiomeId';
import type { BiomePalette } from './BiomePalette';

export interface BiomeConfig {
  readonly id: BiomeId;
  readonly name: string;
  readonly trackLength: number;
  readonly accentColor: number;
  readonly palette: BiomePalette;
}
