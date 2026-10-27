import { describe, expect, it, vi } from 'vitest';
import { TickGameLoopUseCase } from '@application/use-cases/TickGameLoopUseCase';
import type { GameSystem } from '@application/ports/driving/GameSystem';
import { FakePhysicsPort } from '../../../fixtures/FakePhysicsPort';
import { FakeRenderPort } from '../../../fixtures/FakeRenderPort';

function createHarness(): {
  useCase: TickGameLoopUseCase;
  first: GameSystem & { update: ReturnType<typeof vi.fn> };
  second: GameSystem & { update: ReturnType<typeof vi.fn> };
  physics: FakePhysicsPort;
  render: FakeRenderPort;
} {
  const first = { update: vi.fn((_deltaTimeSeconds: number): void => undefined) };
  const second = { update: vi.fn((_deltaTimeSeconds: number): void => undefined) };
  const physics = new FakePhysicsPort();
  const render = new FakeRenderPort();
  return {
    useCase: new TickGameLoopUseCase([first, second], physics, render),
    first,
    second,
    physics,
    render,
  };
}

describe('TickGameLoopUseCase', () => {
  it('orchestrates physics, systems and rendering on the first frame', () => {
    const { useCase, first, second, physics, render } = createHarness();

    useCase.execute(1000);

    expect(physics.step).toHaveBeenCalledWith(0);
    expect(first.update).toHaveBeenCalledWith(0);
    expect(second.update).toHaveBeenCalledWith(0);
    expect(render.render).toHaveBeenCalledTimes(1);
  });

  it('computes delta time from consecutive timestamps', () => {
    const { useCase, first, physics } = createHarness();

    useCase.execute(1000);
    useCase.execute(1016);

    expect(physics.step).toHaveBeenLastCalledWith(0.016);
    expect(first.update).toHaveBeenLastCalledWith(0.016);
  });

  it('clamps long frames to the maximum delta', () => {
    const { useCase, first, physics } = createHarness();

    useCase.execute(1000);
    useCase.execute(5000);

    expect(physics.step).toHaveBeenLastCalledWith(0.1);
    expect(first.update).toHaveBeenLastCalledWith(0.1);
  });

  it('uses a zero delta for backwards timestamps', () => {
    const { useCase, first } = createHarness();

    useCase.execute(2000);
    useCase.execute(1000);

    expect(first.update).toHaveBeenLastCalledWith(0);
  });

  it('restarts the timestamp baseline on reset', () => {
    const { useCase, first } = createHarness();

    useCase.execute(1000);
    useCase.execute(1100);
    useCase.reset();
    useCase.execute(9000);

    expect(first.update).toHaveBeenLastCalledWith(0);
  });

  it('updates systems in registration order', () => {
    const { useCase, first, second } = createHarness();
    const callOrder: string[] = [];
    first.update.mockImplementation((_deltaTimeSeconds: number): void => {
      callOrder.push('first');
    });
    second.update.mockImplementation((_deltaTimeSeconds: number): void => {
      callOrder.push('second');
    });

    useCase.execute(1000);

    expect(callOrder).toEqual(['first', 'second']);
  });

  it('rejects invalid timestamps without advancing the frame', () => {
    const { useCase, physics, render } = createHarness();

    expect(() => useCase.execute(-1)).toThrow(RangeError);
    expect(() => useCase.execute(Number.NaN)).toThrow(RangeError);
    expect(physics.step).not.toHaveBeenCalled();
    expect(render.render).not.toHaveBeenCalled();
  });
});
