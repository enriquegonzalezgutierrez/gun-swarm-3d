import type { Group, MeshStandardMaterial } from 'three';
import { MeshAssembly } from '../MeshAssembly';
import type { EntityMeshFactory } from './EntityMeshFactory';

export class Boss3_SpiderMechMeshFactory implements EntityMeshFactory {
  public createMesh(): Group {
    const assembly = new MeshAssembly();
    const core = assembly.addSphere(0.95, 0x455a64, [0, 1.7, 0]);
    const material = core.material as MeshStandardMaterial;
    material.emissive.setHex(0x00e5ff);
    material.emissiveIntensity = 0.35;
    assembly.addBox([1.6, 0.55, 1.6], 0x263238, [0, 1.7, 0]);
    assembly.addSphere(0.18, 0xff1744, [0, 1.9, 0.8]);
    for (const x of [-1, 1]) {
      for (const z of [-1, 1]) {
        assembly.addBox([0.22, 1.25, 0.22], 0x37474f, [x * 0.9, 1.25, z * 0.65], [z * 0.45, 0, -x * 0.45]);
        assembly.addBox([0.18, 1.25, 0.18], 0x546e7a, [x * 1.55, 0.7, z * 1.05], [z * 0.3, 0, x * 0.3]);
        assembly.addSphere(0.12, 0x00e5ff, [x * 1.9, 0.38, z * 1.3]);
      }
    }
    return assembly.build();
  }
}
