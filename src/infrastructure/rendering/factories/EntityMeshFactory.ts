import type * as THREE from 'three';

export interface EntityMeshFactory {
  createMesh(): THREE.Group | THREE.Mesh;
}
