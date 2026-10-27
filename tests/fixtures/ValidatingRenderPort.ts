import type { RenderPort } from '@application/ports/driven/RenderPort';
import type { Position3D } from '@domain/value-objects/Position3D';
import { MeshFactoryRegistry } from '@infrastructure/rendering/MeshFactoryRegistry';

export interface CreatedMesh {
  readonly id: string;
  readonly type: string;
  readonly position: Position3D;
  readonly label: string | undefined;
}

export class ValidatingRenderPort implements RenderPort {
  private readonly registry = new MeshFactoryRegistry();
  public readonly createdMeshes: CreatedMesh[] = [];
  public readonly removedIds: string[] = [];
  public readonly cameraTargets: Position3D[] = [];
  public renderedFrames = 0;

  public initViewport(_container: HTMLElement): void {
    /* No-op in headless integration tests. */
  }

  public render(): void {
    this.renderedFrames += 1;
  }

  public createEntityMesh(
    id: string,
    type: string,
    position: Position3D,
    label?: string,
  ): void {
    this.registry.create(type, label);
    this.createdMeshes.push({ id, type, position, label });
  }

  public updateEntityTransform(
    _id: string,
    _position: Position3D,
    _rotationY?: number,
  ): void {
    /* Geometry validation happens on creation. */
  }

  public removeEntityMesh(id: string): void {
    this.removedIds.push(id);
  }

  public updateCameraTarget(targetPosition: Position3D): void {
    this.cameraTargets.push(targetPosition);
  }

  public spawnExplosionParticles(_position: Position3D, _color: number): void {
    /* No-op for the headless integration test. */
  }

  public setBiomeEnvironment(_biomeId: number): void {
    /* No-op for the headless integration test. */
  }
}
