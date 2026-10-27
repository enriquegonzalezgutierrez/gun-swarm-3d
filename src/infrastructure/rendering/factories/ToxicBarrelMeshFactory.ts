import type { Group, MeshStandardMaterial } from 'three';
import { MeshAssembly } from '../MeshAssembly';
import type { EntityMeshFactory } from './EntityMeshFactory';

export class ToxicBarrelMeshFactory implements EntityMeshFactory {
  public createMesh(): Group {
    const assembly = new MeshAssembly();
    assembly.addCylinder(0.6, 0.6, 1.4, 0x76ff03, [0, 0.7, 0]);
    assembly.addBox([0.14, 0.62, 0.14], 0x1b5e20, [0, 0.78, 0.56]);
    assembly.addBox([0.62, 0.14, 0.14], 0x1b5e20, [0, 0.78, 0.56]);
    const glow = assembly.addCylinder(0.48, 0.48, 0.08, 0xb2ff59, [0, 1.44, 0]);
    const material = glow.material as MeshStandardMaterial;
    material.emissive.setHex(0x76ff03);
    material.emissiveIntensity = 0.9;
    return assembly.build();
  }
}
