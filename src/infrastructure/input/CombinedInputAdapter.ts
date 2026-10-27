import type { InputPort } from '../../application/ports/driven/InputPort';

const MAX_DELTA = 1;

export class CombinedInputAdapter implements InputPort {
  public constructor(
    private readonly touch: InputPort,
    private readonly keyboard: InputPort,
  ) {}

  public getNormalizedLateralDelta(): number {
    const combined = this.touch.getNormalizedLateralDelta() + this.keyboard.getNormalizedLateralDelta();
    return Math.min(MAX_DELTA, Math.max(-MAX_DELTA, combined));
  }

  public resetDelta(): void {
    this.touch.resetDelta();
    this.keyboard.resetDelta();
  }

  public isActionTriggered(): boolean {
    const touchAction = this.touch.isActionTriggered();
    const keyboardAction = this.keyboard.isActionTriggered();
    return touchAction || keyboardAction;
  }
}
