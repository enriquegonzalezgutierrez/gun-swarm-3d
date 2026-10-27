import type { Boss } from '../../domain/entities/Boss';
import { ObstacleType } from '../../domain/entities/ObstacleType';
import { PickupType } from '../../domain/entities/PickupType';
import { BoundingBox3D } from '../../domain/value-objects/BoundingBox3D';
import { Position3D } from '../../domain/value-objects/Position3D';
import type { PhysicsPort } from '../ports/driven/PhysicsPort';
import type { RenderPort } from '../ports/driven/RenderPort';
import { GateLabelFormatter } from './GateLabelFormatter';
import type { PhaseContent } from './PhaseContent';

const OBSTACLE_MESH_TYPES: Readonly<Record<ObstacleType, string>> = {
  [ObstacleType.WoodCrate]: 'WoodCrate',
  [ObstacleType.ConcreteBlock]: 'ConcreteBlock',
  [ObstacleType.SteelVault]: 'SteelVault',
  [ObstacleType.ExplosiveBarrel]: 'ExplosiveBarrel',
  [ObstacleType.ToxicBarrel]: 'ToxicBarrel',
  [ObstacleType.RotatingSpikeRoller]: 'RotatingSpikeRoller',
  [ObstacleType.SwingingBlade]: 'SwingingBlade',
};

const PICKUP_MESH_TYPES: Readonly<Record<PickupType, string>> = {
  [PickupType.GoldCoin]: 'GoldCoin',
  [PickupType.WeaponChest]: 'WeaponUpgradeChest',
  [PickupType.ShieldOrb]: 'ShieldOrb',
};

export class PhaseContentView {
  private readonly ids = new Set<string>();
  private phaseNumber = 1;

  public constructor(
    private readonly render: RenderPort,
    private readonly physics: PhysicsPort,
  ) {}

  public spawn(content: PhaseContent, phaseNumber: number): void {
    this.phaseNumber = phaseNumber;
    for (const gate of content.gates) {
      this.create(
        gate.id,
        gate.isPositive ? 'MathGatePositive' : 'MathGateNegative',
        gate.position,
        BoundingBox3D.fromCenterAndSize(
          gate.position.withY(1.75),
          new Position3D(4.5, 3.5, 0.3),
        ),
        true,
        GateLabelFormatter.format(gate),
      );
    }
    for (const [id, obstacle] of content.obstacles) {
      this.create(id, OBSTACLE_MESH_TYPES[obstacle.type], obstacle.position, obstacle.hitbox, true);
    }
    for (const [id, pickup] of content.pickups) {
      this.create(
        id,
        PICKUP_MESH_TYPES[pickup.type],
        pickup.position,
        BoundingBox3D.fromCenterAndSize(
          pickup.position.withY(0.55),
          new Position3D(1.1, 1.1, 1.1),
        ),
        true,
      );
    }
    this.create(content.boss.id, this.bossMeshType(), content.boss.position, this.bossBox(content.boss), false);
  }

  public syncBoss(boss: Boss): void {
    this.render.updateEntityTransform(boss.id, boss.position);
    this.physics.updateColliderPosition(boss.id, boss.position.withY(2.5));
  }

  public retain(activeIds: ReadonlySet<string>): void {
    for (const id of [...this.ids]) {
      if (!activeIds.has(id)) {
        this.remove(id);
      }
    }
  }

  public remove(id: string): void {
    this.render.removeEntityMesh(id);
    this.physics.removeCollider(id);
    this.ids.delete(id);
  }

  public dispose(): void {
    for (const id of [...this.ids]) {
      this.remove(id);
    }
  }

  private create(
    id: string,
    type: string,
    position: Position3D,
    box: BoundingBox3D,
    isStatic: boolean,
    label?: string,
  ): void {
    this.render.createEntityMesh(id, type, position, label);
    this.physics.registerCollider(id, box, isStatic);
    this.ids.add(id);
  }

  private bossBox(boss: Boss): BoundingBox3D {
    return BoundingBox3D.fromCenterAndSize(
      boss.position.withY(2.5),
      new Position3D(6, 5, 6),
    );
  }

  private bossMeshType(): string {
    switch (this.phaseNumber) {
      case 1:
        return 'Boss1_WarRig';
      case 2:
        return 'Boss2_DreadChopper';
      case 3:
        return 'Boss3_SpiderMech';
      case 4:
        return 'Boss4_FrostBehemoth';
      case 5:
        return 'Boss5_DreadNexus';
      default:
        throw new Error(`Unsupported phase for boss mesh: ${this.phaseNumber}.`);
    }
  }
}
