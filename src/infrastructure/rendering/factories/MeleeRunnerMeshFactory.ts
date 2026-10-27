import type { Group } from 'three';
import { MeshAssembly } from '../MeshAssembly';
import type { EntityMeshFactory } from './EntityMeshFactory';

export class MeleeRunnerMeshFactory implements EntityMeshFactory {
  public createMesh(): Group {
    const assembly = new MeshAssembly();
    assembly.addCapsule(0.2, 0.7, 0xc62828, [0, 0.82, 0]);
    assembly.addSphere(0.2, 0x7f1d1d, [0, 1.35, 0], [1, 0.7, 1]);
    assembly.addBox([0.055, 0.36, 0.12], 0xe0e0e0, [-0.3, 0.88, 0.16], [0, 0, 0.65]);
    assembly.addBox([0.055, 0.36, 0.12], 0xe0e0e0, [0.3, 0.88, 0.16], [0, 0, -0.65]);
    return assembly.build();
  }
}
