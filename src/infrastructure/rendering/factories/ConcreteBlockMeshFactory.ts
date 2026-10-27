import type { Group } from 'three';
import { MeshAssembly } from '../MeshAssembly';
import type { EntityMeshFactory } from './EntityMeshFactory';

export class ConcreteBlockMeshFactory implements EntityMeshFactory {
  public createMesh(): Group {
    const assembly = new MeshAssembly();
    assembly.addBox([1.8, 1.8, 1.8], 0xaeb4bd, [0, 0.9, 0]);
    assembly.addBox([1.62, 0.16, 1.62], 0xd2d7de, [0, 1.84, 0]);
    assembly.addBox([0.06, 0.9, 0.03], 0x6b7280, [0.25, 1.05, 0.91], [0, 0, 0.35]);
    assembly.addBox([0.05, 0.7, 0.03], 0x6b7280, [-0.35, 0.65, 0.91], [0, 0, -0.45]);
    assembly.addBox([0.9, 0.05, 0.03], 0x6b7280, [0, 0.3, 0.91], [0, 0, 0.2]);
    return assembly.build();
  }
}
