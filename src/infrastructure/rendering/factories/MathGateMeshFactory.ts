import {
  CanvasTexture,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  type Group,
  type MeshStandardMaterial,
} from 'three';
import { MeshAssembly } from '../MeshAssembly';
import type { EntityMeshFactory } from './EntityMeshFactory';

export class MathGateMeshFactory implements EntityMeshFactory {
  public constructor(private readonly positive = true) {}

  public createMesh(): Group {
    const assembly = new MeshAssembly();
    const color = this.positive ? 0x00e5ff : 0xd50000;
    assembly.addBox([0.22, 3.5, 0.22], color, [-2.1, 1.75, 0]);
    assembly.addBox([0.22, 3.5, 0.22], color, [2.1, 1.75, 0]);
    assembly.addBox([4.5, 0.3, 0.25], color, [0, 3.5, 0]);
    const glass = assembly.addBox([4.2, 3, 0.07], color, [0, 1.65, 0]);
    const material = glass.material as MeshStandardMaterial;
    material.transparent = true;
    material.opacity = 0.28;
    material.emissive.setHex(color);
    material.emissiveIntensity = 0.65;
    const text = this.createTextMesh(this.positive ? '+' : '−', this.positive ? '#00e5ff' : '#ff1744');
    if (text !== null) {
      text.position.set(0, 1.9, 0.08);
      assembly.add(text);
    }
    return assembly.build();
  }

  private createTextMesh(label: string, color: string): Mesh | null {
    if (typeof document === 'undefined') {
      return null;
    }
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    if (context === null) {
      return null;
    }
    context.clearRect(0, 0, 256, 256);
    context.fillStyle = color;
    context.font = 'bold 180px sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(label, 128, 128);
    const texture = new CanvasTexture(canvas);
    const material = new MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
    });
    return new Mesh(new PlaneGeometry(1.8, 1.8), material);
  }
}
