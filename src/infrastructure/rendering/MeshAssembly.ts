import * as THREE from 'three';
import { MaterialFactory } from './MaterialFactory';

export type Vector3Tuple = readonly [number, number, number];

export class MeshAssembly {
  private readonly group = new THREE.Group();

  public add(mesh: THREE.Mesh): void {
    this.group.add(mesh);
  }

  public addBox(
    size: Vector3Tuple,
    color: number,
    position: Vector3Tuple = [0, 0, 0],
    rotation?: Vector3Tuple,
  ): THREE.Mesh {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(...size),
      MaterialFactory.standard(color),
    );
    return this.place(mesh, position, rotation);
  }

  public addCapsule(
    radius: number,
    length: number,
    color: number,
    position: Vector3Tuple = [0, 0, 0],
    rotation?: Vector3Tuple,
  ): THREE.Mesh {
    const mesh = new THREE.Mesh(
      new THREE.CapsuleGeometry(radius, length, 4, 8),
      MaterialFactory.standard(color),
    );
    return this.place(mesh, position, rotation);
  }

  public addCylinder(
    radiusTop: number,
    radiusBottom: number,
    height: number,
    color: number,
    position: Vector3Tuple = [0, 0, 0],
    rotation?: Vector3Tuple,
    radialSegments = 16,
  ): THREE.Mesh {
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments),
      MaterialFactory.standard(color),
    );
    return this.place(mesh, position, rotation);
  }

  public addSphere(
    radius: number,
    color: number,
    position: Vector3Tuple = [0, 0, 0],
    scale?: Vector3Tuple,
  ): THREE.Mesh {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 16, 12),
      MaterialFactory.standard(color),
    );
    if (scale !== undefined) {
      mesh.scale.set(...scale);
    }
    return this.place(mesh, position);
  }

  public addCone(
    radius: number,
    height: number,
    color: number,
    position: Vector3Tuple = [0, 0, 0],
    rotation?: Vector3Tuple,
    radialSegments = 12,
  ): THREE.Mesh {
    const mesh = new THREE.Mesh(
      new THREE.ConeGeometry(radius, height, radialSegments),
      MaterialFactory.standard(color),
    );
    return this.place(mesh, position, rotation);
  }

  public addTorus(
    radius: number,
    tube: number,
    color: number,
    position: Vector3Tuple = [0, 0, 0],
    rotation?: Vector3Tuple,
    arc = Math.PI * 2,
  ): THREE.Mesh {
    const mesh = new THREE.Mesh(
      new THREE.TorusGeometry(radius, tube, 8, 20, arc),
      MaterialFactory.standard(color),
    );
    return this.place(mesh, position, rotation);
  }

  public build(): THREE.Group {
    return this.group;
  }

  private place(
    mesh: THREE.Mesh,
    position: Vector3Tuple,
    rotation?: Vector3Tuple,
  ): THREE.Mesh {
    mesh.position.set(...position);
    if (rotation !== undefined) {
      mesh.rotation.set(...rotation);
    }
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.group.add(mesh);
    return mesh;
  }
}
