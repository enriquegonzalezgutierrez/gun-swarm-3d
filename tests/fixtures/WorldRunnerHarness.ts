import { vi } from 'vitest';
import { WorldRunner } from '@application/services/WorldRunner';
import type { WorldRunnerOptions } from '@application/services/WorldRunnerOptions';
import { PhaseContentFactory } from '@application/services/PhaseContentFactory';
import type { PhaseContentView } from '@application/services/PhaseContentView';
import type { SquadPresenter } from '@application/services/SquadPresenter';
import type { PhaseConfig } from '@application/dtos/PhaseConfig';
import type { RenderPort } from '@application/ports/driven/RenderPort';
import type { MoveSquadUseCase } from '@application/use-cases/MoveSquadUseCase';
import type { ProcessCombatUseCase } from '@application/use-cases/ProcessCombatUseCase';
import type { ResolveCollisionsUseCase } from '@application/use-cases/ResolveCollisionsUseCase';
import { SquadAggregate } from '@domain/aggregates/SquadAggregate';
import { StageAggregate } from '@domain/aggregates/StageAggregate';
import { Trooper } from '@domain/entities/Trooper';
import { Position3D } from '@domain/value-objects/Position3D';
import { WeaponTier } from '@domain/value-objects/WeaponTier';

export const WORLD_RUNNER_CONFIG: PhaseConfig = {
  phaseNumber: 1,
  name: 'Runner Test',
  biomeId: 1,
  trackLength: 120,
  startingWeaponTier: WeaponTier.ServicePistol,
  bossName: 'Test Boss',
  bossMaxHealth: 20,
  nextPhase: 2,
};

export interface WorldRunnerHarness {
  readonly runner: WorldRunner;
  readonly squad: SquadAggregate;
  readonly stage: StageAggregate;
  readonly content: ReturnType<PhaseContentFactory['create']>;
  readonly render: { updateCameraTarget: ReturnType<typeof vi.fn> };
  readonly processCombat: {
    execute: ReturnType<typeof vi.fn>;
    dispose: ReturnType<typeof vi.fn>;
  };
  readonly squadPresenter: {
    sync: ReturnType<typeof vi.fn>;
    dispose: ReturnType<typeof vi.fn>;
  };
  readonly contentView: {
    syncBoss: ReturnType<typeof vi.fn>;
    retain: ReturnType<typeof vi.fn>;
    dispose: ReturnType<typeof vi.fn>;
  };
}

export function createWorldRunnerHarness(): WorldRunnerHarness {
  const squad = new SquadAggregate(
    'squad-1',
    new Trooper('leader-1', Position3D.zero()),
  );
  const content = new PhaseContentFactory().create(WORLD_RUNNER_CONFIG);
  const stage = new StageAggregate(1, WORLD_RUNNER_CONFIG.trackLength, content.boss);
  const render = { updateCameraTarget: vi.fn() };
  const processCombat = { execute: vi.fn(), dispose: vi.fn() };
  const squadPresenter = { sync: vi.fn(), dispose: vi.fn() };
  const contentView = { syncBoss: vi.fn(), retain: vi.fn(), dispose: vi.fn() };
  const options: WorldRunnerOptions = {
    squad,
    stage,
    content,
    render: render as unknown as RenderPort,
    moveSquad: { execute: vi.fn() } as unknown as MoveSquadUseCase,
    processCombat: processCombat as unknown as ProcessCombatUseCase,
    resolveCollisions: {
      execute: vi.fn(),
      collectedGold: 0,
      shieldSeconds: 0,
    } as unknown as ResolveCollisionsUseCase,
    squadPresenter: squadPresenter as unknown as SquadPresenter,
    contentView: contentView as unknown as PhaseContentView,
  };
  return {
    runner: new WorldRunner(options),
    squad,
    stage,
    content,
    render,
    processCombat,
    squadPresenter,
    contentView,
  };
}
