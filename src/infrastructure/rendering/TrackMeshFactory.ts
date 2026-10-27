import { BoxGeometry, Group, Mesh, MeshStandardMaterial } from 'three';

export class TrackMeshFactory {
  public static create(length: number): Group {
    if (!Number.isFinite(length) || length <= 0) {
      throw new RangeError('Track length must be a positive number.');
    }
    const group = new Group();
    const road = new Mesh(
      new BoxGeometry(10, 0.2, length),
      new MeshStandardMaterial({ color: 0x1a1a24, roughness: 0.95, metalness: 0.05 }),
    );
    road.position.set(0, -0.1, length / 2);
    road.receiveShadow = true;
    group.add(road);
    for (const side of [-1, 1]) {
      const curb = new Mesh(
        new BoxGeometry(0.5, 0.8, length),
        new MeshStandardMaterial({ color: 0x2b2f3a, roughness: 0.9 }),
      );
      curb.position.set(side * 4.75, 0.3, length / 2);
      curb.castShadow = true;
      curb.receiveShadow = true;
      group.add(curb);
    }
    return group;
  }
}
