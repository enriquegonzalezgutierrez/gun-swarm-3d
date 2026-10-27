import type { Group } from 'three';
import { MeshAssembly } from '../MeshAssembly';
import type { EntityMeshFactory } from './EntityMeshFactory';

export class HeavyTrooperMeshFactory implements EntityMeshFactory {
  public createMesh(): Group {
    const assembly = new MeshAssembly();
    assembly.addCapsule(0.3, 0.95, 0x2558b8, [0, 1.05, 0]);
    assembly.addBox([0.58, 0.42, 0.36], 0x6d7686, [0, 1.2, 0.08]);
    assembly.addBox([0.22, 0.16, 0.32], 0x8c95a3, [-0.38, 1.42, 0]);
    assembly.addBox([0.22, 0.16, 0.32], 0x8c95a3, [0.38, 1.42, 0]);
    assembly.addSphere(0.26, 0x14213d, [0, 1.72, 0], [1, 0.7, 1]);
    return assembly.build();
  }
}
