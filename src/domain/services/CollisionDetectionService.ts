import { BoundingBox3D } from '../value-objects/BoundingBox3D';

export class CollisionDetectionService {
  public intersects(first: BoundingBox3D, second: BoundingBox3D): boolean {
    return first.intersects(second);
  }

  public findOverlappingIds(
    target: BoundingBox3D,
    candidates: ReadonlyMap<string, BoundingBox3D>,
  ): string[] {
    const overlapping: string[] = [];
    for (const [id, box] of candidates) {
      if (target.intersects(box)) {
        overlapping.push(id);
      }
    }
    return overlapping;
  }

  public findOverlappingPairs(
    boxes: ReadonlyMap<string, BoundingBox3D>,
  ): Array<readonly [string, string]> {
    const entries = [...boxes.entries()];
    const pairs: Array<readonly [string, string]> = [];
    for (let firstIndex = 0; firstIndex < entries.length; firstIndex += 1) {
      const first = entries[firstIndex];
      if (first === undefined) {
        continue;
      }
      for (
        let secondIndex = firstIndex + 1;
        secondIndex < entries.length;
        secondIndex += 1
      ) {
        const second = entries[secondIndex];
        if (second === undefined) {
          continue;
        }
        if (first[1].intersects(second[1])) {
          pairs.push([first[0], second[0]]);
        }
      }
    }
    return pairs;
  }
}
