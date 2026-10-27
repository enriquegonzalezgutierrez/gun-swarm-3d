import { Position3D } from './Position3D';

export class BoundingBox3D {
  public readonly center: Position3D;
  public readonly halfExtents: Position3D;

  public constructor(center: Position3D, halfExtents: Position3D) {
    if (halfExtents.x < 0 || halfExtents.y < 0 || halfExtents.z < 0) {
      throw new RangeError('BoundingBox3D half extents must be non-negative.');
    }
    this.center = center;
    this.halfExtents = halfExtents;
  }

  public static fromCenterAndSize(center: Position3D, size: Position3D): BoundingBox3D {
    if (size.x < 0 || size.y < 0 || size.z < 0) {
      throw new RangeError('BoundingBox3D size must be non-negative.');
    }
    return new BoundingBox3D(
      center,
      new Position3D(size.x / 2, size.y / 2, size.z / 2),
    );
  }

  public static fromMinMax(min: Position3D, max: Position3D): BoundingBox3D {
    if (min.x > max.x || min.y > max.y || min.z > max.z) {
      throw new RangeError('BoundingBox3D minimum must not exceed maximum.');
    }
    return new BoundingBox3D(
      new Position3D((min.x + max.x) / 2, (min.y + max.y) / 2, (min.z + max.z) / 2),
      new Position3D((max.x - min.x) / 2, (max.y - min.y) / 2, (max.z - min.z) / 2),
    );
  }

  public get min(): Position3D {
    return new Position3D(
      this.center.x - this.halfExtents.x,
      this.center.y - this.halfExtents.y,
      this.center.z - this.halfExtents.z,
    );
  }

  public get max(): Position3D {
    return new Position3D(
      this.center.x + this.halfExtents.x,
      this.center.y + this.halfExtents.y,
      this.center.z + this.halfExtents.z,
    );
  }

  public intersects(other: BoundingBox3D): boolean {
    const selfMin = this.min;
    const selfMax = this.max;
    const otherMin = other.min;
    const otherMax = other.max;
    return (
      selfMin.x <= otherMax.x &&
      selfMax.x >= otherMin.x &&
      selfMin.y <= otherMax.y &&
      selfMax.y >= otherMin.y &&
      selfMin.z <= otherMax.z &&
      selfMax.z >= otherMin.z
    );
  }

  public containsPoint(point: Position3D): boolean {
    const selfMin = this.min;
    const selfMax = this.max;
    return (
      point.x >= selfMin.x &&
      point.x <= selfMax.x &&
      point.y >= selfMin.y &&
      point.y <= selfMax.y &&
      point.z >= selfMin.z &&
      point.z <= selfMax.z
    );
  }

  public translated(offset: Position3D): BoundingBox3D {
    return new BoundingBox3D(this.center.add(offset), this.halfExtents);
  }
}
