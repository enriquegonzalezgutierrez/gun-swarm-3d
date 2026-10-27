import type { SquadAggregate } from '../../domain/aggregates/SquadAggregate';
import type { StageAggregate } from '../../domain/aggregates/StageAggregate';
import type { PhaseConfig } from '../dtos/PhaseConfig';
import type { RunStatsDTO } from '../dtos/RunStatsDTO';
import type { RunSummaryDTO } from '../dtos/RunSummaryDTO';
import type { GameViewPort } from '../ports/driven/GameViewPort';
import type { PhaseContent } from './PhaseContent';
import type { WorldRunner } from './WorldRunner';

export interface GameSessionOptions {
  readonly config: PhaseConfig;
  readonly squad: SquadAggregate;
  readonly stage: StageAggregate;
  readonly content: PhaseContent;
  readonly world: WorldRunner;
  readonly view: GameViewPort;
  readonly onVictory: (summary: RunSummaryDTO) => void;
  readonly onDefeat: (stats: RunStatsDTO) => void;
}
