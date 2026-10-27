import type { SquadAggregate } from '../../domain/aggregates/SquadAggregate';
import { Trooper } from '../../domain/entities/Trooper';

export class SquadMutationService {
  private nextRecruitId = 1;

  public recruit(squad: SquadAggregate, count: number): void {
    for (let index = 0; index < count; index += 1) {
      const trooper = new Trooper(`recruit-${this.nextRecruitId}`, squad.center);
      this.nextRecruitId += 1;
      squad.addTrooper(trooper);
    }
  }

  public dismiss(squad: SquadAggregate, count: number): void {
    const active = squad.activeTroopers;
    const removeCount = Math.min(count, active.length);
    for (let index = 0; index < removeCount; index += 1) {
      const trooper = active[active.length - 1 - index];
      if (trooper !== undefined) {
        squad.killTrooper(trooper.id);
      }
    }
  }

  public eliminateOne(squad: SquadAggregate): void {
    const active = squad.activeTroopers;
    const victim = active[active.length - 1];
    if (victim !== undefined) {
      squad.killTrooper(victim.id);
      return;
    }
    squad.killLeader();
  }
}
