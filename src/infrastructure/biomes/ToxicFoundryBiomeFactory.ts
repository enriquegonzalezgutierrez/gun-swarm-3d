import { Group, MeshStandardMaterial } from 'three';
import { MeshAssembly } from '../rendering/MeshAssembly';
import { BiomePropPlacer } from './BiomePropPlacer';
import type { BiomeSceneryFactory } from './BiomeSceneryFactory';

const TRACK_LENGTH = 280;
const STEEL = 0x37474f;
const TOXIC = 0x76ff03;

export class ToxicFoundryBiomeFactory implements BiomeSceneryFactory {
  public createScenery(): Group {
    const scenery = new Group();
    BiomePropPlacer.scatter(scenery, TRACK_LENGTH, 56, (_index, side, z) =>
      this.createCoolingTower(side, z),
    );
    BiomePropPlacer.scatter(scenery, TRACK_LENGTH, 34, (_index, side, z) =>
      this.createVat(side, z),
    );
    for (let z = 45; z < TRACK_LENGTH; z += 45) {
      scenery.add(this.createPipeRack(z));
    }
    return scenery;
  }

  private createCoolingTower(side: number, z: number): Group {
    const assembly = new MeshAssembly();
    const x = side * 12;
    assembly.addCylinder(1.14, 1.3, 3.8, 0x607d8b, [x, 1.9, z]);
    assembly.addCylinder(1.65, 1.14, 1.6, 0x78909c, [x, 4.6, z]);
    assembly.addTorus(1.62, 0.08, 0x90a4ae, [x, 5.4, z], [Math.PI / 2, 0, 0]);
    const glow = assembly.addCylinder(1.2, 1.2, 0.12, TOXIC, [x, 5.45, z]);
    const material = glow.material as MeshStandardMaterial;
    material.emissive.setHex(TOXIC);
    material.emissiveIntensity = 0.55;
    return assembly.build();
  }

  private createVat(side: number, z: number): Group {
    const assembly = new MeshAssembly();
    const x = side * 7.5;
    assembly.addCylinder(0.9, 0.9, 1.7, STEEL, [x, 0.85, z]);
    assembly.addCylinder(0.78, 0.78, 0.1, TOXIC, [x, 1.74, z]);
    assembly.addCylinder(0.12, 0.12, 1.2, 0x90a4ae, [x + side * 0.8, 1.2, z], [0, 0, side * 0.8]);
    return assembly.build();
  }

  private createPipeRack(z: number): Group {
    const assembly = new MeshAssembly();
    assembly.addCylinder(0.16, 0.16, 3.4, STEEL, [-5.6, 1.7, z]);
    assembly.addCylinder(0.16, 0.16, 3.4, STEEL, [5.6, 1.7, z]);
    assembly.addCylinder(0.2, 0.2, 11.2, 0x78909c, [0, 3.1, z], [0, 0, Math.PI / 2]);
    assembly.addCylinder(0.12, 0.12, 11.2, 0x90a4ae, [0, 3.6, z], [0, 0, Math.PI / 2]);
    for (const x of [-3.2, 0, 3.2]) {
      assembly.addSphere(0.18, TOXIC, [x, 3.1, z]);
    }
    return assembly.build();
  }
}
