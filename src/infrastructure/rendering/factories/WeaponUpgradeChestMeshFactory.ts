import type { Group } from 'three';
import { MeshAssembly } from '../MeshAssembly';
import type { EntityMeshFactory } from './EntityMeshFactory';

export class WeaponUpgradeChestMeshFactory implements EntityMeshFactory {
  public createMesh(): Group {
    const assembly = new MeshAssembly();
    assembly.addBox([1, 0.7, 0.7], 0x2e7d32, [0, 0.35, 0]);
    assembly.addBox([1.06, 0.16, 0.76], 0x1b5e20, [0, 0.76, 0]);
    assembly.addBox([0.18, 0.24, 0.08], 0xffd54f, [0, 0.38, 0.4]);
    assembly.addTorus(0.8, 0.035, 0xffd54f, [0, 0.35, 0], [Math.PI / 2, 0, 0]);
    return assembly.build();
  }
}
