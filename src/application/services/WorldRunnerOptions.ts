import type { SquadAggregate } from '../../domain/aggregates/SquadAggregate';
import type { StageAggregate } from '../../domain/aggregates/StageAggregate';
import type { RenderPort } from '../ports/driven/RenderPort';
import type { MoveSquadUseCase } from '../use-cases/MoveSquadUseCase';
import type { ProcessCombatUseCase } from '../use-cases/ProcessCombatUseCase';
import type { ResolveCollisionsUseCase } from '../use-cases/ResolveCollisionsUseCase';
import type { PhaseContent } from './PhaseContent';
import type { PhaseContentView } from './PhaseContentView';
import type { SquadPresenter } from './SquadPresenter';

export interface WorldRunnerOptions {
  readonly squad: SquadAggregate;
  readonly stage: StageAggregate;
  readonly content: PhaseContent;
  readonly render: RenderPort;
  readonly moveSquad: MoveSquadUseCase;
  readonly processCombat: ProcessCombatUseCase;
  readonly resolveCollisions: ResolveCollisionsUseCase;
  readonly squadPresenter: SquadPresenter;
  readonly contentView: PhaseContentView;
}
