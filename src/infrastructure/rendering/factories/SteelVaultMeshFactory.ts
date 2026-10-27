import type { Group } from 'three';
import { MeshAssembly } from '../MeshAssembly';
import type { EntityMeshFactory } from './EntityMeshFactory';

const RIVET_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [-0.68, -0.68],
  [0.68, -0.68],
  [-0.68, 0.68],
  [0.68, 0.68],
];

export class SteelVaultMeshFactory implements EntityMeshFactory {
  public createMesh(): Group {
    const assembly = new MeshAssembly();
    assembly.addBox([1.7, 1.7, 1.7], 0x3d4654, [0, 0.85, 0]);
    assembly.addTorus(0.34, 0.06, 0xc9a227, [0, 0.9, 0.88]);
    assembly.addBox([0.5, 0.06, 0.06], 0xc9a227, [0, 0.9, 0.9]);
    assembly.addBox([0.06, 0.5, 0.06], 0xc9a227, [0, 0.9, 0.9]);
    for (const [x, y] of RIVET_OFFSETS) {
      assembly.addSphere(0.06, 0x6b7280, [x, 0.9 + y, 0.88]);
    }
    return assembly.build();
  }
}
