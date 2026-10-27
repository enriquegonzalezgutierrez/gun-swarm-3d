import { vi } from 'vitest';
import { GameSession } from '@application/services/GameSession';
import type { GameSessionOptions } from '@application/services/GameSessionOptions';
import { PhaseContentFactory } from '@application/services/PhaseContentFactory';
import type { WorldRunner } from '@application/services/WorldRunner';
import type { GameViewPort } from '@application/ports/driven/GameViewPort';
import type { PhaseConfig } from '@application/dtos/PhaseConfig';
import { SquadAggregate } from '@domain/aggregates/SquadAggregate';
import { StageAggregate } from '@domain/aggregates/StageAggregate';
import { Trooper } from '@domain/entities/Trooper';
import { Position3D } from '@domain/value-objects/Position3D';
import { WeaponTier } from '@domain/value-objects/WeaponTier';

export const SESSION_TEST_CONFIG: PhaseConfig = {
  phaseNumber: 1,
  name: 'Test Phase',
  biomeId: 1,
  trackLength: 10,
  startingWeaponTier: WeaponTier.ServicePistol,
  bossName: 'Test Boss',
  bossMaxHealth: 20,
  nextPhase: 2,
};

export interface GameSessionHarness {
  readonly session: GameSession;
  readonly squad: SquadAggregate;
  readonly stage: StageAggregate;
  readonly content: ReturnType<PhaseContentFactory['create']>;
  readonly view: GameViewPort;
  readonly world: {
    readonly update: ReturnType<typeof vi.fn>;
    readonly approachBoss: ReturnType<typeof vi.fn>;
    readonly dispose: ReturnType<typeof vi.fn>;
    readonly collectedGold: number;
    readonly shieldSeconds: number;
    readonly destroyedObstacles: number;
  };
  readonly onVictory: ReturnType<typeof vi.fn>;
  readonly onDefeat: ReturnType<typeof vi.fn>;
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

export function createGameSessionHarness(): GameSessionHarness {
  const squad = new SquadAggregate(
    'squad-1',
    new Trooper('leader-1', Position3D.zero()),
  );
  const content = new PhaseContentFactory().create(SESSION_TEST_CONFIG);
  const stage = new StageAggregate(1, SESSION_TEST_CONFIG.trackLength, content.boss);
  const view = createView();
  const world = {
    update: vi.fn(),
    approachBoss: vi.fn(),
    dispose: vi.fn(),
    collectedGold: 12,
    shieldSeconds: 0,
    destroyedObstacles: 3,
  };
  const onVictory = vi.fn();
  const onDefeat = vi.fn();
  const options: GameSessionOptions = {
    config: SESSION_TEST_CONFIG,
    squad,
    stage,
    content,
    world: world as unknown as WorldRunner,
    view,
    onVictory,
    onDefeat,
  };
  return {
    session: new GameSession(options),
    squad,
    stage,
    content,
    view,
    world,
    onVictory,
    onDefeat,
  };
}
