import { Boss } from '../entities/Boss';

const TRACK_HALF_WIDTH = 4.5;

export class StageAggregate {
  public readonly phaseNumber: number;
  public readonly trackLength: number;
  private travelledDistance = 0;
  private currentBoss: Boss | null;

  public constructor(
    phaseNumber: number,
    trackLength: number,
    boss: Boss | null = null,
  ) {
    if (!Number.isInteger(phaseNumber) || phaseNumber < 1 || phaseNumber > 5) {
      throw new RangeError('Stage phase number must be an integer between 1 and 5.');
    }
    if (!Number.isFinite(trackLength) || trackLength <= 0) {
      throw new RangeError('Stage track length must be a positive number.');
    }
    this.phaseNumber = phaseNumber;
    this.trackLength = trackLength;
    this.currentBoss = boss;
  }

  public get distanceTravelled(): number {
    return this.travelledDistance;
  }

  public get remainingDistance(): number {
    return Math.max(0, this.trackLength - this.travelledDistance);
  }

  public get progressRatio(): number {
    return this.travelledDistance / this.trackLength;
  }

  public get hasReachedBossArena(): boolean {
    return this.travelledDistance >= this.trackLength;
  }

  public get boss(): Boss | null {
    return this.currentBoss;
  }

  public get bossState(): 'NONE' | 'ALIVE' | 'DEFEATED' {
    if (this.currentBoss === null) {
      return 'NONE';
    }
    return this.currentBoss.isDefeated ? 'DEFEATED' : 'ALIVE';
  }

  public get isBossDefeated(): boolean {
    return this.currentBoss !== null && this.currentBoss.isDefeated;
  }

  public get minLateralX(): number {
    return -TRACK_HALF_WIDTH;
  }

  public get maxLateralX(): number {
    return TRACK_HALF_WIDTH;
  }

  public setBoss(boss: Boss): void {
    this.currentBoss = boss;
  }

  public advance(distance: number): number {
    if (!Number.isFinite(distance) || distance < 0) {
      throw new RangeError('Stage advance distance must be a non-negative number.');
    }
    const nextDistance = Math.min(this.trackLength, this.travelledDistance + distance);
    const appliedDistance = nextDistance - this.travelledDistance;
    this.travelledDistance = nextDistance;
    return appliedDistance;
  }

  public clampLateral(x: number): number {
    if (!Number.isFinite(x)) {
      throw new RangeError('Stage lateral coordinate must be a finite number.');
    }
    return Math.min(TRACK_HALF_WIDTH, Math.max(-TRACK_HALF_WIDTH, x));
  }
}
