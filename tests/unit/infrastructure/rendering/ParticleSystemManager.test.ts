import { describe, expect, it } from 'vitest';
import { Points, Scene } from 'three';
import { ParticleSystemManager } from '@infrastructure/rendering/ParticleSystemManager';
import { Position3D } from '@domain/value-objects/Position3D';

describe('ParticleSystemManager', () => {
  it('spawns and expires particles over time', () => {
    const scene = new Scene();
    const manager = new ParticleSystemManager(scene);

    expect(scene.children.filter((child) => child instanceof Points)).toHaveLength(1);

    manager.spawn(new Position3D(1, 2, 3), 0xff0000, 10);
    expect(manager.activeParticleCount).toBe(10);

    manager.update(0.4);
    expect(manager.activeParticleCount).toBe(10);

    manager.update(0.5);
    expect(manager.activeParticleCount).toBe(0);
  });

  it('recycles particle slots for later bursts', () => {
    const scene = new Scene();
    const manager = new ParticleSystemManager(scene);

    manager.spawn(Position3D.zero(), 0x00ff00, 400);
    manager.spawn(Position3D.zero(), 0x0000ff, 25);

    expect(manager.activeParticleCount).toBe(400);
  });

  it('validates particle counts and delta times', () => {
    const manager = new ParticleSystemManager(new Scene());

    expect(() => manager.spawn(Position3D.zero(), 0xffffff, 0)).toThrow(RangeError);
    expect(() => manager.spawn(Position3D.zero(), 0xffffff, 1.5)).toThrow(RangeError);
    expect(() => manager.update(-0.1)).toThrow(RangeError);
  });

  it('removes its points object on dispose', () => {
    const scene = new Scene();
    const manager = new ParticleSystemManager(scene);

    manager.dispose();

    expect(scene.children.filter((child) => child instanceof Points)).toHaveLength(0);
  });
});
