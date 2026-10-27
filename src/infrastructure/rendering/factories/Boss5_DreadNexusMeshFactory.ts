import type { Group, MeshStandardMaterial } from 'three';
import { MeshAssembly } from '../MeshAssembly';
import type { EntityMeshFactory } from './EntityMeshFactory';

export class Boss5_DreadNexusMeshFactory implements EntityMeshFactory {
  public createMesh(): Group {
    const assembly = new MeshAssembly();
    const core = assembly.addSphere(0.95, 0x6a1b9a, [0, 2.1, 0]);
    const material = core.material as MeshStandardMaterial;
    material.emissive.setHex(0xd500f9);
    material.emissiveIntensity = 0.9;
    assembly.addTorus(1.4, 0.075, 0xd500f9, [0, 2.1, 0], [Math.PI / 2, 0, 0]);
    assembly.addTorus(1.85, 0.06, 0x7c4dff, [0, 2.1, 0], [Math.PI / 3, 0.4, 0]);
    assembly.addTorus(2.3, 0.05, 0x00e5ff, [0, 2.1, 0], [0, 0, Math.PI / 2]);
    for (const x of [-1.9, 1.9]) {
      for (const z of [-1.9, 1.9]) {
        assembly.addBox([0.45, 0.45, 0.45], 0x311b92, [x, 2.1, z]);
        assembly.addSphere(0.16, 0x00e5ff, [x, 2.1, z]);
      }
    }
    return assembly.build();
  }
}
