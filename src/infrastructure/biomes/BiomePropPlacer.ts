import type { Group, Object3D } from 'three';

export class BiomePropPlacer {
  public static scatter(
    group: Group,
    trackLength: number,
    spacing: number,
    createProp: (index: number, side: number, z: number) => Object3D,
  ): void {
    if (!Number.isFinite(spacing) || spacing <= 0) {
      throw new RangeError('Biome prop spacing must be a positive number.');
    }
    let index = 0;
    for (let z = spacing / 2; z < trackLength; z += spacing) {
      for (const side of [-1, 1]) {
        group.add(createProp(index, side, z));
        index += 1;
      }
    }
  }
}
