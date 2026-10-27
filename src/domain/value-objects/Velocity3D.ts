import { Position3D } from './Position3D';

const EPSILON = 1e-9;

export class Velocity3D {
  public readonly x: number;
  public readonly y: number;
  public readonly z: number;

  public constructor(x = 0, y = 0, z = 0) {
    Velocity3D.assertFinite(x, 'x');
    Velocity3D.assertFinite(y, 'y');
    Velocity3D.assertFinite(z, 'z');
    this.x = x;
    this.y = y;
    this.z = z;
  }

  public static zero(): Velocity3D {
    return new Velocity3D();
  }

  public get length(): number {
    return Math.hypot(this.x, this.y, this.z);
  }

  public add(other: Velocity3D): Velocity3D {
    return new Velocity3D(this.x + other.x, this.y + other.y, this.z + other.z);
  }

  public scale(factor: number): Velocity3D {
    Velocity3D.assertFinite(factor, 'factor');
    return new Velocity3D(this.x * factor, this.y * factor, this.z * factor);
  }

  public lerp(target: Velocity3D, alpha: number): Velocity3D {
    Velocity3D.assertFinite(alpha, 'alpha');
    const clamped = Math.min(1, Math.max(0, alpha));
    return new Velocity3D(
      this.x + (target.x - this.x) * clamped,
      this.y + (target.y - this.y) * clamped,
      this.z + (target.z - this.z) * clamped,
    );
  }

  public normalize(): Velocity3D {
    const magnitude = this.length;
    if (magnitude === 0) {
      return Velocity3D.zero();
    }
    return this.scale(1 / magnitude);
  }

  public applyTo(position: Position3D, deltaTime: number): Position3D {
    Velocity3D.assertFinite(deltaTime, 'deltaTime');
    if (deltaTime < 0) {
      throw new RangeError('Velocity3D deltaTime must be non-negative.');
    }
    return new Position3D(
      position.x + this.x * deltaTime,
      position.y + this.y * deltaTime,
      position.z + this.z * deltaTime,
    );
  }

  public equals(other: Velocity3D, epsilon = EPSILON): boolean {
    Velocity3D.assertFinite(epsilon, 'epsilon');
    if (epsilon < 0) {
      throw new RangeError('Velocity3D epsilon must be non-negative.');
    }
    return (
      Math.abs(this.x - other.x) <= epsilon &&
      Math.abs(this.y - other.y) <= epsilon &&
      Math.abs(this.z - other.z) <= epsilon
    );
  }

  private static assertFinite(value: number, label: string): void {
    if (!Number.isFinite(value)) {
      throw new RangeError(`Velocity3D ${label} must be a finite number.`);
    }
  }
}
