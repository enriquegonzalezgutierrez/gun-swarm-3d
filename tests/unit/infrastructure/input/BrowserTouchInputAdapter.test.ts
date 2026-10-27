import { describe, expect, it, vi } from 'vitest';
import { BrowserTouchInputAdapter } from '@infrastructure/input/BrowserTouchInputAdapter';
import { FakeEventTarget } from '../../../fixtures/FakeEventTarget';

function touchEvent(clientX: number | null): {
  event: TouchEvent;
  preventDefault: ReturnType<typeof vi.fn>;
} {
  const preventDefault = vi.fn();
  const touches = clientX === null ? [] : [{ clientX }];
  return {
    event: { touches, preventDefault } as unknown as TouchEvent,
    preventDefault,
  };
}

function createHarness(): {
  target: FakeEventTarget;
  adapter: BrowserTouchInputAdapter;
} {
  const target = new FakeEventTarget();
  return {
    target,
    adapter: new BrowserTouchInputAdapter(target as unknown as HTMLElement),
  };
}

describe('BrowserTouchInputAdapter', () => {
  it('attaches the touch listeners on construction', () => {
    const { target } = createHarness();

    expect(target.listenerCount('touchstart')).toBe(1);
    expect(target.listenerCount('touchmove')).toBe(1);
    expect(target.listenerCount('touchend')).toBe(1);
    expect(target.listenerCount('touchcancel')).toBe(1);
  });

  it('normalizes drag distance against the viewport width', () => {
    const { target, adapter } = createHarness();
    const start = touchEvent(100);
    const move = touchEvent(160);

    target.emit('touchstart', start.event);
    target.emit('touchmove', move.event);

    expect(adapter.getNormalizedLateralDelta()).toBeCloseTo(0.1);
    expect(start.preventDefault).toHaveBeenCalledTimes(1);
    expect(move.preventDefault).toHaveBeenCalledTimes(1);
  });

  it('accumulates movement until consumed and clamps to one', () => {
    const { target, adapter } = createHarness();
    target.emit('touchstart', touchEvent(0).event);
    target.emit('touchmove', touchEvent(60).event);
    target.emit('touchmove', touchEvent(120).event);

    expect(adapter.getNormalizedLateralDelta()).toBeCloseTo(0.2);
    adapter.resetDelta();
    expect(adapter.getNormalizedLateralDelta()).toBe(0);

    target.emit('touchstart', touchEvent(0).event);
    target.emit('touchmove', touchEvent(1000).event);
    expect(adapter.getNormalizedLateralDelta()).toBe(1);
  });

  it('ignores movement without an active touch', () => {
    const { target, adapter } = createHarness();
    target.emit('touchmove', touchEvent(200).event);

    expect(adapter.getNormalizedLateralDelta()).toBe(0);
  });

  it('stops tracking after touchend', () => {
    const { target, adapter } = createHarness();
    target.emit('touchstart', touchEvent(100).event);
    target.emit('touchend', touchEvent(null).event);
    target.emit('touchmove', touchEvent(300).event);

    expect(adapter.getNormalizedLateralDelta()).toBe(0);
  });

  it('exposes a one-shot action trigger', () => {
    const { target, adapter } = createHarness();
    target.emit('touchstart', touchEvent(100).event);

    expect(adapter.isActionTriggered()).toBe(true);
    expect(adapter.isActionTriggered()).toBe(false);
  });

  it('ignores touchstart events without touches', () => {
    const { target, adapter } = createHarness();
    target.emit('touchstart', touchEvent(null).event);

    expect(adapter.isActionTriggered()).toBe(false);
  });

  it('removes every listener on dispose', () => {
    const { target, adapter } = createHarness();
    adapter.dispose();

    expect(target.listenerCount('touchstart')).toBe(0);
    expect(target.listenerCount('touchmove')).toBe(0);
    expect(target.listenerCount('touchend')).toBe(0);
    expect(target.listenerCount('touchcancel')).toBe(0);
  });
});
