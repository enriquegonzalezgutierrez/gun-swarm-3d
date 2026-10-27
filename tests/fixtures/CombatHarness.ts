import { ProcessCombatUseCase } from '@application/use-cases/ProcessCombatUseCase';
import { SquadAggregate } from '@domain/aggregates/SquadAggregate';
import type { Damageable } from '@domain/entities/Damageable';
import { Trooper } from '@domain/entities/Trooper';
import { Position3D } from '@domain/value-objects/Position3D';
import { FakeDamageTarget } from './FakeDamageTarget';
import { FakePhysicsPort } from './FakePhysicsPort';
import { FakeRenderPort } from './FakeRenderPort';

export interface CombatHarness {
  readonly useCase: ProcessCombatUseCase;
  readonly physics: FakePhysicsPort;
  readonly render: FakeRenderPort;
  readonly squad: SquadAggregate;
  readonly target: FakeDamageTarget;
  readonly targets: Map<string, Damageable>;
}

export function createCombatHarness(): CombatHarness {
  const physics = new FakePhysicsPort();
  const render = new FakeRenderPort();
  const squad = new SquadAggregate(
    'squad-1',
    new Trooper('leader-1', Position3D.zero()),
  );
  const target = new FakeDamageTarget();
  return {
    useCase: new ProcessCombatUseCase(physics, render),
    physics,
    render,
    squad,
    target,
    targets: new Map<string, Damageable>([[target.id, target]]),
  };
}
