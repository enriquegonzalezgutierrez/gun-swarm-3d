import type { Group } from 'three';
import { MeshAssembly } from '../MeshAssembly';
import type { EntityMeshFactory } from './EntityMeshFactory';

export class Boss2_DreadChopperMeshFactory implements EntityMeshFactory {
  public createMesh(): Group {
    const assembly = new MeshAssembly();
    assembly.addBox([3.4, 0.75, 1.3], 0x37474f, [0, 1.7, 0]);
    assembly.addCone(0.62, 0.9, 0x263238, [0, 1.7, 1.1], [Math.PI / 2, 0, 0]);
    assembly.addBox([2.2, 0.18, 0.18], 0x455a64, [0, 1.75, -1.6]);
    assembly.addBox([0.7, 0.55, 0.2], 0x263238, [0, 1.95, -2.55]);
    for (const x of [-1.1, 1.1]) {
      assembly.addCylinder(0.08, 0.08, 0.35, 0x90a4ae, [x, 2.15, 0]);
      assembly.addBox([1.5, 0.04, 0.12], 0x263238, [x, 2.35, 0]);
      assembly.addBox([0.12, 0.04, 1.5], 0x263238, [x, 2.35, 0]);
    }
    assembly.addCylinder(0.2, 0.2, 1.2, 0x5d4037, [-1.55, 1.45, 0], [0, 0, Math.PI / 2]);
    assembly.addCylinder(0.2, 0.2, 1.2, 0x5d4037, [1.55, 1.45, 0], [0, 0, Math.PI / 2]);
    return assembly.build();
  }
}
