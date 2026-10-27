import type { DomainEvent } from './DomainEvent';

export class ObstacleDestroyedEvent implements DomainEvent {
  public readonly eventName = 'obstacle.destroyed';

  public constructor(
    public readonly aggregateId: string,
    public readonly obstacleId: string,
    public readonly obstacleType: string,
    public readonly occurredAt: number,
  ) {}
}
