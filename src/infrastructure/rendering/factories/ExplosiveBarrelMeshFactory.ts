import type { Group } from 'three';
import { MeshAssembly } from '../MeshAssembly';
import type { EntityMeshFactory } from './EntityMeshFactory';

export class ExplosiveBarrelMeshFactory implements EntityMeshFactory {
  public createMesh(): Group {
    const assembly = new MeshAssembly();
    assembly.addCylinder(0.6, 0.6, 1.4, 0xc62828, [0, 0.7, 0]);
    assembly.addCylinder(0.62, 0.62, 0.16, 0xffd54f, [0, 0.7, 0]);
    assembly.addCylinder(0.5, 0.5, 0.08, 0x8d6e63, [0, 1.44, 0]);
    assembly.addBox([0.2, 0.18, 0.2], 0x5d4037, [0, 1.53, 0]);
    assembly.addBox([0.1, 0.3, 0.06], 0x212121, [0.18, 0.35, 0.56]);
    return assembly.build();
  }
}
