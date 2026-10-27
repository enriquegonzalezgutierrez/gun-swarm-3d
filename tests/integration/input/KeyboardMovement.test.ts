import { describe, expect, it, vi } from 'vitest';
import { KeyboardInputAdapter } from '@infrastructure/input/KeyboardInputAdapter';
import { MoveSquadUseCase } from '@application/use-cases/MoveSquadUseCase';
import { SquadAggregate } from '@domain/aggregates/SquadAggregate';
import { StageAggregate } from '@domain/aggregates/StageAggregate';
import { Trooper } from '@domain/entities/Trooper';
import { Position3D } from '@domain/value-objects/Position3D';
import { FakeEventTarget } from '../../fixtures/FakeEventTarget';

function keyEvent(code: string): KeyboardEvent {
  return { code, repeat: false, preventDefault: vi.fn() } as unknown as KeyboardEvent;
}

describe('Keyboard movement integration', () => {
  it('moves the leader while an arrow key is held', () => {
    const target = new FakeEventTarget();
    const input = new KeyboardInputAdapter(target as unknown as EventTarget);
    const squad = new SquadAggregate(
      'squad-1',
      new Trooper('leader-1', Position3D.zero()),
    );
    const stage = new StageAggregate(1, 220);
    const moveSquad = new MoveSquadUseCase(input, squad, stage);

    target.emit('keydown', keyEvent('ArrowRight'));
    for (let frame = 0; frame < 60; frame += 1) {
      moveSquad.execute();
    }
    expect(squad.leaderPosition.x).toBeGreaterThan(4);

    target.emit('keyup', keyEvent('ArrowRight'));
    const stoppedX = squad.leaderPosition.x;
    moveSquad.execute();
    expect(squad.leaderPosition.x).toBe(stoppedX);
  });
});
