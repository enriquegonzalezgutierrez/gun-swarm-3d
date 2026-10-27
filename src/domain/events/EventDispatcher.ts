import type { DomainEvent } from './DomainEvent';
import type { DomainEventHandler } from './DomainEventHandler';

export class EventDispatcher {
  private readonly handlers = new Map<string, DomainEventHandler[]>();

  public subscribe<TEvent extends DomainEvent>(
    eventName: string,
    handler: DomainEventHandler<TEvent>,
  ): () => void {
    const registered: DomainEventHandler = (event: DomainEvent): void => {
      handler(event as TEvent);
    };
    const eventHandlers = this.handlers.get(eventName) ?? [];
    eventHandlers.push(registered);
    this.handlers.set(eventName, eventHandlers);
    return (): void => {
      this.handlers.set(
        eventName,
        (this.handlers.get(eventName) ?? []).filter((entry) => entry !== registered),
      );
    };
  }

  public dispatch(event: DomainEvent): void {
    const eventHandlers = this.handlers.get(event.eventName);
    if (eventHandlers === undefined) {
      return;
    }
    for (const handler of [...eventHandlers]) {
      handler(event);
    }
  }

  public clear(): void {
    this.handlers.clear();
  }
}
