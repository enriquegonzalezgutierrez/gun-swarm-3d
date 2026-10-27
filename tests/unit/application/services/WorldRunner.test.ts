import { describe, expect, it } from 'vitest';
import { Damage } from '@domain/value-objects/Damage';
import { Position3D } from '@domain/value-objects/Position3D';
import { Trooper } from '@domain/entities/Trooper';
import { createWorldRunnerHarness } from '../../../fixtures/WorldRunnerHarness';

describe('WorldRunner', () => {
  it('advances the leader and keeps the camera locked to it', () => {
    const { runner, squad, stage, render } = createWorldRunnerHarness();

    runner.update(0.1, true);

    expect(stage.distanceTravelled).toBeCloseTo(1.4);
    expect(squad.leaderPosition.z).toBeCloseTo(1.4);
    expect(render.updateCameraTarget).toHaveBeenLastCalledWith(squad.leaderPosition);

    squad.moveLeaderTo(new Position3D(2, 0, 1.4));
    runner.update(0.1, false);

    expect(render.updateCameraTarget).toHaveBeenLastCalledWith(squad.leaderPosition);
    expect(stage.distanceTravelled).toBeCloseTo(1.4);
  });

  it('removes destroyed obstacles and tracks the kill count', () => {
    const { runner, content, contentView } = createWorldRunnerHarness();
    const first = [...content.obstacles.values()][0];
    if (first === undefined) {
      throw new Error('Expected at least one obstacle.');
    }
    first.applyDamage(new Damage(first.health.current));

    runner.update(0.1, true);

    expect(content.obstacles.has(first.id)).toBe(false);
    expect(runner.destroyedObstacles).toBe(1);
    expect(contentView.retain).toHaveBeenCalled();
  });

  it('keeps troopers in formation behind the leader', () => {
    const { runner, squad } = createWorldRunnerHarness();
    squad.addTrooper(new Trooper('trooper-1', Position3D.zero()));
    squad.addTrooper(new Trooper('trooper-2', new Position3D(1, 0, 0)));

    for (let frame = 0; frame < 20; frame += 1) {
      runner.update(0.1, true);
    }

    const leader = squad.leaderPosition;
    for (const trooper of squad.activeTroopers) {
      expect(trooper.position.z).toBeGreaterThan(5);
      expect(trooper.position.z).toBeLessThan(leader.z);
      expect(Math.abs(trooper.position.x - leader.x)).toBeLessThan(4.5);
    }
  });

  it('moves the boss during the arena phase', () => {
    const { runner, content, contentView } = createWorldRunnerHarness();
    const initialZ = content.boss.position.z;

    runner.approachBoss(1);

    expect(content.boss.position.z).toBe(initialZ - 2);
    expect(contentView.syncBoss).toHaveBeenCalledWith(content.boss);
  });

  it('disposes combat, squad visuals and content visuals', () => {
    const { runner, processCombat, squadPresenter, contentView } =
      createWorldRunnerHarness();

    runner.dispose();

    expect(processCombat.dispose).toHaveBeenCalledTimes(1);
    expect(squadPresenter.dispose).toHaveBeenCalledTimes(1);
    expect(contentView.dispose).toHaveBeenCalledTimes(1);
  });
});
