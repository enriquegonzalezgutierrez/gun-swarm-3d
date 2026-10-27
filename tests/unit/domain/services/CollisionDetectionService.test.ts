import { describe, expect, it } from 'vitest';
import { CollisionDetectionService } from '@domain/services/CollisionDetectionService';
import { BoundingBox3D } from '@domain/value-objects/BoundingBox3D';
import { Position3D } from '@domain/value-objects/Position3D';

function boxAt(x: number): BoundingBox3D {
  return BoundingBox3D.fromCenterAndSize(
    new Position3D(x, 0, 0),
    new Position3D(1, 1, 1),
  );
}

describe('CollisionDetectionService', () => {
  it('detects intersecting and separated boxes', () => {
    const service = new CollisionDetectionService();

    expect(service.intersects(boxAt(0), boxAt(0.5))).toBe(true);
    expect(service.intersects(boxAt(0), boxAt(10))).toBe(false);
  });

  it('finds all candidates overlapping a target', () => {
    const service = new CollisionDetectionService();
    const candidates = new Map<string, BoundingBox3D>([
      ['crate', boxAt(0.4)],
      ['vault', boxAt(0.9)],
      ['barrel', boxAt(10)],
    ]);

    expect(service.findOverlappingIds(boxAt(0), candidates)).toEqual(['crate', 'vault']);
  });

  it('finds unique overlapping pairs in a collection', () => {
    const service = new CollisionDetectionService();
    const boxes = new Map<string, BoundingBox3D>([
      ['first', boxAt(0)],
      ['second', boxAt(0.5)],
      ['third', boxAt(20)],
    ]);

    expect(service.findOverlappingPairs(boxes)).toEqual([['first', 'second']]);
  });

  it('returns empty results for empty collections', () => {
    const service = new CollisionDetectionService();
    const empty = new Map<string, BoundingBox3D>();

    expect(service.findOverlappingIds(boxAt(0), empty)).toEqual([]);
    expect(service.findOverlappingPairs(empty)).toEqual([]);
  });
});
