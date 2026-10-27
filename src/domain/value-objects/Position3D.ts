const EPSILON = 1e-9;

export class Position3D {
  public readonly x: number;
  public readonly y: number;
  public readonly z: number;

  public constructor(x = 0, y = 0, z = 0) {
    Position3D.assertFinite(x, 'x');
    Position3D.assertFinite(y, 'y');
    Position3D.assertFinite(z, 'z');
    this.x = x;
    this.y = y;
    this.z = z;
  }

  public static zero(): Position3D {
    return new Position3D();
  }

  public add(other: Position3D): Position3D {
    return new Position3D(this.x + other.x, this.y + other.y, this.z + other.z);
  }

  public subtract(other: Position3D): Position3D {
    return new Position3D(this.x - other.x, this.y - other.y, this.z - other.z);
  }

  public scale(factor: number): Position3D {
    Position3D.assertFinite(factor, 'factor');
    return new Position3D(this.x * factor, this.y * factor, this.z * factor);
  }

  public lerp(target: Position3D, alpha: number): Position3D {
    Position3D.assertFinite(alpha, 'alpha');
    const clamped = Math.min(1, Math.max(0, alpha));
    return new Position3D(
      this.x + (target.x - this.x) * clamped,
      this.y + (target.y - this.y) * clamped,
      this.z + (target.z - this.z) * clamped,
    );
  }

  public distanceTo(other: Position3D): number {
    return Math.hypot(other.x - this.x, other.y - this.y, other.z - this.z);
  }

  public withX(x: number): Position3D {
    return new Position3D(x, this.y, this.z);
  }

  public withY(y: number): Position3D {
    return new Position3D(this.x, y, this.z);
  }

  public withZ(z: number): Position3D {
    return new Position3D(this.x, this.y, z);
  }

  public equals(other: Position3D, epsilon = EPSILON): boolean {
    Position3D.assertFinite(epsilon, 'epsilon');
    if (epsilon < 0) {
      throw new RangeError('Position3D epsilon must be non-negative.');
    }
    return (
      Math.abs(this.x - other.x) <= epsilon &&
      Math.abs(this.y - other.y) <= epsilon &&
      Math.abs(this.z - other.z) <= epsilon
    );
  }

  private static assertFinite(value: number, label: string): void {
    if (!Number.isFinite(value)) {
      throw new RangeError(`Position3D ${label} must be a finite number.`);
    }
  }
}
