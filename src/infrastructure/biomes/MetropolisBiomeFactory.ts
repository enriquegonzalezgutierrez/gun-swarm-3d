import { Group, MeshStandardMaterial } from 'three';
import { MeshAssembly } from '../rendering/MeshAssembly';
import type { BiomeSceneryFactory } from './BiomeSceneryFactory';

const TRACK_LENGTH = 220;
const CYAN = 0x00e5ff;
const DARK = 0x111827;

export class MetropolisBiomeFactory implements BiomeSceneryFactory {
  public createScenery(): Group {
    const scenery = new Group();
    for (let z = 18; z < TRACK_LENGTH; z += 24) {
      scenery.add(this.createStreetLight(-1, z));
      scenery.add(this.createStreetLight(1, z + 12));
    }
    for (let z = 30; z < TRACK_LENGTH; z += 48) {
      scenery.add(this.createBuilding(-1, z, z / 48));
      scenery.add(this.createBuilding(1, z + 20, z / 48 + 1));
    }
    for (let z = 60; z < TRACK_LENGTH; z += 60) {
      scenery.add(this.createGantry(z));
    }
    return scenery;
  }

  private createStreetLight(side: number, z: number): Group {
    const assembly = new MeshAssembly();
    assembly.addCylinder(0.08, 0.1, 3.4, DARK, [side * 5.7, 1.7, z]);
    assembly.addBox([0.7, 0.08, 0.08], DARK, [side * 5.35, 3.38, z]);
    const lamp = assembly.addBox([0.4, 0.12, 0.2], CYAN, [side * 5, 3.3, z]);
    const material = lamp.material as MeshStandardMaterial;
    material.emissive.setHex(CYAN);
    material.emissiveIntensity = 1.1;
    return assembly.build();
  }

  private createBuilding(side: number, z: number, variant: number): Group {
    const assembly = new MeshAssembly();
    const height = 6 + (variant % 4) * 3;
    assembly.addBox([3.2, height, 3.2], 0x151b2e, [side * 11.5, height / 2, z]);
    for (let floor = 0; floor < 3; floor += 1) {
      const windowMesh = assembly.addBox(
        [1.8, 0.35, 0.08],
        0x1b6ca8,
        [side * 11.5, 1.8 + floor * (height / 4), z + 1.62],
      );
      const material = windowMesh.material as MeshStandardMaterial;
      material.emissive.setHex(0x00bcd4);
      material.emissiveIntensity = 0.7;
    }
    return assembly.build();
  }

  private createGantry(z: number): Group {
    const assembly = new MeshAssembly();
    assembly.addCylinder(0.12, 0.12, 5.2, 0x37474f, [-5.2, 2.6, z]);
    assembly.addCylinder(0.12, 0.12, 5.2, 0x37474f, [5.2, 2.6, z]);
    assembly.addBox([11, 0.28, 0.28], 0x455a64, [0, 5.25, z]);
    const sign = assembly.addBox([3.4, 1.1, 0.14], CYAN, [0, 4.65, z]);
    const material = sign.material as MeshStandardMaterial;
    material.emissive.setHex(CYAN);
    material.emissiveIntensity = 0.9;
    return assembly.build();
  }
}
