import type { SquadAggregate } from '../../domain/aggregates/SquadAggregate';
import type { Damageable } from '../../domain/entities/Damageable';
import { WeaponProfileRegistry } from '../combat/WeaponProfileRegistry';
import { ProjectilePool } from '../combat/ProjectilePool';
import type { PhysicsPort } from '../ports/driven/PhysicsPort';
import type { RenderPort } from '../ports/driven/RenderPort';

const MAX_ACTIVE_PROJECTILES = 200;
const COOLDOWN_EPSILON = 1e-9;
const MUZZLE_HEIGHT = 0.9;

export class ProcessCombatUseCase {
  private readonly projectiles: ProjectilePool;
  private shotCooldownSeconds = 0;

  public constructor(
    physics: PhysicsPort,
    render: RenderPort,
  ) {
    this.projectiles = new ProjectilePool(physics, render);
  }

  public get activeProjectileCount(): number {
    return this.projectiles.size;
  }

  public dispose(): void {
    this.projectiles.clear();
  }

  public execute(
    squad: SquadAggregate,
    targets: ReadonlyMap<string, Damageable>,
    deltaTimeSeconds: number,
  ): void {
    if (!Number.isFinite(deltaTimeSeconds) || deltaTimeSeconds < 0) {
      throw new RangeError('Combat delta time must be a non-negative number.');
    }
    this.shotCooldownSeconds = Math.max(0, this.shotCooldownSeconds - deltaTimeSeconds);
    this.projectiles.update(targets, deltaTimeSeconds);
    this.autoFire(squad, targets);
  }

  private autoFire(
    squad: SquadAggregate,
    targets: ReadonlyMap<string, Damageable>,
  ): void {
    if (
      this.shotCooldownSeconds > COOLDOWN_EPSILON ||
      this.projectiles.size >= MAX_ACTIVE_PROJECTILES ||
      targets.size === 0
    ) {
      return;
    }
    const profile = WeaponProfileRegistry.forTier(squad.weaponTier);
    const shooters = [squad.leaderEntity, ...squad.activeTroopers].filter(
      (trooper) => trooper.isActive,
    );
    let fired = false;
    for (const shooter of shooters) {
      if (this.projectiles.size >= MAX_ACTIVE_PROJECTILES) {
        break;
      }
      this.projectiles.spawn(
        shooter.position.withY(shooter.position.y + MUZZLE_HEIGHT),
        profile.damage,
        profile.projectileSpeed,
        profile.penetration,
      );
      fired = true;
    }
    if (fired) {
      this.shotCooldownSeconds = 1 / profile.fireRate;
    }
  }
}
