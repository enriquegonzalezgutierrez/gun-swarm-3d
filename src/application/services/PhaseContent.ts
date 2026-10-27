import type { Boss } from '../../domain/entities/Boss';
import type { MathGate } from '../../domain/entities/MathGate';
import type { Obstacle } from '../../domain/entities/Obstacle';
import type { Pickup } from '../../domain/entities/Pickup';

export interface PhaseContent {
  readonly gates: readonly MathGate[];
  readonly obstacles: Map<string, Obstacle>;
  readonly pickups: Map<string, Pickup>;
  readonly boss: Boss;
}
