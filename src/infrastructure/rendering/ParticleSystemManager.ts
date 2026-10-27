import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Points,
  PointsMaterial,
  Scene,
  Vector3,
} from 'three';
import type { Position3D } from '../../domain/value-objects/Position3D';

const MAX_PARTICLES = 400;
const PARTICLE_LIFETIME = 0.8;
const GRAVITY = -4;
const HIDDEN_Y = -1000;

export class ParticleSystemManager {
  private readonly positions = new Float32Array(MAX_PARTICLES * 3);
  private readonly colors = new Float32Array(MAX_PARTICLES * 3);
  private readonly velocities: Vector3[] = [];
  private readonly lives: number[] = [];
  private readonly positionAttribute = new BufferAttribute(this.positions, 3);
  private readonly colorAttribute = new BufferAttribute(this.colors, 3);
  private readonly geometry = new BufferGeometry();
  private readonly material = new PointsMaterial({
    size: 0.16,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  private readonly points: Points;
  private nextIndex = 0;

  public constructor(private readonly scene: Scene) {
    this.geometry.setAttribute('position', this.positionAttribute);
    this.geometry.setAttribute('color', this.colorAttribute);
    this.points = new Points(this.geometry, this.material);
    this.points.frustumCulled = false;
    this.scene.add(this.points);
    for (let index = 0; index < MAX_PARTICLES; index += 1) {
      this.velocities.push(new Vector3());
      this.lives.push(0);
      this.positions[index * 3 + 1] = HIDDEN_Y;
    }
    this.positionAttribute.needsUpdate = true;
  }

  public get activeParticleCount(): number {
    let active = 0;
    for (const life of this.lives) {
      if (life > 0) {
        active += 1;
      }
    }
    return active;
  }

  public spawn(position: Position3D, color: number, count = 24): void {
    if (!Number.isInteger(count) || count < 1) {
      throw new RangeError('Particle count must be a positive integer.');
    }
    const baseColor = new Color(color);
    for (let particle = 0; particle < count; particle += 1) {
      const index = this.nextIndex;
      this.nextIndex = (this.nextIndex + 1) % MAX_PARTICLES;
      const offset = index * 3;
      this.positions[offset] = position.x;
      this.positions[offset + 1] = position.y;
      this.positions[offset + 2] = position.z;
      const velocity = this.velocities[index];
      velocity?.set(
        (Math.random() - 0.5) * 4,
        Math.random() * 4 + 1,
        (Math.random() - 0.5) * 4,
      );
      this.lives[index] = PARTICLE_LIFETIME;
      const brightness = 0.7 + Math.random() * 0.3;
      this.colors[offset] = baseColor.r * brightness;
      this.colors[offset + 1] = baseColor.g * brightness;
      this.colors[offset + 2] = baseColor.b * brightness;
    }
    this.positionAttribute.needsUpdate = true;
    this.colorAttribute.needsUpdate = true;
  }

  public update(deltaTimeSeconds: number): void {
    if (!Number.isFinite(deltaTimeSeconds) || deltaTimeSeconds < 0) {
      throw new RangeError('Particle delta time must be a non-negative number.');
    }
    for (let index = 0; index < MAX_PARTICLES; index += 1) {
      if ((this.lives[index] ?? 0) <= 0) {
        continue;
      }
      const remaining = (this.lives[index] ?? 0) - deltaTimeSeconds;
      this.lives[index] = remaining;
      if (remaining <= 0) {
        this.positions[index * 3 + 1] = HIDDEN_Y;
        continue;
      }
      const velocity = this.velocities[index];
      if (velocity === undefined) {
        continue;
      }
      velocity.y += GRAVITY * deltaTimeSeconds;
      const offset = index * 3;
      this.positions[offset] = (this.positions[offset] ?? 0) + velocity.x * deltaTimeSeconds;
      this.positions[offset + 1] = (this.positions[offset + 1] ?? 0) + velocity.y * deltaTimeSeconds;
      this.positions[offset + 2] = (this.positions[offset + 2] ?? 0) + velocity.z * deltaTimeSeconds;
    }
    this.positionAttribute.needsUpdate = true;
  }

  public dispose(): void {
    this.scene.remove(this.points);
    this.geometry.dispose();
    this.material.dispose();
  }
}
