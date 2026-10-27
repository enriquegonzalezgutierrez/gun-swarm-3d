import type { Group } from 'three';
import { MeshAssembly } from '../MeshAssembly';
import type { EntityMeshFactory } from './EntityMeshFactory';

export class CivilianRecruitMeshFactory implements EntityMeshFactory {
  public createMesh(): Group {
    const assembly = new MeshAssembly();
    assembly.addCapsule(0.24, 0.8, 0xffc93c, [0, 0.9, 0]);
    assembly.addSphere(0.22, 0xf5f0e6, [0, 1.45, 0]);
    assembly.addCylinder(0.055, 0.055, 0.52, 0xffc93c, [-0.32, 1.02, 0], [0, 0, 0.55]);
    assembly.addCylinder(0.055, 0.055, 0.52, 0xffc93c, [0.32, 1.02, 0], [0, 0, -0.55]);
    assembly.addBox([0.12, 0.06, 0.06], 0x25324a, [0, 1.47, 0.2]);
    return assembly.build();
  }
}
