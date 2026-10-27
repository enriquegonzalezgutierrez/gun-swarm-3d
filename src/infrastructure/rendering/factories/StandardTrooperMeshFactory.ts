import type { Group } from 'three';
import { MeshAssembly } from '../MeshAssembly';
import type { EntityMeshFactory } from './EntityMeshFactory';

export class StandardTrooperMeshFactory implements EntityMeshFactory {
  public createMesh(): Group {
    const assembly = new MeshAssembly();
    assembly.addCapsule(0.25, 0.8, 0x2f6fde, [0, 0.9, 0]);
    assembly.addSphere(0.27, 0x14213d, [0, 1.45, 0], [1, 0.72, 1]);
    assembly.addBox([0.1, 0.12, 0.08], 0x88d4ff, [0, 1.44, 0.23]);
    return assembly.build();
  }
}
