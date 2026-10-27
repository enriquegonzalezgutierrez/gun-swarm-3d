import type { Group, MeshStandardMaterial } from 'three';
import { MeshAssembly } from '../MeshAssembly';
import type { EntityMeshFactory } from './EntityMeshFactory';

export class ProjectileMeshFactory implements EntityMeshFactory {
  public createMesh(): Group {
    const assembly = new MeshAssembly();
    const orb = assembly.addSphere(0.1, 0xffeb3b, [0, 0, 0]);
    const material = orb.material as MeshStandardMaterial;
    material.emissive.setHex(0xffeb3b);
    material.emissiveIntensity = 1.2;
    return assembly.build();
  }
}
