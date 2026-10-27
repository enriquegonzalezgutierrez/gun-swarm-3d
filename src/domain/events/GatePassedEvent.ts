import type { DomainEvent } from './DomainEvent';

export class GatePassedEvent implements DomainEvent {
  public readonly eventName = 'gate.passed';

  public constructor(
    public readonly aggregateId: string,
    public readonly gateId: string,
    public readonly operation: string,
    public readonly value: number,
    public readonly occurredAt: number,
  ) {}
}
