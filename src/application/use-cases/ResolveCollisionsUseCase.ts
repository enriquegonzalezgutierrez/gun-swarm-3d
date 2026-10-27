import type { SquadAggregate } from '../../domain/aggregates/SquadAggregate';
import type { MathGate } from '../../domain/entities/MathGate';
import type { Obstacle } from '../../domain/entities/Obstacle';
import type { Pickup } from '../../domain/entities/Pickup';
import { PickupType } from '../../domain/entities/PickupType';
import { Damage } from '../../domain/value-objects/Damage';
import { SquadMutationService } from '../services/SquadMutationService';
import type { PhysicsPort } from '../ports/driven/PhysicsPort';

const GATE_PAIR_EPSILON = 1e-9;

export class ResolveCollisionsUseCase {
  private readonly squadMutations = new SquadMutationService();
  private goldCollected = 0;
  private shieldSecondsValue = 0;

  public constructor(private readonly physics: PhysicsPort) {}

  public get collectedGold(): number {
    return this.goldCollected;
  }

  public get shieldSeconds(): number {
    return this.shieldSecondsValue;
  }

  public resetRunStats(): void {
    this.goldCollected = 0;
    this.shieldSecondsValue = 0;
  }

  public execute(
    squad: SquadAggregate,
    gates: readonly MathGate[],
    obstacles: Map<string, Obstacle>,
    pickups: Map<string, Pickup>,
  ): void {
    this.resolveGates(squad, gates);
    this.resolveObstacles(squad, obstacles);
    this.resolvePickups(squad, pickups);
  }

  private resolveGates(squad: SquadAggregate, gates: readonly MathGate[]): void {
    for (const gate of gates) {
      if (!gate.isActive || !this.overlapsSquad(squad, gate.id)) {
        continue;
      }
      const before = squad.totalSize;
      const after = gate.applyTo(before);
      if (after > before) {
        this.squadMutations.recruit(squad, after - before);
      } else if (after < before) {
        this.squadMutations.dismiss(squad, before - after);
      }
      for (const pair of gates) {
        if (Math.abs(pair.position.z - gate.position.z) <= GATE_PAIR_EPSILON) {
          pair.consume();
        }
      }
    }
  }

  private resolveObstacles(squad: SquadAggregate, obstacles: Map<string, Obstacle>): void {
    for (const [id, obstacle] of [...obstacles.entries()]) {
      if (!this.overlapsSquad(squad, id)) {
        continue;
      }
      if (obstacle.isDestructible) {
        obstacle.applyDamage(new Damage(obstacle.health.current));
        obstacles.delete(id);
      }
      this.squadMutations.eliminateOne(squad);
    }
  }

  private resolvePickups(squad: SquadAggregate, pickups: Map<string, Pickup>): void {
    for (const [id, pickup] of [...pickups.entries()]) {
      if (pickup.isCollected || !this.overlapsSquad(squad, id)) {
        continue;
      }
      const value = pickup.collect();
      switch (pickup.type) {
        case PickupType.GoldCoin:
          this.goldCollected += value;
          break;
        case PickupType.WeaponChest:
          squad.upgradeWeapon();
          break;
        case PickupType.ShieldOrb:
          this.shieldSecondsValue = Math.max(this.shieldSecondsValue, value);
          break;
        default:
          throw new Error(`Unsupported pickup type: ${String(pickup.type)}`);
      }
      pickups.delete(id);
    }
  }

  private overlapsSquad(squad: SquadAggregate, objectId: string): boolean {
    return this.physics
      .queryOverlaps(objectId)
      .some((id) => squad.findTrooper(id)?.isActive === true);
  }
}
