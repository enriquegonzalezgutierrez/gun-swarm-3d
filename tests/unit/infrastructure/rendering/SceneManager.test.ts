import { describe, expect, it } from 'vitest';
import { AmbientLight, Color, DirectionalLight, Fog } from 'three';
import { SceneManager } from '@infrastructure/rendering/SceneManager';
import { Position3D } from '@domain/value-objects/Position3D';

describe('SceneManager', () => {
  it('configures the camera, lights and initial fog', () => {
    const manager = new SceneManager();

    expect(manager.camera.fov).toBe(60);
    expect(manager.camera.aspect).toBeCloseTo(9 / 16);
    expect(manager.camera.position.toArray()).toEqual([0, 14, -12]);
    expect(manager.ambientLight).toBeInstanceOf(AmbientLight);
    expect(manager.directionalLight).toBeInstanceOf(DirectionalLight);
    expect(manager.scene.fog).toBeInstanceOf(Fog);
    expect(manager.scene.children).toContain(manager.ambientLight);
    expect(manager.scene.children).toContain(manager.directionalLight);
  });

  it('resizes the camera aspect ratio', () => {
    const manager = new SceneManager();

    manager.resize(360, 640);

    expect(manager.camera.aspect).toBeCloseTo(360 / 640);
    expect(() => manager.resize(0, 640)).toThrow(RangeError);
  });

  it('follows the target with lateral damping and rigid depth', () => {
    const manager = new SceneManager();

    manager.updateCameraTarget(new Position3D(10, 0, 20));
    expect(manager.camera.position.x).toBeCloseTo(1);
    expect(manager.camera.position.y).toBe(14);
    expect(manager.camera.position.z).toBe(8);

    manager.updateCameraTarget(new Position3D(10, 0, 30));
    expect(manager.camera.position.x).toBeCloseTo(1.9);
    expect(manager.camera.position.z).toBe(18);
  });

  it('applies the five biome palettes', () => {
    const manager = new SceneManager();

    manager.setBiomeEnvironment(3);
    expect(manager.scene.background).toBeInstanceOf(Color);
    expect((manager.scene.background as Color).getHex()).toBe(0x121f15);
    expect(manager.scene.fog).toBeInstanceOf(Fog);
    expect((manager.scene.fog as Fog).color.getHex()).toBe(0x121f15);
    expect((manager.scene.fog as Fog).near).toBe(45);
    expect((manager.scene.fog as Fog).far).toBe(120);

    manager.setBiomeEnvironment(5);
    expect((manager.scene.background as Color).getHex()).toBe(0x1a002c);
    expect(() => manager.setBiomeEnvironment(0)).toThrow(RangeError);
    expect(() => manager.setBiomeEnvironment(6)).toThrow(RangeError);
  });
});
