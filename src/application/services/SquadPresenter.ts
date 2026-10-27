import type { SquadAggregate } from '../../domain/aggregates/SquadAggregate';
import type { Trooper } from '../../domain/entities/Trooper';
import { BoundingBox3D } from '../../domain/value-objects/BoundingBox3D';
import { Position3D } from '../../domain/value-objects/Position3D';
import type { PhysicsPort } from '../ports/driven/PhysicsPort';
import type { RenderPort } from '../ports/driven/RenderPort';

export class SquadPresenter {
  private readonly meshIds = new Set<string>();
  private readonly colliderIds = new Set<string>();

  public constructor(
    private readonly render: RenderPort,
    private readonly physics: PhysicsPort,
  ) {}

  public sync(squad: SquadAggregate): void {
    const leader = squad.leaderEntity;
    const active = [leader, ...squad.activeTroopers];
    const activeIds = new Set(active.map((trooper) => trooper.id));
    for (const trooper of active) {
      this.syncTrooper(trooper, trooper.id === leader.id);
    }
    for (const id of [...this.meshIds]) {
      if (!activeIds.has(id)) {
        this.remove(id);
      }
    }
  }

  public dispose(): void {
    for (const id of [...this.meshIds]) {
      this.remove(id);
    }
  }

  private syncTrooper(trooper: Trooper, isLeader: boolean): void {
    const type = isLeader ? 'SquadLeader' : 'StandardTrooper';
    if (!this.meshIds.has(trooper.id)) {
      this.render.createEntityMesh(trooper.id, type, trooper.position);
      this.meshIds.add(trooper.id);
    } else {
      this.render.updateEntityTransform(trooper.id, trooper.position);
    }
    if (!this.colliderIds.has(trooper.id)) {
      this.physics.registerCollider(trooper.id, this.colliderBox(trooper.position), false);
      this.colliderIds.add(trooper.id);
    } else {
      this.physics.updateColliderPosition(trooper.id, trooper.position);
    }
  }

  private colliderBox(position: Position3D): BoundingBox3D {
    return BoundingBox3D.fromCenterAndSize(
      new Position3D(position.x, position.y + 0.9, position.z),
      new Position3D(0.6, 1.8, 0.6),
    );
  }

  private remove(id: string): void {
    this.render.removeEntityMesh(id);
    this.physics.removeCollider(id);
    this.meshIds.delete(id);
    this.colliderIds.delete(id);
  }
}
