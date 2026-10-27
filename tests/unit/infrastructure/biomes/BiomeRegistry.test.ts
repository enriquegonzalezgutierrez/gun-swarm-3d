import { describe, expect, it } from 'vitest';
import { BiomeRegistry } from '@infrastructure/biomes/BiomeRegistry';

const EXPECTED: ReadonlyArray<readonly [number, string, number]> = [
  [1, 'Metropolis Boulevard', 220],
  [2, 'Scorched Canyon', 250],
  [3, 'Toxic Foundry', 280],
  [4, 'Arctic Fortress', 300],
  [5, 'Cyber Void', 350],
];

describe('BiomeRegistry', () => {
  it.each(EXPECTED)('returns the configuration for biome %i', (id, name, trackLength) => {
    const config = BiomeRegistry.get(id);

    expect(config.id).toBe(id);
    expect(config.name).toBe(name);
    expect(config.trackLength).toBe(trackLength);
    expect(config.palette.fogNear).toBeGreaterThan(0);
    expect(config.palette.fogFar).toBeGreaterThan(config.palette.fogNear);
  });

  it('exposes all five biome configurations in order', () => {
    const configs = BiomeRegistry.getAll();

    expect(configs).toHaveLength(5);
    expect(configs.map((config) => config.id)).toEqual([1, 2, 3, 4, 5]);
    expect(configs[2]?.accentColor).toBe(0x76ff03);
    expect(configs[4]?.palette.background).toBe(0x1a002c);
  });

  it('rejects invalid biome ids', () => {
    expect(() => BiomeRegistry.get(0)).toThrow(RangeError);
    expect(() => BiomeRegistry.get(6)).toThrow(RangeError);
    expect(() => BiomeRegistry.get(1.5)).toThrow(RangeError);
  });
});
