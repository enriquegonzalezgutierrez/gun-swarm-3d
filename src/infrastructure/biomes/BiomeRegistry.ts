import type { BiomeConfig } from './BiomeConfig';
import type { BiomeId } from './BiomeId';

const CONFIGS: Readonly<Record<BiomeId, BiomeConfig>> = {
  1: {
    id: 1,
    name: 'Metropolis Boulevard',
    trackLength: 220,
    accentColor: 0x00e5ff,
    palette: { background: 0x0c0d14, fogColor: 0x0c0d14, fogNear: 60, fogFar: 150 },
  },
  2: {
    id: 2,
    name: 'Scorched Canyon',
    trackLength: 250,
    accentColor: 0xff5722,
    palette: { background: 0x2a1208, fogColor: 0x2a1208, fogNear: 50, fogFar: 130 },
  },
  3: {
    id: 3,
    name: 'Toxic Foundry',
    trackLength: 280,
    accentColor: 0x76ff03,
    palette: { background: 0x121f15, fogColor: 0x121f15, fogNear: 45, fogFar: 120 },
  },
  4: {
    id: 4,
    name: 'Arctic Fortress',
    trackLength: 300,
    accentColor: 0xffb300,
    palette: { background: 0xb0bec5, fogColor: 0xb0bec5, fogNear: 40, fogFar: 110 },
  },
  5: {
    id: 5,
    name: 'Cyber Void',
    trackLength: 350,
    accentColor: 0xd500f9,
    palette: { background: 0x1a002c, fogColor: 0x1a002c, fogNear: 50, fogFar: 160 },
  },
};

export class BiomeRegistry {
  public static get(id: number): BiomeConfig {
    if (!Number.isInteger(id) || id < 1 || id > 5) {
      throw new RangeError('Biome id must be an integer between 1 and 5.');
    }
    return CONFIGS[id as BiomeId];
  }

  public static getAll(): readonly BiomeConfig[] {
    return Object.values(CONFIGS);
  }
}
