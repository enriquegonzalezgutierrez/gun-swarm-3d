import { describe, expect, it, vi } from 'vitest';
import type { GameViewPort } from '@application/ports/driven/GameViewPort';
import type { InputPort } from '@application/ports/driven/InputPort';
import type { GameSessionOptions } from '@application/services/GameSessionOptions';
import { SessionState } from '@application/services/SessionState';
import { TickGameLoopUseCase } from '@application/use-cases/TickGameLoopUseCase';
import type { RunStatsDTO } from '@application/dtos/RunStatsDTO';
import type { RunSummaryDTO } from '@application/dtos/RunSummaryDTO';
import type { SaveGameDTO } from '@application/dtos/SaveGameDTO';
import { PhaseCatalog } from '@infrastructure/levels/PhaseCatalog';
import { CannonPhysicsAdapter } from '@infrastructure/physics/CannonPhysicsAdapter';
import { RunSessionFactory } from '@infrastructure/RunSessionFactory';
import { createDefaultSave } from '../../fixtures/SaveGameFixture';
import { ValidatingRenderPort } from '../../fixtures/ValidatingRenderPort';

const MAX_SIMULATED_FRAMES = 7_200;
const RUN_BOT = process.env.RUN_BOT === '1';

class HugLeftInput implements InputPort {
  public getNormalizedLateralDelta(): number {
    return -1;
  }

  public resetDelta(): void {
    /* Held input is not consumed. */
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

interface PhaseResult {
  readonly phase: number;
  readonly state: SessionState;
  readonly frames: number;
  readonly distance: number;
  readonly squadSize: number;
  readonly bossHealth: number | null;
  readonly summary?: RunSummaryDTO;
  readonly stats?: RunStatsDTO;
}

function playPhase(phaseNumber: number, save: SaveGameDTO): PhaseResult {
  const render = new ValidatingRenderPort();
  const physics = new CannonPhysicsAdapter();
  const view = createView();
  const factory = new RunSessionFactory(render, physics, new HugLeftInput(), view);
  let summary: RunSummaryDTO | undefined;
  let stats: RunStatsDTO | undefined;
  const session = factory.create(
    PhaseCatalog.get(phaseNumber),
    save,
    (result) => {
      summary = result;
    },
    (result) => {
      stats = result;
    },
  );
  const loop = new TickGameLoopUseCase([session], physics, render);
  session.start();
  let timestamp = 1000;
  let frames = 0;
  while (
    session.state !== SessionState.Victory &&
    session.state !== SessionState.Defeat &&
    frames < MAX_SIMULATED_FRAMES
  ) {
    loop.execute(timestamp);
    timestamp += 1000 / 60;
    frames += 1;
  }
  const options = (session as unknown as { options: GameSessionOptions }).options;
  const result: PhaseResult = {
    phase: phaseNumber,
    state: session.state,
    frames,
    distance: session.distanceTravelled,
    squadSize: session.squadSize,
    bossHealth: options.content.boss.health.current,
    ...(summary === undefined ? {} : { summary }),
    ...(stats === undefined ? {} : { stats }),
  };
  session.dispose();
  return result;
}

describe.skipIf(!RUN_BOT)('Automated full-game bot', () => {
  it(
    'plays all five phases to victory',
    () => {
      let save = createDefaultSave();
      const results: PhaseResult[] = [];

      for (let phase = 1; phase <= 5; phase += 1) {
        const result = playPhase(phase, save);
        results.push(result);
        if (result.summary === undefined) {
          break;
        }
        save = {
          ...save,
          currency: { gold: save.currency.gold + result.summary.finalGold },
          progression: {
            highestUnlockedPhase: Math.max(
              save.progression.highestUnlockedPhase,
              result.summary.nextPhase ?? result.phase,
            ),
            lastPlayedPhase: result.summary.nextPhase ?? result.phase,
          },
        };
      }

      console.info(JSON.stringify(results, null, 2));
      expect(results.map((result) => result.state)).toEqual([
        SessionState.Victory,
        SessionState.Victory,
        SessionState.Victory,
        SessionState.Victory,
        SessionState.Victory,
      ]);
    },
    120_000,
  );
});
