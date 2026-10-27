const INPUT_TRANSFER_RATIO = 0.35;
const SMOOTHING_FACTOR = 0.25;

export class LateralMovementEngine {
  public static computeNextX(
    currentX: number,
    inputDelta: number,
    minX: number,
    maxX: number,
  ): number {
    LateralMovementEngine.assertFinite(currentX, 'currentX');
    LateralMovementEngine.assertFinite(inputDelta, 'inputDelta');
    LateralMovementEngine.assertFinite(minX, 'minX');
    LateralMovementEngine.assertFinite(maxX, 'maxX');
    if (minX > maxX) {
      throw new RangeError('Lateral bounds must satisfy minX <= maxX.');
    }
    const targetX = Math.min(maxX, Math.max(minX, currentX + inputDelta * INPUT_TRANSFER_RATIO));
    const smoothedX = currentX + (targetX - currentX) * SMOOTHING_FACTOR;
    return Math.min(maxX, Math.max(minX, smoothedX));
  }

  private static assertFinite(value: number, label: string): void {
    if (!Number.isFinite(value)) {
      throw new RangeError(`LateralMovementEngine ${label} must be a finite number.`);
    }
  }
}
