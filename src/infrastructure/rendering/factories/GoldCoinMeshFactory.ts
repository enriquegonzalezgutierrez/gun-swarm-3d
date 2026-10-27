import type { Group } from 'three';
import { MeshAssembly } from '../MeshAssembly';
import type { EntityMeshFactory } from './EntityMeshFactory';

export class GoldCoinMeshFactory implements EntityMeshFactory {
  public createMesh(): Group {
    const assembly = new MeshAssembly();
    assembly.addCylinder(0.35, 0.35, 0.08, 0xffd54f, [0, 0.55, 0], [Math.PI / 2, 0, 0], 16);
    assembly.addTorus(0.33, 0.035, 0xffb300, [0, 0.55, 0]);
    assembly.addBox([0.36, 0.07, 0.02], 0xfff59d, [0, 0.55, 0.055], [0, 0, 0.6]);
    assembly.addBox([0.36, 0.07, 0.02], 0xfff59d, [0, 0.55, 0.055], [0, 0, -0.6]);
    return assembly.build();
  }
}
