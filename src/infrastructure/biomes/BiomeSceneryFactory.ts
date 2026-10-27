import type { Group } from 'three';

export interface BiomeSceneryFactory {
  createScenery(): Group;
}
