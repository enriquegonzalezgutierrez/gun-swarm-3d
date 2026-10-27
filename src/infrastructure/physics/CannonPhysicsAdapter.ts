import {
  Body,
  Box,
  SAPBroadphase,
  Vec3,
  World,
} from 'cannon-es';
import type { PhysicsPort } from '../../application/ports/driven/PhysicsPort';
import type { BoundingBox3D } from '../../domain/value-objects/BoundingBox3D';
import type { Position3D } from '../../domain/value-objects/Position3D';
import { ColliderRaycaster } from './ColliderRaycaster';

const FIXED_TIME_STEP = 1 / 60;
const MAX_SUB_STEPS = 5;
const MIN_HALF_EXTENT = 0.001;

export class CannonPhysicsAdapter implements PhysicsPort {
  private readonly world = new World();
  private readonly bodies = new Map<string, Body>();
  private readonly bodyIds = new Map<number, string>();

  public constructor() {
    this.world.gravity.set(0, -9.82, 0);
    this.world.allowSleep = false;
    this.world.broadphase = new SAPBroadphase(this.world);
  }

  public step(deltaTime: number): void {
    if (!Number.isFinite(deltaTime) || deltaTime < 0) {
      throw new RangeError('Physics delta time must be a non-negative number.');
    }
    if (deltaTime === 0) {
      return;
    }
    this.world.step(FIXED_TIME_STEP, deltaTime, MAX_SUB_STEPS);
  }

  public registerCollider(id: string, box: BoundingBox3D, isStatic: boolean): void {
    if (id.trim().length === 0) {
      throw new RangeError('Collider id must not be empty.');
    }
    if (this.bodies.has(id)) {
      throw new Error(`Collider ${id} is already registered.`);
    }
    const halfExtents = new Vec3(
      Math.max(MIN_HALF_EXTENT, box.halfExtents.x),
      Math.max(MIN_HALF_EXTENT, box.halfExtents.y),
      Math.max(MIN_HALF_EXTENT, box.halfExtents.z),
    );
    const body = new Body({
      mass: isStatic ? 0 : 1,
      type: isStatic ? Body.STATIC : Body.DYNAMIC,
      position: new Vec3(box.center.x, box.center.y, box.center.z),
      shape: new Box(halfExtents),
    });
    body.allowSleep = false;
    body.updateAABB();
    this.world.addBody(body);
    this.bodies.set(id, body);
    this.bodyIds.set(body.id, id);
  }

  public updateColliderPosition(id: string, position: Position3D): void {
    const body = this.bodies.get(id);
    if (body === undefined) {
      throw new Error(`Cannot update unknown collider: ${id}.`);
    }
    body.position.set(position.x, position.y, position.z);
    body.aabbNeedsUpdate = true;
    body.updateAABB();
  }

  public removeCollider(id: string): void {
    const body = this.bodies.get(id);
    if (body === undefined) {
      return;
    }
    this.world.removeBody(body);
    this.bodyIds.delete(body.id);
    this.bodies.delete(id);
  }

  public queryOverlaps(id: string): string[] {
    const body = this.bodies.get(id);
    if (body === undefined) {
      return [];
    }
    body.updateAABB();
    const overlaps: string[] = [];
    for (const [otherId, otherBody] of this.bodies) {
      if (otherId === id) {
        continue;
      }
      otherBody.updateAABB();
      if (body.aabb.overlaps(otherBody.aabb)) {
        overlaps.push(otherId);
      }
    }
    return overlaps;
  }

  public raycast(
    origin: Position3D,
    direction: Position3D,
    maxDistance: number,
  ): string | null {
    return ColliderRaycaster.cast(
      this.world,
      this.bodyIds,
      origin,
      direction,
      maxDistance,
    );
  }
}
