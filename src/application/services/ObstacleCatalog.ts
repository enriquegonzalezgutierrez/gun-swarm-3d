import { ObstacleType } from '../../domain/entities/ObstacleType';

interface ObstacleDefinition {
  readonly health: number;
  readonly size: readonly [number, number, number];
}

const CYCLE: readonly ObstacleType[] = [
  ObstacleType.WoodCrate,
  ObstacleType.ConcreteBlock,
  ObstacleType.ExplosiveBarrel,
  ObstacleType.SteelVault,
  ObstacleType.ToxicBarrel,
  ObstacleType.RotatingSpikeRoller,
];

const DEFINITIONS: Readonly<Record<ObstacleType, ObstacleDefinition>> = {
  [ObstacleType.WoodCrate]: { health: 8, size: [1.2, 1.2, 1.2] },
  [ObstacleType.ConcreteBlock]: { health: 30, size: [1.8, 1.8, 1.8] },
  [ObstacleType.SteelVault]: { health: 120, size: [1.7, 1.7, 1.7] },
  [ObstacleType.ExplosiveBarrel]: { health: 1, size: [1.2, 1.4, 1.2] },
  [ObstacleType.ToxicBarrel]: { health: 1, size: [1.2, 1.4, 1.2] },
  [ObstacleType.RotatingSpikeRoller]: { health: 1, size: [4, 0.8, 0.8] },
  [ObstacleType.SwingingBlade]: { health: 1, size: [1.4, 2.8, 1.4] },
};

export class ObstacleCatalog {
  public static types(): readonly ObstacleType[] {
    return CYCLE;
  }

  public static health(type: ObstacleType): number {
    return DEFINITIONS[type].health;
  }

  public static size(type: ObstacleType): readonly [number, number, number] {
    return DEFINITIONS[type].size;
  }
}
