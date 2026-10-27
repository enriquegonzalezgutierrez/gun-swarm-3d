import type { Group } from 'three';
import { MeshAssembly } from '../MeshAssembly';
import type { EntityMeshFactory } from './EntityMeshFactory';

export class SquadLeaderMeshFactory implements EntityMeshFactory {
  public createMesh(): Group {
    const assembly = new MeshAssembly();
    assembly.addCapsule(0.25, 0.8, 0x2f6fde, [0, 0.9, 0]);
    assembly.addBox([0.4, 0.45, 0.22], 0x6b4a2f, [0, 0.95, -0.28]);
    assembly.addBox([0.34, 0.12, 0.36], 0x14213d, [0, 1.5, 0]);
    assembly.addBox([0.26, 0.08, 0.06], 0x00e5ff, [0, 1.42, 0.2]);
    assembly.addCylinder(0.015, 0.015, 0.35, 0x9aa4b2, [0.14, 1.75, 0]);
    return assembly.build();
  }
}
