import { Group } from 'three';
import { MeshAssembly } from '../rendering/MeshAssembly';
import { BiomePropPlacer } from './BiomePropPlacer';
import type { BiomeSceneryFactory } from './BiomeSceneryFactory';

const TRACK_LENGTH = 250;
const RUST = 0x8d4a2f;
const ROCK = 0x5a2d16;
const METAL = 0x4e342e;

export class ScorchedCanyonBiomeFactory implements BiomeSceneryFactory {
  public createScenery(): Group {
    const scenery = new Group();
    BiomePropPlacer.scatter(scenery, TRACK_LENGTH, 42, (_index, side, z) =>
      this.createPumpjack(side, z),
    );
    BiomePropPlacer.scatter(scenery, TRACK_LENGTH, 26, (index, side, z) =>
      this.createRockSpire(side, z, index),
    );
    BiomePropPlacer.scatter(scenery, TRACK_LENGTH, 68, (_index, side, z) =>
      this.createRustedCar(side, z),
    );
    for (let z = 80; z < TRACK_LENGTH; z += 55) {
      scenery.add(this.createBarbedBarrier(z));
    }
    return scenery;
  }

  private createPumpjack(side: number, z: number): Group {
    const assembly = new MeshAssembly();
    assembly.addBox([1.6, 0.3, 1.2], METAL, [side * 7, 0.15, z]);
    assembly.addBox([0.16, 2, 0.16], METAL, [side * 7, 1.1, z], [0, 0, side * 0.35]);
    assembly.addBox([2.4, 0.18, 0.18], RUST, [side * 6.1, 2.1, z]);
    assembly.addBox([0.55, 0.45, 0.4], RUST, [side * 4.9, 2.1, z]);
    assembly.addCylinder(0.3, 0.3, 1.1, METAL, [side * 7.65, 0.55, z], [Math.PI / 2, 0, 0]);
    return assembly.build();
  }

  private createRockSpire(side: number, z: number, index: number): Group {
    const assembly = new MeshAssembly();
    const offset = side * (8.5 + (index % 3) * 1.2);
    assembly.addCylinder(1.3, 1.6, 2.2, ROCK, [offset, 1.1, z], [0, index * 0.4, 0.08]);
    assembly.addCylinder(0.8, 1.15, 2.4, 0x7a3a1c, [offset, 3.4, z], [0, index * 0.3, 0]);
    assembly.addCone(0.5, 1.8, 0x8d4a2f, [offset, 5.5, z]);
    return assembly.build();
  }

  private createRustedCar(side: number, z: number): Group {
    const assembly = new MeshAssembly();
    const x = side * 9;
    assembly.addBox([2.2, 0.5, 1], RUST, [x, 0.55, z], [0, 0, side * 0.06]);
    assembly.addBox([1.2, 0.4, 0.9], 0x6d3b1f, [x, 0.98, z - 0.1]);
    for (const wheelX of [-0.7, 0.7]) {
      for (const wheelZ of [-0.48, 0.48]) {
        assembly.addCylinder(0.28, 0.28, 0.18, 0x212121, [x + wheelX, 0.3, z + wheelZ], [Math.PI / 2, 0, 0]);
      }
    }
    return assembly.build();
  }

  private createBarbedBarrier(z: number): Group {
    const assembly = new MeshAssembly();
    assembly.addCylinder(0.06, 0.06, 1.6, METAL, [-4.9, 0.8, z], [0, 0, Math.PI / 2]);
    assembly.addCylinder(0.06, 0.06, 1.6, METAL, [4.9, 0.8, z], [0, 0, Math.PI / 2]);
    for (const y of [0.55, 0.85, 1.15]) {
      assembly.addBox([9.8, 0.025, 0.025], 0x9e9e9e, [0, y, z]);
    }
    return assembly.build();
  }
}
