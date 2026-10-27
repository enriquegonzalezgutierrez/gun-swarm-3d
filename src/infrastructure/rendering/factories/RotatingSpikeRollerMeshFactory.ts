import type { Group } from 'three';
import { MeshAssembly } from '../MeshAssembly';
import type { EntityMeshFactory } from './EntityMeshFactory';

export class RotatingSpikeRollerMeshFactory implements EntityMeshFactory {
  public createMesh(): Group {
    const assembly = new MeshAssembly();
    assembly.addCylinder(0.25, 0.25, 4, 0x9aa4b2, [0, 0.65, 0], [0, 0, Math.PI / 2]);
    for (let index = 0; index < 8; index += 1) {
      const angle = (index * Math.PI) / 4;
      assembly.addCone(
        0.14,
        0.48,
        0xcfd8dc,
        [0, 0.65 + Math.cos(angle) * 0.42, Math.sin(angle) * 0.42],
        [angle, 0, 0],
      );
    }
    for (const x of [-1.85, 1.85]) {
      assembly.addCylinder(0.3, 0.3, 0.18, 0x4a4a4a, [x, 0.65, 0], [0, 0, Math.PI / 2]);
    }
    return assembly.build();
  }
}
