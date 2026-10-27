import { describe, expect, it, vi } from 'vitest';
import { EventDispatcher } from '@domain/events/EventDispatcher';
import { SquadWipedEvent } from '@domain/events/SquadWipedEvent';
import { TrooperRecruitedEvent } from '@domain/events/TrooperRecruitedEvent';

describe('EventDispatcher', () => {
  it('delivers events only to matching subscribers', () => {
    const dispatcher = new EventDispatcher();
    const handler = vi.fn();
    dispatcher.subscribe<TrooperRecruitedEvent>('trooper.recruited', handler);

    const recruited = new TrooperRecruitedEvent('squad-1', 'trooper-1', 1000);
    dispatcher.dispatch(recruited);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(recruited);
  });

  it('ignores event names without subscribers', () => {
    const dispatcher = new EventDispatcher();
    const handler = vi.fn();
    dispatcher.subscribe('trooper.recruited', handler);

    dispatcher.dispatch(new SquadWipedEvent('squad-1', 2000));

    expect(handler).not.toHaveBeenCalled();
  });

  it('supports multiple subscribers for the same event', () => {
    const dispatcher = new EventDispatcher();
    const first = vi.fn();
    const second = vi.fn();
    dispatcher.subscribe('squad.wiped', first);
    dispatcher.subscribe('squad.wiped', second);

    dispatcher.dispatch(new SquadWipedEvent('squad-1', 3000));

    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('unsubscribes handlers', () => {
    const dispatcher = new EventDispatcher();
    const handler = vi.fn();
    const unsubscribe = dispatcher.subscribe('squad.wiped', handler);

    unsubscribe();
    dispatcher.dispatch(new SquadWipedEvent('squad-1', 4000));

    expect(handler).not.toHaveBeenCalled();
  });

  it('clears every subscription', () => {
    const dispatcher = new EventDispatcher();
    const first = vi.fn();
    const second = vi.fn();
    dispatcher.subscribe('squad.wiped', first);
    dispatcher.subscribe('trooper.recruited', second);

    dispatcher.clear();
    dispatcher.dispatch(new SquadWipedEvent('squad-1', 5000));
    dispatcher.dispatch(new TrooperRecruitedEvent('squad-1', 'trooper-1', 5001));

    expect(first).not.toHaveBeenCalled();
    expect(second).not.toHaveBeenCalled();
  });
});
