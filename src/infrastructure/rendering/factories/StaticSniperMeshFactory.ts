import type { Group } from 'three';
import { MeshAssembly } from '../MeshAssembly';
import type { EntityMeshFactory } from './EntityMeshFactory';

export class StaticSniperMeshFactory implements EntityMeshFactory {
  public createMesh(): Group {
    const assembly = new MeshAssembly();
    const body = assembly.addCapsule(0.22, 0.55, 0x8e1b1b, [0, 0.62, 0], [0.3, 0, 0]);
    body.scale.set(1, 0.9, 1.15);
    assembly.addSphere(0.2, 0x3b0d0d, [0, 1.02, 0.18], [1, 0.72, 1]);
    assembly.addCylinder(0.045, 0.045, 1.25, 0x111111, [0, 0.92, 0.82], [Math.PI / 2, 0, 0]);
    assembly.addCylinder(0.03, 0.03, 0.7, 0x555555, [-0.28, 0.35, 0.1], [0, 0, 0.45]);
    assembly.addCylinder(0.03, 0.03, 0.7, 0x555555, [0.28, 0.35, 0.1], [0, 0, -0.45]);
    assembly.addCylinder(0.03, 0.03, 0.7, 0x555555, [0, 0.35, -0.28], [0.45, 0, 0]);
    return assembly.build();
  }
}
