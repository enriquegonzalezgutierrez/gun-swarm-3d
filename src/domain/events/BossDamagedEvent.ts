import type { DomainEvent } from './DomainEvent';

export class BossDamagedEvent implements DomainEvent {
  public readonly eventName = 'boss.damaged';

  public constructor(
    public readonly aggregateId: string,
    public readonly bossId: string,
    public readonly damageAmount: number,
    public readonly remainingHealth: number,
    public readonly occurredAt: number,
  ) {}
}
