import {
  BufferAttribute,
  BufferGeometry,
  Group,
  Points,
  PointsMaterial,
  MeshStandardMaterial,
} from 'three';
import { MeshAssembly } from '../rendering/MeshAssembly';
import { BiomePropPlacer } from './BiomePropPlacer';
import type { BiomeSceneryFactory } from './BiomeSceneryFactory';

const TRACK_LENGTH = 350;
const VIOLET = 0xd500f9;
const CYAN = 0x00e5ff;
const STAR_COUNT = 300;

export class CyberVoidBiomeFactory implements BiomeSceneryFactory {
  public createScenery(): Group {
    const scenery = new Group();
    scenery.add(this.createStarfield());
    BiomePropPlacer.scatter(scenery, TRACK_LENGTH, 50, (index, side, z) =>
      this.createObelisk(side, z, index),
    );
    for (let z = 30; z < TRACK_LENGTH; z += 45) {
      scenery.add(this.createDataRing(z, z / 45));
    }
    return scenery;
  }

  private createStarfield(): Points {
    const positions = new Float32Array(STAR_COUNT * 3);
    let seed = 20261027;
    const random = (): number => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let index = 0; index < STAR_COUNT; index += 1) {
      positions[index * 3] = (random() - 0.5) * 120;
      positions[index * 3 + 1] = 4 + random() * 80;
      positions[index * 3 + 2] = -50 + random() * (TRACK_LENGTH + 100);
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(positions, 3));
    const material = new PointsMaterial({
      color: VIOLET,
      size: 0.5,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    const stars = new Points(geometry, material);
    stars.frustumCulled = false;
    return stars;
  }

  private createObelisk(side: number, z: number, index: number): Group {
    const assembly = new MeshAssembly();
    const height = 3 + (index % 4) * 1.5;
    const x = side * (8 + (index % 3) * 1.5);
    const base = assembly.addBox([0.9, height, 0.9], 0x311b92, [x, 1.5 + height / 2, z], [0, index * 0.2, 0]);
    const material = base.material as MeshStandardMaterial;
    material.emissive.setHex(VIOLET);
    material.emissiveIntensity = 0.35;
    assembly.addCone(0.7, 1.3, VIOLET, [x, 1.5 + height + 0.65, z]);
    assembly.addTorus(0.75, 0.04, CYAN, [x, 1.5 + height / 2, z], [Math.PI / 2, 0, 0]);
    return assembly.build();
  }

  private createDataRing(z: number, variant: number): Group {
    const assembly = new MeshAssembly();
    const y = 5 + (variant % 3) * 1.4;
    assembly.addTorus(1.6, 0.05, CYAN, [0, y, z], [Math.PI / 2, variant * 0.3, 0]);
    assembly.addTorus(2.1, 0.04, VIOLET, [0, y, z], [Math.PI / 2, -variant * 0.25, 0]);
    assembly.addSphere(0.18, CYAN, [0, y, z]);
    return assembly.build();
  }
}
