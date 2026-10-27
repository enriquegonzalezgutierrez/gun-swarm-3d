import type { Group } from 'three';
import { ArcticFortressBiomeFactory } from './ArcticFortressBiomeFactory';
import { BiomeRegistry } from './BiomeRegistry';
import { CyberVoidBiomeFactory } from './CyberVoidBiomeFactory';
import { MetropolisBiomeFactory } from './MetropolisBiomeFactory';
import { ScorchedCanyonBiomeFactory } from './ScorchedCanyonBiomeFactory';
import { ToxicFoundryBiomeFactory } from './ToxicFoundryBiomeFactory';

export class BiomeFactoryRegistry {
  public static create(biomeId: number): Group {
    BiomeRegistry.get(biomeId);
    switch (biomeId) {
      case 1:
        return new MetropolisBiomeFactory().createScenery();
      case 2:
        return new ScorchedCanyonBiomeFactory().createScenery();
      case 3:
        return new ToxicFoundryBiomeFactory().createScenery();
      case 4:
        return new ArcticFortressBiomeFactory().createScenery();
      case 5:
        return new CyberVoidBiomeFactory().createScenery();
      default:
        throw new Error(`Unsupported biome id: ${biomeId}.`);
    }
  }
}
