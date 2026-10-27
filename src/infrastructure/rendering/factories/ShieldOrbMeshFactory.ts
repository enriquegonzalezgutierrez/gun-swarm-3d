import {
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  SphereGeometry,
  type Group,
} from 'three';
import { MeshAssembly } from '../MeshAssembly';
import type { EntityMeshFactory } from './EntityMeshFactory';

export class ShieldOrbMeshFactory implements EntityMeshFactory {
  public createMesh(): Group {
    const assembly = new MeshAssembly();
    const outer = new Mesh(
      new SphereGeometry(0.45, 20, 16),
      new MeshStandardMaterial({
        color: 0x00b0ff,
        transparent: true,
        opacity: 0.38,
        emissive: 0x00b0ff,
        emissiveIntensity: 0.7,
        roughness: 0.2,
        metalness: 0.1,
      }),
    );
    outer.position.set(0, 0.8, 0);
    const inner = new Mesh(
      new IcosahedronGeometry(0.28, 1),
      new MeshBasicMaterial({ color: 0x80d8ff, wireframe: true }),
    );
    inner.position.copy(outer.position);
    assembly.add(outer);
    assembly.add(inner);
    return assembly.build();
  }
}
