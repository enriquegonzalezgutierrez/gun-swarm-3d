import type { DomainEvent } from './DomainEvent';

export class SquadWipedEvent implements DomainEvent {
  public readonly eventName = 'squad.wiped';

  public constructor(
    public readonly aggregateId: string,
    public readonly occurredAt: number,
  ) {}
}
