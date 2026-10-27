import { Mesh, WebGLRenderer, type Group } from 'three';
import type { RenderPort } from '../../application/ports/driven/RenderPort';
import type { Position3D } from '../../domain/value-objects/Position3D';
import { MeshFactoryRegistry } from './MeshFactoryRegistry';
import { ParticleSystemManager } from './ParticleSystemManager';
import { SceneManager } from './SceneManager';
import { TrackMeshFactory } from './TrackMeshFactory';

type RendererFactory = (canvas: HTMLCanvasElement) => WebGLRenderer;

export class ThreeJsRenderAdapter implements RenderPort {
  private renderer: WebGLRenderer | null = null;
  private track: Group | null = null;
  private readonly registry = new MeshFactoryRegistry();
  private readonly meshes = new Map<string, Group | Mesh>();
  private readonly particles: ParticleSystemManager;

  public constructor(
    private readonly sceneManager = new SceneManager(),
    private readonly rendererFactory: RendererFactory = (canvas) =>
      new WebGLRenderer({ canvas, antialias: true }),
  ) {
    this.particles = new ParticleSystemManager(this.sceneManager.scene);
  }

  public initViewport(container: HTMLElement): void {
    const width = container.clientWidth > 0 ? container.clientWidth : 360;
    const height = container.clientHeight > 0 ? container.clientHeight : 640;
    const existingCanvas = container.querySelector('canvas');
    const canvas = existingCanvas ?? container.ownerDocument.createElement('canvas');
    canvas.id = 'game-canvas';
    this.renderer = this.rendererFactory(canvas);
    this.renderer.setSize(width, height, false);
    if (existingCanvas === null) {
      container.appendChild(canvas);
    }
    this.sceneManager.resize(width, height);
  }

  public setTrackLength(length: number): void {
    if (this.track !== null) {
      this.sceneManager.scene.remove(this.track);
      this.disposeMesh(this.track);
    }
    this.track = TrackMeshFactory.create(length);
    this.sceneManager.scene.add(this.track);
  }

  public render(): void {
    this.renderer?.render(this.sceneManager.scene, this.sceneManager.camera);
  }

  public createEntityMesh(id: string, type: string, position: Position3D): void {
    const mesh = this.registry.create(type);
    mesh.position.set(position.x, position.y, position.z);
    this.sceneManager.scene.add(mesh);
    this.meshes.set(id, mesh);
  }

  public updateEntityTransform(
    id: string,
    position: Position3D,
    rotationY?: number,
  ): void {
    const mesh = this.meshes.get(id);
    if (mesh === undefined) {
      return;
    }
    mesh.position.set(position.x, position.y, position.z);
    if (rotationY !== undefined) {
      mesh.rotation.y = rotationY;
    }
  }

  public removeEntityMesh(id: string): void {
    const mesh = this.meshes.get(id);
    if (mesh === undefined) {
      return;
    }
    this.sceneManager.scene.remove(mesh);
    this.disposeMesh(mesh);
    this.meshes.delete(id);
  }

  public updateCameraTarget(targetPosition: Position3D): void {
    this.sceneManager.updateCameraTarget(targetPosition);
  }

  public spawnExplosionParticles(position: Position3D, color: number): void {
    this.particles.spawn(position, color);
  }

  public setBiomeEnvironment(biomeId: number): void {
    this.sceneManager.setBiomeEnvironment(biomeId);
  }

  public dispose(): void {
    for (const id of [...this.meshes.keys()]) {
      this.removeEntityMesh(id);
    }
    if (this.track !== null) {
      this.sceneManager.scene.remove(this.track);
      this.disposeMesh(this.track);
      this.track = null;
    }
    this.particles.dispose();
    this.renderer?.dispose();
    this.renderer = null;
  }

  private disposeMesh(mesh: Group | Mesh): void {
    mesh.traverse((object) => {
      if (!(object instanceof Mesh)) {
        return;
      }
      object.geometry.dispose();
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      for (const material of materials) {
        const texture = (material as unknown as { map?: { dispose: () => void } }).map;
        texture?.dispose();
        material.dispose();
      }
    });
  }
}
