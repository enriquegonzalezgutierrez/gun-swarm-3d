import type { Group } from 'three';
import { MeshAssembly } from '../MeshAssembly';
import type { EntityMeshFactory } from './EntityMeshFactory';

export class Boss4_FrostBehemothMeshFactory implements EntityMeshFactory {
  public createMesh(): Group {
    const assembly = new MeshAssembly();
    for (const x of [-0.72, 0.72]) {
      assembly.addBox([0.55, 1.9, 0.6], 0x607d8b, [x, 0.95, 0]);
      assembly.addBox([0.7, 0.22, 0.9], 0xb0bec5, [x, 0.12, 0.12]);
    }
    assembly.addBox([2.2, 1.4, 1.1], 0x90a4ae, [0, 2.25, 0]);
    assembly.addBox([1.7, 0.5, 1], 0xcfd8dc, [0, 2.9, 0.08]);
    assembly.addBox([0.55, 0.5, 0.55], 0x78909c, [0, 3.45, 0.05]);
    for (const x of [-1.42, 1.42]) {
      assembly.addBox([0.9, 0.55, 0.75], 0x546e7a, [x, 2.75, 0]);
      for (let index = 0; index < 3; index += 1) {
        assembly.addCylinder(0.07, 0.07, 0.8, 0x263238, [x, 2.85, -0.32 + index * 0.32], [Math.PI / 2, 0, 0]);
      }
    }
    return assembly.build();
  }
}
