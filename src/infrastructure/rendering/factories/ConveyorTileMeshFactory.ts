import type { Group } from 'three';
import { MeshAssembly } from '../MeshAssembly';
import type { EntityMeshFactory } from './EntityMeshFactory';

export class ConveyorTileMeshFactory implements EntityMeshFactory {
  public createMesh(): Group {
    const assembly = new MeshAssembly();
    assembly.addBox([4, 0.15, 2], 0x26292b, [0, 0.075, 0]);
    for (const z of [-0.6, 0, 0.6]) {
      assembly.addBox([0.08, 0.03, 0.5], 0x76ff03, [-0.2, 0.17, z], [0, -0.65, 0]);
      assembly.addBox([0.08, 0.03, 0.5], 0x76ff03, [0.2, 0.17, z], [0, 0.65, 0]);
    }
    return assembly.build();
  }
}
