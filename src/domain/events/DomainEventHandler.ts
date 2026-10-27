import type { DomainEvent } from './DomainEvent';

export type DomainEventHandler<TEvent extends DomainEvent = DomainEvent> = (
  event: TEvent,
) => void;
