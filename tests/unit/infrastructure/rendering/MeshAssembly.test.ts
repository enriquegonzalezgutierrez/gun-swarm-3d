import { describe, expect, it } from 'vitest';
import {
  BoxGeometry,
  CapsuleGeometry,
  ConeGeometry,
  CylinderGeometry,
  Group,
  Mesh,
  SphereGeometry,
  TorusGeometry,
} from 'three';
import { MeshAssembly } from '@infrastructure/rendering/MeshAssembly';

describe('MeshAssembly', () => {
  it('builds primitive meshes with transforms', () => {
    const assembly = new MeshAssembly();
    const box = assembly.addBox([1, 2, 3], 0xff0000, [1, 2, 3], [0.1, 0.2, 0.3]);
    const capsule = assembly.addCapsule(0.2, 0.8, 0x00ff00, [0, 1, 0]);
    const cylinder = assembly.addCylinder(0.1, 0.2, 1, 0x0000ff, [0, 0, 1]);
    const sphere = assembly.addSphere(0.5, 0xffff00, [1, 0, 0], [1, 0.5, 1]);
    const cone = assembly.addCone(0.3, 0.7, 0xff00ff, [0, 0, 0]);
    const torus = assembly.addTorus(0.4, 0.05, 0x00ffff, [0, 0.5, 0]);

    expect(box.geometry).toBeInstanceOf(BoxGeometry);
    expect(capsule.geometry).toBeInstanceOf(CapsuleGeometry);
    expect(cylinder.geometry).toBeInstanceOf(CylinderGeometry);
    expect(sphere.geometry).toBeInstanceOf(SphereGeometry);
    expect(cone.geometry).toBeInstanceOf(ConeGeometry);
    expect(torus.geometry).toBeInstanceOf(TorusGeometry);
    expect(box.position.toArray()).toEqual([1, 2, 3]);
    expect(box.rotation.x).toBeCloseTo(0.1);
    expect(sphere.scale.y).toBe(0.5);
    expect(box.castShadow).toBe(true);
    expect(box.receiveShadow).toBe(true);
  });

  it('adds custom meshes and builds a group', () => {
    const assembly = new MeshAssembly();
    assembly.addBox([1, 1, 1], 0xffffff);
    assembly.add(new Mesh(new BoxGeometry(1, 1, 1)));
    const group = assembly.build();

    expect(group).toBeInstanceOf(Group);
    expect(group.children).toHaveLength(2);
  });
});
