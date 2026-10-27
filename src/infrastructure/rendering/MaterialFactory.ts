import { MeshStandardMaterial } from 'three';

export class MaterialFactory {
  public static standard(color: number): MeshStandardMaterial {
    return new MeshStandardMaterial({
      color,
      roughness: 0.62,
      metalness: 0.18,
    });
  }
}
