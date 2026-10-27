import type { Group } from 'three';
import { MeshAssembly } from '../MeshAssembly';
import type { EntityMeshFactory } from './EntityMeshFactory';

export class WoodCrateMeshFactory implements EntityMeshFactory {
  public createMesh(): Group {
    const assembly = new MeshAssembly();
    assembly.addBox([1.2, 1.2, 1.2], 0x8b5a2b, [0, 0.6, 0]);
    for (const z of [-0.61, 0.61]) {
      assembly.addBox([1.02, 0.12, 0.04], 0x5a3617, [0, 0.6, z]);
      assembly.addBox([0.12, 1.02, 0.04], 0x5a3617, [0, 0.6, z]);
    }
    for (const x of [-0.61, 0.61]) {
      assembly.addBox([0.04, 0.12, 1.02], 0x5a3617, [x, 0.6, 0]);
      assembly.addBox([0.04, 1.02, 0.12], 0x5a3617, [x, 0.6, 0]);
    }
    return assembly.build();
  }
}
