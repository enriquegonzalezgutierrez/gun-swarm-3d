import {
  AmbientLight,
  Color,
  DirectionalLight,
  Fog,
  PerspectiveCamera,
  Scene,
} from 'three';
import type { Position3D } from '../../domain/value-objects/Position3D';
import { BiomeRegistry } from '../biomes/BiomeRegistry';

const CAMERA_OFFSET_X = 0;
const CAMERA_OFFSET_Y = 14;
const CAMERA_OFFSET_Z = -12;
const LOOK_OFFSET_Y = 1.5;
const LOOK_OFFSET_Z = 6;
const DAMPING = 0.1;

export class SceneManager {
  public readonly scene = new Scene();
  public readonly camera: PerspectiveCamera;
  public readonly ambientLight = new AmbientLight(0xffffff, 0.65);
  public readonly directionalLight = new DirectionalLight(0xffffff, 1.3);

  public constructor() {
    this.camera = new PerspectiveCamera(60, 9 / 16, 0.1, 500);
    this.camera.position.set(CAMERA_OFFSET_X, CAMERA_OFFSET_Y, CAMERA_OFFSET_Z);
    this.directionalLight.position.set(10, 20, -10);
    this.scene.add(this.ambientLight, this.directionalLight);
    this.setBiomeEnvironment(1);
  }

  public resize(width: number, height: number): void {
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
      throw new RangeError('Viewport dimensions must be positive numbers.');
    }
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  public updateCameraTarget(target: Position3D): void {
    const desiredX = target.x + CAMERA_OFFSET_X;
    this.camera.position.x += (desiredX - this.camera.position.x) * DAMPING;
    this.camera.position.y = target.y + CAMERA_OFFSET_Y;
    this.camera.position.z = target.z + CAMERA_OFFSET_Z;
    this.camera.lookAt(
      target.x,
      target.y + LOOK_OFFSET_Y,
      target.z + LOOK_OFFSET_Z,
    );
  }

  public setBiomeEnvironment(biomeId: number): void {
    const palette = BiomeRegistry.get(biomeId).palette;
    this.scene.background = new Color(palette.background);
    this.scene.fog = new Fog(palette.fogColor, palette.fogNear, palette.fogFar);
  }
}
