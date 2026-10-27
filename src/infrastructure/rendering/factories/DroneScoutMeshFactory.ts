import type { Group } from 'three';
import { MeshAssembly } from '../MeshAssembly';
import type { EntityMeshFactory } from './EntityMeshFactory';

const ROTOR_OFFSETS: ReadonlyArray<readonly [number, number]> = [
  [1, 1],
  [-1, 1],
  [1, -1],
  [-1, -1],
];

export class DroneScoutMeshFactory implements EntityMeshFactory {
  public createMesh(): Group {
    const assembly = new MeshAssembly();
    assembly.addCylinder(0.32, 0.32, 0.12, 0xb71c1c, [0, 0.95, 0]);
    assembly.addSphere(0.16, 0x1b1b1b, [0, 1.02, 0], [1, 0.6, 1]);
    for (const [x, z] of ROTOR_OFFSETS) {
      assembly.addCylinder(
        0.035,
        0.035,
        0.62,
        0x4a4a4a,
        [x * 0.24, 1.08, z * 0.24],
        [z * 0.7, 0, -x * 0.7],
      );
      assembly.addBox([0.32, 0.035, 0.09], 0x2c2c2c, [x * 0.46, 1.2, z * 0.46]);
    }
    return assembly.build();
  }
}
