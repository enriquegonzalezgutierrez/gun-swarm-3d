import type { DomainEvent } from './DomainEvent';

export class BossDefeatedEvent implements DomainEvent {
  public readonly eventName = 'boss.defeated';

  public constructor(
    public readonly aggregateId: string,
    public readonly bossId: string,
    public readonly occurredAt: number,
  ) {}
}
