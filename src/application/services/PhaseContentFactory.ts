import type { PhaseConfig } from '../dtos/PhaseConfig';
import { Boss } from '../../domain/entities/Boss';
import { GateLane } from '../../domain/entities/GateLane';
import { GateOperation } from '../../domain/entities/GateOperation';
import { MathGate } from '../../domain/entities/MathGate';
import { Obstacle } from '../../domain/entities/Obstacle';
import { ObstacleType } from '../../domain/entities/ObstacleType';
import { Pickup } from '../../domain/entities/Pickup';
import { PickupType } from '../../domain/entities/PickupType';
import { BoundingBox3D } from '../../domain/value-objects/BoundingBox3D';
import { Health } from '../../domain/value-objects/Health';
import { Position3D } from '../../domain/value-objects/Position3D';
import { ObstacleCatalog } from './ObstacleCatalog';
import type { PhaseContent } from './PhaseContent';

export class PhaseContentFactory {
  public create(config: PhaseConfig): PhaseContent {
    return {
      gates: this.createGates(config),
      obstacles: this.createObstacles(config),
      pickups: this.createPickups(config),
      boss: new Boss(
        `boss-${config.phaseNumber}`,
        config.bossName,
        new Position3D(0, 0, config.trackLength + 20),
        config.bossMaxHealth,
      ),
    };
  }

  private createGates(config: PhaseConfig): MathGate[] {
    const gates: MathGate[] = [];
    let index = 0;
    for (let z = 65; z < config.trackLength - 20; z += 65) {
      const positiveLeft = index % 2 === 0;
      const leftOperation = positiveLeft ? GateOperation.Add : GateOperation.Multiply;
      const rightOperation = positiveLeft ? GateOperation.Divide : GateOperation.Subtract;
      gates.push(
        new MathGate(
          `gate-${index}-left`,
          leftOperation,
          this.gateValue(leftOperation),
          GateLane.Left,
          new Position3D(-2.25, 0, z),
        ),
        new MathGate(
          `gate-${index}-right`,
          rightOperation,
          this.gateValue(rightOperation),
          GateLane.Right,
          new Position3D(2.25, 0, z),
        ),
      );
      index += 1;
    }
    return gates;
  }

  private createObstacles(config: PhaseConfig): Map<string, Obstacle> {
    const obstacles = new Map<string, Obstacle>();
    let index = 0;
    for (let z = 40; z < config.trackLength - 25; z += 28) {
      const type = ObstacleCatalog.types()[index % ObstacleCatalog.types().length] ?? ObstacleType.WoodCrate;
      const size = ObstacleCatalog.size(type);
      const x = ((index % 3) - 1) * 2.4;
      const id = `obstacle-${config.phaseNumber}-${index}`;
      obstacles.set(
        id,
        new Obstacle(
          id,
          type,
          new Position3D(x, 0, z),
          BoundingBox3D.fromCenterAndSize(
            new Position3D(x, size[1] / 2, z),
            new Position3D(size[0], size[1], size[2]),
          ),
          Health.full(ObstacleCatalog.health(type)),
        ),
      );
      index += 1;
    }
    return obstacles;
  }

  private createPickups(config: PhaseConfig): Map<string, Pickup> {
    const pickups = new Map<string, Pickup>();
    let index = 0;
    for (let z = 50; z < config.trackLength - 20; z += 42) {
      const x = ((index % 3) - 1) * 2;
      const id = `coin-${config.phaseNumber}-${index}`;
      pickups.set(id, new Pickup(id, PickupType.GoldCoin, new Position3D(x, 0, z), 1));
      index += 1;
    }
    const shieldId = `shield-${config.phaseNumber}`;
    pickups.set(
      shieldId,
      new Pickup(shieldId, PickupType.ShieldOrb, new Position3D(0, 0, config.trackLength * 0.5), 3.5),
    );
    const chestId = `chest-${config.phaseNumber}`;
    pickups.set(
      chestId,
      new Pickup(chestId, PickupType.WeaponChest, new Position3D(0, 0, config.trackLength * 0.7)),
    );
    return pickups;
  }

  private gateValue(operation: GateOperation): number {
    switch (operation) {
      case GateOperation.Add:
        return 10;
      case GateOperation.Subtract:
        return 5;
      case GateOperation.Multiply:
        return 2;
      case GateOperation.Divide:
        return 2;
      default:
        return 1;
    }
  }
}
