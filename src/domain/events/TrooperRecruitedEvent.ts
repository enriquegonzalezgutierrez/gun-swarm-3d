import type { DomainEvent } from './DomainEvent';

export class TrooperRecruitedEvent implements DomainEvent {
  public readonly eventName = 'trooper.recruited';

  public constructor(
    public readonly aggregateId: string,
    public readonly trooperId: string,
    public readonly occurredAt: number,
  ) {}
}
