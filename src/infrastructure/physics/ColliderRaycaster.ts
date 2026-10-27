import { RaycastResult, Vec3, World } from 'cannon-es';
import type { Position3D } from '../../domain/value-objects/Position3D';

export class ColliderRaycaster {
  public static cast(
    world: World,
    bodyIds: ReadonlyMap<number, string>,
    origin: Position3D,
    direction: Position3D,
    maxDistance: number,
  ): string | null {
    if (!Number.isFinite(maxDistance) || maxDistance <= 0) {
      throw new RangeError('Raycast distance must be a positive number.');
    }
    const length = Math.hypot(direction.x, direction.y, direction.z);
    if (length === 0) {
      throw new RangeError('Raycast direction must not be a zero vector.');
    }
    const scale = maxDistance / length;
    const from = new Vec3(origin.x, origin.y, origin.z);
    const to = new Vec3(
      origin.x + direction.x * scale,
      origin.y + direction.y * scale,
      origin.z + direction.z * scale,
    );
    const result = new RaycastResult();
    const hit = world.raycastClosest(from, to, { skipBackfaces: true }, result);
    if (!hit || result.body === null) {
      return null;
    }
    return bodyIds.get(result.body.id) ?? null;
  }
}
