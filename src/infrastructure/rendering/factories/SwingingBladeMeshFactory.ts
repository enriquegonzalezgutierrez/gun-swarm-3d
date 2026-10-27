import type { Group } from 'three';
import { MeshAssembly } from '../MeshAssembly';
import type { EntityMeshFactory } from './EntityMeshFactory';

export class SwingingBladeMeshFactory implements EntityMeshFactory {
  public createMesh(): Group {
    const assembly = new MeshAssembly();
    assembly.addBox([0.32, 0.24, 0.32], 0x4a4a4a, [0, 2.7, 0]);
    assembly.addCylinder(0.06, 0.06, 2.2, 0x8c95a3, [0, 1.55, 0]);
    assembly.addTorus(
      0.68,
      0.07,
      0xd7dde5,
      [0, 0.48, 0],
      [Math.PI / 2, 0, 0],
      Math.PI * 0.92,
    );
    assembly.addBox([0.12, 0.3, 0.12], 0x596273, [0, 0.42, 0]);
    return assembly.build();
  }
}
