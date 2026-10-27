import { describe, expect, it, vi } from 'vitest';
import { Color, Fog, Mesh, Points, type WebGLRenderer } from 'three';
import { ThreeJsRenderAdapter } from '@infrastructure/rendering/ThreeJsRenderAdapter';
import { SceneManager } from '@infrastructure/rendering/SceneManager';
import { Position3D } from '@domain/value-objects/Position3D';

function createRenderer(): WebGLRenderer {
  return {
    setSize: vi.fn(),
    render: vi.fn(),
    dispose: vi.fn(),
  } as unknown as WebGLRenderer;
}

function createContainer(canvas: HTMLCanvasElement): HTMLElement {
  return {
    clientWidth: 360,
    clientHeight: 640,
    ownerDocument: { createElement: vi.fn(() => canvas) },
    querySelector: vi.fn(() => null),
    appendChild: vi.fn(),
  } as unknown as HTMLElement;
}

describe('ThreeJsRenderAdapter', () => {
  it('initializes the viewport and renders the scene', () => {
    const sceneManager = new SceneManager();
    const renderer = createRenderer();
    const factory = vi.fn(() => renderer);
    const adapter = new ThreeJsRenderAdapter(sceneManager, factory);
    const canvas = { style: {} } as unknown as HTMLCanvasElement;
    const container = createContainer(canvas);

    adapter.initViewport(container);
    adapter.render();

    expect(factory).toHaveBeenCalledWith(canvas);
    expect(renderer.setSize).toHaveBeenCalledWith(360, 640, false);
    expect(container.appendChild).toHaveBeenCalledWith(canvas);
    expect(sceneManager.camera.aspect).toBeCloseTo(360 / 640);
    expect(renderer.render).toHaveBeenCalledWith(sceneManager.scene, sceneManager.camera);
  });

  it('does nothing when rendering before initialization', () => {
    const adapter = new ThreeJsRenderAdapter(new SceneManager(), () => createRenderer());

    expect(() => adapter.render()).not.toThrow();
  });

  it('creates, updates and removes entity meshes', () => {
    const sceneManager = new SceneManager();
    const adapter = new ThreeJsRenderAdapter(sceneManager, () => createRenderer());
    adapter.createEntityMesh('leader', 'SquadLeader', new Position3D(1, 0, 2));

    const entity = sceneManager.scene.children.find(
      (child) => child instanceof Mesh || child.type === 'Group',
    );
    expect(entity).toBeDefined();

    adapter.updateEntityTransform('leader', new Position3D(3, 0, 4), Math.PI / 2);
    expect(entity?.position.toArray()).toEqual([3, 0, 4]);
    expect(entity?.rotation.y).toBeCloseTo(Math.PI / 2);

    adapter.removeEntityMesh('leader');
    expect(sceneManager.scene.children).not.toContain(entity);
  });

  it('rejects unknown entity types', () => {
    const adapter = new ThreeJsRenderAdapter(new SceneManager(), () => createRenderer());

    expect(() =>
      adapter.createEntityMesh('unknown', 'UnknownEntity', Position3D.zero()),
    ).toThrow(Error);
  });

  it('delegates biome changes and particles to infrastructure managers', () => {
    const sceneManager = new SceneManager();
    const adapter = new ThreeJsRenderAdapter(sceneManager, () => createRenderer());

    adapter.setBiomeEnvironment(2);
    adapter.spawnExplosionParticles(new Position3D(1, 2, 3), 0xff0000);

    expect(sceneManager.scene.fog).toBeInstanceOf(Fog);
    expect((sceneManager.scene.background as Color).getHex()).toBe(0x2a1208);
    expect(sceneManager.scene.children.some((child) => child instanceof Points)).toBe(true);
  });

  it('disposes meshes, particles and the renderer', () => {
    const sceneManager = new SceneManager();
    const renderer = createRenderer();
    const adapter = new ThreeJsRenderAdapter(sceneManager, () => renderer);
    const canvas = { style: {} } as unknown as HTMLCanvasElement;
    adapter.initViewport(createContainer(canvas));
    adapter.createEntityMesh('leader', 'SquadLeader', Position3D.zero());

    adapter.dispose();

    expect(renderer.dispose).toHaveBeenCalledTimes(1);
    expect(sceneManager.scene.children.filter((child) => child instanceof Points)).toHaveLength(0);
  });
});
