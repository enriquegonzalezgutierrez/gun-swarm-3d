import type { BoundingBox3D } from '../../../domain/value-objects/BoundingBox3D';
import type { Position3D } from '../../../domain/value-objects/Position3D';

export interface PhysicsPort {
  step(deltaTime: number): void;
  registerCollider(id: string, box: BoundingBox3D, isStatic: boolean): void;
  updateColliderPosition(id: string, position: Position3D): void;
  removeCollider(id: string): void;
  queryOverlaps(id: string): string[];
  raycast(origin: Position3D, direction: Position3D, maxDistance: number): string | null;
}
