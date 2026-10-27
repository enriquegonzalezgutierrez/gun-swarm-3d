import type { Group, MeshStandardMaterial } from 'three';
import { MeshAssembly } from '../MeshAssembly';
import type { EntityMeshFactory } from './EntityMeshFactory';

export class KamikazeBomberMeshFactory implements EntityMeshFactory {
  public createMesh(): Group {
    const assembly = new MeshAssembly();
    assembly.addCapsule(0.24, 0.72, 0xef6c00, [0, 0.85, 0]);
    const chest = assembly.addSphere(0.18, 0xff3d00, [0, 0.98, 0.2]);
    const material = chest.material as MeshStandardMaterial;
    material.emissive.setHex(0xff3d00);
    material.emissiveIntensity = 0.85;
    assembly.addCylinder(0.025, 0.025, 0.28, 0x4a4a4a, [0, 1.4, 0], [0.3, 0, 0]);
    assembly.addSphere(0.22, 0x7f1d1d, [0, 1.38, 0], [1, 0.7, 1]);
    return assembly.build();
  }
}
