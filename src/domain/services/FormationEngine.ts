import { Position3D } from '../value-objects/Position3D';

const GOLDEN_ANGLE = 2.399963;
const DEFAULT_SPACING = 0.65;

export class FormationEngine {
  public calculateOffsets(
    trooperCount: number,
    spacing = DEFAULT_SPACING,
  ): Position3D[] {
    FormationEngine.assertTrooperCount(trooperCount);
    if (!Number.isFinite(spacing) || spacing <= 0) {
      throw new RangeError('Formation spacing must be a positive finite number.');
    }
    const offsets: Position3D[] = [];
    for (let index = 1; index <= trooperCount; index += 1) {
      const radius = spacing * Math.sqrt(index);
      offsets.push(
        new Position3D(
          radius * Math.cos(index * GOLDEN_ANGLE),
          0,
          -radius * Math.sin(index * GOLDEN_ANGLE),
        ),
      );
    }
    return offsets;
  }

  public calculateWorldPositions(
    leaderPosition: Position3D,
    trooperCount: number,
    spacing = DEFAULT_SPACING,
  ): Position3D[] {
    return this.calculateOffsets(trooperCount, spacing).map((offset) =>
      leaderPosition.add(offset),
    );
  }

  private static assertTrooperCount(trooperCount: number): void {
    if (!Number.isInteger(trooperCount) || trooperCount < 0) {
      throw new RangeError('Trooper count must be a non-negative integer.');
    }
  }
}
