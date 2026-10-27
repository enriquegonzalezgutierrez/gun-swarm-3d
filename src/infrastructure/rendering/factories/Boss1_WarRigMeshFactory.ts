import type { Group } from 'three';
import { MeshAssembly } from '../MeshAssembly';
import type { EntityMeshFactory } from './EntityMeshFactory';

export class Boss1_WarRigMeshFactory implements EntityMeshFactory {
  public createMesh(): Group {
    const assembly = new MeshAssembly();
    assembly.addBox([3.2, 0.5, 2.2], 0x3e4a3a, [0, 0.85, 0]);
    assembly.addBox([1.5, 1.1, 1.2], 0x4e5d45, [0, 1.6, 0.5]);
    assembly.addBox([3.4, 0.2, 2.4], 0x2b3328, [0, 0.55, 0]);
    for (const x of [-1.15, 1.15]) {
      for (const z of [-0.75, 0, 0.75]) {
        assembly.addCylinder(0.46, 0.46, 0.28, 0x1b1b1b, [x, 0.46, z], [0, 0, Math.PI / 2]);
      }
    }
    assembly.addCylinder(0.16, 0.16, 0.9, 0x6d7686, [-0.55, 2.25, 0.45]);
    assembly.addCylinder(0.16, 0.16, 0.9, 0x6d7686, [0.55, 2.25, 0.45]);
    assembly.addCylinder(0.05, 0.05, 1.1, 0x111111, [-0.55, 2.6, 0.95], [Math.PI / 2, 0, 0]);
    assembly.addCylinder(0.05, 0.05, 1.1, 0x111111, [0.55, 2.6, 0.95], [Math.PI / 2, 0, 0]);
    return assembly.build();
  }
}
