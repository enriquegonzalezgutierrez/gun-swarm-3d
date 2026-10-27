import { vi } from 'vitest';
import type { RenderPort } from '@application/ports/driven/RenderPort';
import type { Position3D } from '@domain/value-objects/Position3D';

export class FakeRenderPort implements RenderPort {
  public readonly initViewport = vi.fn((_container: HTMLElement): void => undefined);
  public readonly render = vi.fn((): void => undefined);
  public readonly createEntityMesh = vi.fn(
    (_id: string, _type: string, _position: Position3D): void => undefined,
  );
  public readonly updateEntityTransform = vi.fn(
    (_id: string, _position: Position3D, _rotationY?: number): void => undefined,
  );
  public readonly removeEntityMesh = vi.fn((_id: string): void => undefined);
  public readonly updateCameraTarget = vi.fn(
    (_targetPosition: Position3D): void => undefined,
  );
  public readonly spawnExplosionParticles = vi.fn(
    (_position: Position3D, _color: number): void => undefined,
  );
  public readonly setBiomeEnvironment = vi.fn((_biomeId: number): void => undefined);
}
