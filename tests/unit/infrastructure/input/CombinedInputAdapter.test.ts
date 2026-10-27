import { describe, expect, it, vi } from 'vitest';
import { CombinedInputAdapter } from '@infrastructure/input/CombinedInputAdapter';
import type { InputPort } from '@application/ports/driven/InputPort';

function createInput(delta: number, action: boolean): {
  port: InputPort;
  resetDelta: ReturnType<typeof vi.fn>;
  isActionTriggered: ReturnType<typeof vi.fn>;
} {
  const resetDelta = vi.fn();
  const isActionTriggered = vi.fn(() => action);
  return {
    port: {
      getNormalizedLateralDelta: (): number => delta,
      resetDelta,
      isActionTriggered,
    },
    resetDelta,
    isActionTriggered,
  };
}

describe('CombinedInputAdapter', () => {
  it('combines touch and keyboard deltas with a clamp', () => {
    const touch = createInput(0.4, false);
    const keyboard = createInput(0.8, false);
    const combined = new CombinedInputAdapter(touch.port, keyboard.port);

    expect(combined.getNormalizedLateralDelta()).toBe(1);
  });

  it('supports negative deltas and resets both sources', () => {
    const touch = createInput(-1, false);
    const keyboard = createInput(0, false);
    const combined = new CombinedInputAdapter(touch.port, keyboard.port);

    combined.resetDelta();

    expect(combined.getNormalizedLateralDelta()).toBe(-1);
    expect(touch.resetDelta).toHaveBeenCalledTimes(1);
    expect(keyboard.resetDelta).toHaveBeenCalledTimes(1);
  });

  it('merges one-shot actions from either source', () => {
    const touch = createInput(0, false);
    const keyboard = createInput(0, true);
    const combined = new CombinedInputAdapter(touch.port, keyboard.port);

    expect(combined.isActionTriggered()).toBe(true);
    expect(touch.isActionTriggered).toHaveBeenCalledTimes(1);
    expect(keyboard.isActionTriggered).toHaveBeenCalledTimes(1);
  });
});
