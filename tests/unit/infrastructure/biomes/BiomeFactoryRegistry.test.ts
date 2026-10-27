import { describe, expect, it } from 'vitest';
import { Group, Mesh, Points } from 'three';
import { BiomeFactoryRegistry } from '@infrastructure/biomes/BiomeFactoryRegistry';

const BIOME_IDS = [1, 2, 3, 4, 5] as const;

describe('BiomeFactoryRegistry', () => {
  it.each(BIOME_IDS)('builds procedural scenery for biome %i', (biomeId) => {
    const scenery = BiomeFactoryRegistry.create(biomeId);

    let meshCount = 0;
    let hasSideProp = false;
    scenery.traverse((object) => {
      if (object instanceof Mesh) {
        meshCount += 1;
        if (Math.abs(object.position.x) > 4) {
          hasSideProp = true;
        }
      }
    });

    expect(scenery).toBeInstanceOf(Group);
    expect(scenery.children.length).toBeGreaterThan(0);
    expect(meshCount).toBeGreaterThan(0);
    expect(hasSideProp).toBe(true);
  });

  it('adds a procedural starfield to the Cyber Void biome', () => {
    const scenery = BiomeFactoryRegistry.create(5);
    let pointClouds = 0;
    scenery.traverse((object) => {
      if (object instanceof Points) {
        pointClouds += 1;
      }
    });

    expect(pointClouds).toBe(1);
  });

  it('rejects unsupported biome ids', () => {
    expect(() => BiomeFactoryRegistry.create(0)).toThrow(RangeError);
    expect(() => BiomeFactoryRegistry.create(6)).toThrow(RangeError);
  });
});
