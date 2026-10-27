import { Trooper } from '../entities/Trooper';
import { Position3D } from '../value-objects/Position3D';
import { WeaponTier } from '../value-objects/WeaponTier';
import { WeaponTierValue } from '../value-objects/WeaponTierValue';
import { SwarmCenterCalculator } from '../services/SwarmCenterCalculator';

export class SquadAggregate {
  public readonly id: string;
  private readonly leader: Trooper;
  private readonly members = new Map<string, Trooper>();
  private weapon: WeaponTierValue;

  public constructor(
    id: string,
    leader: Trooper,
    weaponTier: WeaponTier = WeaponTier.ServicePistol,
  ) {
    if (id.trim().length === 0) {
      throw new RangeError('Squad id must not be empty.');
    }
    this.id = id;
    this.leader = leader;
    this.weapon = WeaponTierValue.from(weaponTier);
  }

  public get leaderEntity(): Trooper {
    return this.leader;
  }

  public get leaderPosition(): Position3D {
    return this.leader.position;
  }

  public get weaponTier(): WeaponTier {
    return this.weapon.tier;
  }

  public get activeTroopers(): readonly Trooper[] {
    return [...this.members.values()].filter((trooper) => trooper.isActive);
  }

  public get trooperCount(): number {
    return this.activeTroopers.length;
  }

  public get totalSize(): number {
    return (this.leader.isActive ? 1 : 0) + this.trooperCount;
  }

  public get isWiped(): boolean {
    return !this.leader.isActive;
  }

  public get center(): Position3D {
    return SwarmCenterCalculator.calculate(this.leader, this.activeTroopers);
  }

  public addTrooper(trooper: Trooper): void {
    if (!trooper.isActive) {
      throw new Error('Only active troopers can join the squad.');
    }
    if (trooper.id === this.leader.id) {
      throw new Error(`Trooper ${trooper.id} is already the squad leader.`);
    }
    if (this.members.has(trooper.id)) {
      throw new Error(`Trooper ${trooper.id} already belongs to squad ${this.id}.`);
    }
    this.members.set(trooper.id, trooper);
  }

  public removeTrooper(trooperId: string): boolean {
    return this.members.delete(trooperId);
  }

  public killTrooper(trooperId: string): boolean {
    const trooper = this.members.get(trooperId);
    if (trooper === undefined) {
      return false;
    }
    trooper.kill();
    return true;
  }

  public findTrooper(trooperId: string): Trooper | undefined {
    if (trooperId === this.leader.id) {
      return this.leader;
    }
    return this.members.get(trooperId);
  }

  public moveLeaderTo(position: Position3D): void {
    this.leader.moveTo(position);
  }

  public killLeader(): void {
    this.leader.kill();
  }

  public setWeaponTier(tier: WeaponTier): void {
    this.weapon = WeaponTierValue.from(tier);
  }

  public upgradeWeapon(): WeaponTier {
    this.weapon = this.weapon.next();
    return this.weapon.tier;
  }
}
