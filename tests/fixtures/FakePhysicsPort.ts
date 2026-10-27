import { vi } from 'vitest';
import type { PhysicsPort } from '@application/ports/driven/PhysicsPort';
import type { BoundingBox3D } from '@domain/value-objects/BoundingBox3D';
import type { Position3D } from '@domain/value-objects/Position3D';

export class FakePhysicsPort implements PhysicsPort {
  public readonly step = vi.fn((_deltaTime: number): void => undefined);
  public readonly registerCollider = vi.fn(
    (_id: string, _box: BoundingBox3D, _isStatic: boolean): void => undefined,
  );
  public readonly updateColliderPosition = vi.fn(
    (_id: string, _position: Position3D): void => undefined,
  );
  public readonly removeCollider = vi.fn((_id: string): void => undefined);
  public readonly queryOverlaps = vi.fn((_id: string): string[] => []);
  public readonly raycast = vi.fn(
    (_origin: Position3D, _direction: Position3D, _maxDistance: number):
      | string
      | null => null,
  );
}
