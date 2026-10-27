import { describe, expect, it } from 'vitest';
import { SessionState } from '@application/services/SessionState';
import { Damage } from '@domain/value-objects/Damage';
import { Position3D } from '@domain/value-objects/Position3D';
import {
  createGameSessionHarness,
  SESSION_TEST_CONFIG,
} from '../../../fixtures/GameSessionHarness';

describe('GameSession', () => {
  it('runs the countdown before entering the run', () => {
    const { session, view } = createGameSessionHarness();

    expect(session.state).toBe(SessionState.Idle);
    session.start();
    expect(session.state).toBe(SessionState.Countdown);
    expect(view.showCountdown).toHaveBeenCalledWith(3);

    session.update(1);
    expect(view.showCountdown).toHaveBeenLastCalledWith(2);
    session.update(1);
    expect(view.showCountdown).toHaveBeenLastCalledWith(1);
    session.update(1.1);

    expect(session.state).toBe(SessionState.Running);
    expect(view.showRunning).toHaveBeenCalledTimes(1);
  });

  it('enters the boss state at the end of the track', () => {
    const { session, stage, view } = createGameSessionHarness();
    stage.advance(SESSION_TEST_CONFIG.trackLength);
    session.start();
    session.update(3.1);
    session.update(0.1);

    expect(session.state).toBe(SessionState.Boss);
    expect(view.updateBossHealth).toHaveBeenCalledWith(20, 20);
  });

  it('finishes in victory when the boss dies', () => {
    const { session, stage, content, view, onVictory } = createGameSessionHarness();
    stage.advance(SESSION_TEST_CONFIG.trackLength);
    content.boss.applyDamage(new Damage(20));
    session.start();
    session.update(3.1);
    session.update(0.1);
    session.update(0.1);

    expect(session.state).toBe(SessionState.Victory);
    expect(onVictory).toHaveBeenCalledTimes(1);
    expect(view.showVictory).toHaveBeenCalledTimes(1);
    expect(view.hideBossHealth).toHaveBeenCalled();
  });

  it('finishes in defeat when the boss reaches the squad', () => {
    const { session, stage, content, onDefeat, view } = createGameSessionHarness();
    stage.advance(SESSION_TEST_CONFIG.trackLength);
    content.boss.moveTo(new Position3D(0, 0, 1));
    session.start();
    session.update(3.1);
    session.update(0.1);
    session.update(0.1);

    expect(session.state).toBe(SessionState.Defeat);
    expect(onDefeat).toHaveBeenCalledTimes(1);
    expect(view.showDefeat).toHaveBeenCalledTimes(1);
  });

  it('finishes in defeat when the leader is eliminated', () => {
    const { session, squad } = createGameSessionHarness();
    squad.killLeader();
    session.start();
    session.update(3.1);
    session.update(0.1);

    expect(session.state).toBe(SessionState.Defeat);
  });

  it('rejects invalid delta times and disposes the world', () => {
    const { session, world } = createGameSessionHarness();

    expect(() => session.update(-1)).toThrow(RangeError);
    session.dispose();
    expect(world.dispose).toHaveBeenCalledTimes(1);
  });
});
