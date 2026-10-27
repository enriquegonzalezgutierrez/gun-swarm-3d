import type { Group } from 'three';
import { MeshAssembly } from '../MeshAssembly';
import type { EntityMeshFactory } from './EntityMeshFactory';

export class RiotShieldEnemyMeshFactory implements EntityMeshFactory {
  public createMesh(): Group {
    const assembly = new MeshAssembly();
    assembly.addCapsule(0.24, 0.8, 0xb71c1c, [0, 0.9, 0]);
    assembly.addBox([1.05, 1.35, 0.12], 0x707b8c, [0, 0.98, 0.38]);
    assembly.addBox([0.2, 1.2, 0.12], 0x596273, [-0.56, 0.98, 0.28], [0, 0.35, 0]);
    assembly.addBox([0.2, 1.2, 0.12], 0x596273, [0.56, 0.98, 0.28], [0, -0.35, 0]);
    assembly.addSphere(0.2, 0x1b1b1b, [0, 1.38, 0], [1, 0.7, 1]);
    return assembly.build();
  }
}
