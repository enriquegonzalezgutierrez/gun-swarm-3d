import { describe, expect, it, vi } from 'vitest';
import { KeyboardInputAdapter } from '@infrastructure/input/KeyboardInputAdapter';
import { FakeEventTarget } from '../../../fixtures/FakeEventTarget';

function keyEvent(code: string, repeat = false): {
  event: KeyboardEvent;
  preventDefault: ReturnType<typeof vi.fn>;
} {
  const preventDefault = vi.fn();
  return {
    event: { code, repeat, preventDefault } as unknown as KeyboardEvent,
    preventDefault,
  };
}

function createHarness(): {
  target: FakeEventTarget;
  adapter: KeyboardInputAdapter;
} {
  const target = new FakeEventTarget();
  return {
    target,
    adapter: new KeyboardInputAdapter(target as unknown as EventTarget),
  };
}

describe('KeyboardInputAdapter', () => {
  it('maps A/D and arrow keys to lateral movement', () => {
    const { target, adapter } = createHarness();

    target.emit('keydown', keyEvent('KeyA').event);
    expect(adapter.getNormalizedLateralDelta()).toBe(-1);
    adapter.resetDelta();
    expect(adapter.getNormalizedLateralDelta()).toBe(-1);

    target.emit('keydown', keyEvent('KeyD').event);
    expect(adapter.getNormalizedLateralDelta()).toBe(0);

    target.emit('keyup', keyEvent('KeyA').event);
    expect(adapter.getNormalizedLateralDelta()).toBe(1);

    target.emit('keyup', keyEvent('KeyD').event);
    expect(adapter.getNormalizedLateralDelta()).toBe(0);
  });

  it('supports arrow keys', () => {
    const { target, adapter } = createHarness();

    target.emit('keydown', keyEvent('ArrowLeft').event);
    expect(adapter.getNormalizedLateralDelta()).toBe(-1);
    target.emit('keyup', keyEvent('ArrowLeft').event);

    target.emit('keydown', keyEvent('ArrowRight').event);
    expect(adapter.getNormalizedLateralDelta()).toBe(1);
  });

  it('exposes a one-shot action trigger and ignores key repeat', () => {
    const { target, adapter } = createHarness();
    target.emit('keydown', keyEvent('Space', true).event);
    expect(adapter.isActionTriggered()).toBe(false);

    target.emit('keydown', keyEvent('Space').event);
    expect(adapter.isActionTriggered()).toBe(true);
    expect(adapter.isActionTriggered()).toBe(false);

    target.emit('keydown', keyEvent('Enter').event);
    expect(adapter.isActionTriggered()).toBe(true);
  });

  it('prevents default only for handled keys', () => {
    const { target } = createHarness();
    const handled = keyEvent('KeyA');
    const unhandled = keyEvent('KeyZ');

    target.emit('keydown', handled.event);
    target.emit('keydown', unhandled.event);

    expect(handled.preventDefault).toHaveBeenCalledTimes(1);
    expect(unhandled.preventDefault).not.toHaveBeenCalled();
  });

  it('clears held keys on blur', () => {
    const { target, adapter } = createHarness();
    target.emit('keydown', keyEvent('KeyD').event);

    target.emit('blur', {});

    expect(adapter.getNormalizedLateralDelta()).toBe(0);
  });

  it('removes listeners and resets state on dispose', () => {
    const { target, adapter } = createHarness();
    target.emit('keydown', keyEvent('KeyA').event);

    adapter.dispose();

    expect(adapter.getNormalizedLateralDelta()).toBe(0);
    expect(target.listenerCount('keydown')).toBe(0);
    expect(target.listenerCount('keyup')).toBe(0);
    expect(target.listenerCount('blur')).toBe(0);
  });
});
