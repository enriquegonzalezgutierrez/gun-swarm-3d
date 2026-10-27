import type { DomainEvent } from './DomainEvent';

export class TrooperKilledEvent implements DomainEvent {
  public readonly eventName = 'trooper.killed';

  public constructor(
    public readonly aggregateId: string,
    public readonly trooperId: string,
    public readonly occurredAt: number,
  ) {}
}
