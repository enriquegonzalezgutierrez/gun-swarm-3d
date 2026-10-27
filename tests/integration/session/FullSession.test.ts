import { describe, expect, it, vi } from 'vitest';
import type { GameViewPort } from '@application/ports/driven/GameViewPort';
import type { InputPort } from '@application/ports/driven/InputPort';
import { SessionState } from '@application/services/SessionState';
import { TickGameLoopUseCase } from '@application/use-cases/TickGameLoopUseCase';
import { PhaseCatalog } from '@infrastructure/levels/PhaseCatalog';
import { CannonPhysicsAdapter } from '@infrastructure/physics/CannonPhysicsAdapter';
import { RunSessionFactory } from '@infrastructure/RunSessionFactory';
import { ValidatingRenderPort } from '../../fixtures/ValidatingRenderPort';
import { createDefaultSave } from '../../fixtures/SaveGameFixture';

const BOSS_TYPES = [
  'Boss1_WarRig',
  'Boss2_DreadChopper',
  'Boss3_SpiderMech',
  'Boss4_FrostBehemoth',
  'Boss5_DreadNexus',
] as const;

class HeldLeftInput implements InputPort {
  public getNormalizedLateralDelta(): number {
    return -1;
  }

  public resetDelta(): void {
    /* Held keys are not consumed by resetDelta. */
  }

  public isActionTriggered(): boolean {
    return false;
  }
}

function createView(): GameViewPort {
  return {
    updateHud: vi.fn(),
    showCountdown: vi.fn(),
    showRunning: vi.fn(),
    showVictory: vi.fn(),
    showDefeat: vi.fn(),
    updateBossHealth: vi.fn(),
    hideBossHealth: vi.fn(),
  };
}

describe('Full session integration', () => {
  it.each([1, 2, 3, 4, 5])(
    'runs phase %i with movement, camera, auto-fire and valid meshes',
    (phaseNumber) => {
      const render = new ValidatingRenderPort();
      const physics = new CannonPhysicsAdapter();
      const input = new HeldLeftInput();
      const view = createView();
      const session = new RunSessionFactory(render, physics, input, view).create(
        PhaseCatalog.get(phaseNumber),
        createDefaultSave(),
        vi.fn(),
        vi.fn(),
      );

      session.start();
      session.update(3.1);
      expect(session.state).toBe(SessionState.Running);

      const loop = new TickGameLoopUseCase([session], physics, render);
      let timestamp = 1000;
      for (let frame = 0; frame < 30; frame += 1) {
        loop.execute(timestamp);
        timestamp += 1000 / 60;
      }

      expect(session.state).toBe(SessionState.Running);
      expect(session.leaderPosition.z).toBeGreaterThan(1);
      expect(session.leaderPosition.x).toBeLessThan(-0.5);
      expect(session.distanceTravelled).toBeGreaterThan(1);
      expect(render.renderedFrames).toBeGreaterThanOrEqual(30);
      expect(render.cameraTargets.length).toBeGreaterThanOrEqual(30);
      expect(render.cameraTargets.at(-1)).toBe(session.leaderPosition);
      expect(render.createdMeshes.some((mesh) => mesh.type === 'projectile')).toBe(true);
      expect(render.createdMeshes.some((mesh) => mesh.type === BOSS_TYPES[phaseNumber - 1])).toBe(
        true,
      );
      expect(view.updateHud).toHaveBeenCalled();

      session.dispose();
      expect(render.removedIds.length).toBeGreaterThan(0);
    },
  );
});
