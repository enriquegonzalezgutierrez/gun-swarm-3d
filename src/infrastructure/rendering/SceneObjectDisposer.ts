import { Mesh, type Group } from 'three';

export class SceneObjectDisposer {
  public static dispose(object: Group | Mesh): void {
    object.traverse((child) => {
      if (!(child instanceof Mesh)) {
        return;
      }
      child.geometry.dispose();
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      for (const material of materials) {
        const texture = (material as unknown as { map?: { dispose: () => void } }).map;
        texture?.dispose();
        material.dispose();
      }
    });
  }
}
