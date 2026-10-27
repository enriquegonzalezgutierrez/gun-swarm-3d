import { ConeGeometry, Group, Mesh, MeshStandardMaterial } from 'three';
import { MeshAssembly } from '../rendering/MeshAssembly';
import { BiomePropPlacer } from './BiomePropPlacer';
import type { BiomeSceneryFactory } from './BiomeSceneryFactory';

const TRACK_LENGTH = 300;
const SNOW = 0xe3f2fd;
const WOOD = 0x5d4037;
const PINE = 0x1b5e20;
const AMBER = 0xffb300;

export class ArcticFortressBiomeFactory implements BiomeSceneryFactory {
  public createScenery(): Group {
    const scenery = new Group();
    BiomePropPlacer.scatter(scenery, TRACK_LENGTH, 60, (_index, side, z) =>
      this.createWatchtower(side, z),
    );
    BiomePropPlacer.scatter(scenery, TRACK_LENGTH, 24, (index, side, z) =>
      this.createPine(side, z, index),
    );
    BiomePropPlacer.scatter(scenery, TRACK_LENGTH, 72, (_index, side, z) =>
      this.createBunker(side, z),
    );
    for (let z = 90; z < TRACK_LENGTH; z += 90) {
      scenery.add(this.createSearchlight(-1, z));
      scenery.add(this.createSearchlight(1, z + 45));
    }
    return scenery;
  }

  private createWatchtower(side: number, z: number): Group {
    const assembly = new MeshAssembly();
    const x = side * 10;
    for (const legX of [-0.8, 0.8]) {
      for (const legZ of [-0.8, 0.8]) {
        assembly.addCylinder(0.1, 0.12, 4, WOOD, [x + legX, 2, z + legZ]);
      }
    }
    assembly.addBox([2, 0.25, 2], 0x4e342e, [x, 4.1, z]);
    assembly.addCone(1.5, 0.9, SNOW, [x, 5.1, z], undefined, 4);
    assembly.addBox([0.4, 0.3, 0.4], AMBER, [x, 4.4, z + 0.9]);
    return assembly.build();
  }

  private createPine(side: number, z: number, index: number): Group {
    const assembly = new MeshAssembly();
    const x = side * (7 + (index % 3) * 1.4);
    const height = 1.2 + (index % 4) * 0.25;
    assembly.addCylinder(0.14, 0.2, 2.2, WOOD, [x, 1.1, z]);
    assembly.addCone(1.3, 2, PINE, [x, 2.5, z]);
    assembly.addCone(1, 1.8, PINE, [x, 3.4, z]);
    assembly.addCone(0.7, 1.5, SNOW, [x, 4.2, z]);
    assembly.addBox([0.4, 0.15, 0.4], SNOW, [x, height, z]);
    return assembly.build();
  }

  private createBunker(side: number, z: number): Group {
    const assembly = new MeshAssembly();
    const x = side * 8;
    assembly.addBox([2.4, 1.2, 2], 0x90a4ae, [x, 0.6, z]);
    assembly.addBox([2.6, 0.25, 2.2], SNOW, [x, 1.32, z]);
    assembly.addBox([1.4, 0.18, 0.12], 0x263238, [x, 0.85, z + 1.01]);
    return assembly.build();
  }

  private createSearchlight(side: number, z: number): Group {
    const assembly = new MeshAssembly();
    const x = side * 9;
    assembly.addCylinder(0.12, 0.14, 4.2, 0x546e7a, [x, 2.1, z]);
    assembly.addSphere(0.32, AMBER, [x, 4.3, z]);
    const cone = new Mesh(
      new ConeGeometry(1.4, 7, 18),
      new MeshStandardMaterial({
        color: AMBER,
        emissive: AMBER,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
      }),
    );
    cone.position.set(x - side * 3.4, 4.3, z);
    cone.rotation.z = side * Math.PI / 2;
    assembly.add(cone);
    return assembly.build();
  }
}
