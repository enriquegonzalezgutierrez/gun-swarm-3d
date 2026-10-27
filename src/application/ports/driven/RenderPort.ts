import type { Position3D } from '../../../domain/value-objects/Position3D';

export interface RenderPort {
  initViewport(container: HTMLElement): void;
  render(): void;
  createEntityMesh(id: string, type: string, position: Position3D): void;
  updateEntityTransform(id: string, position: Position3D, rotationY?: number): void;
  removeEntityMesh(id: string): void;
  updateCameraTarget(targetPosition: Position3D): void;
  spawnExplosionParticles(position: Position3D, color: number): void;
  setBiomeEnvironment(biomeId: number): void;
}
