import type { InputPort } from '../../application/ports/driven/InputPort';

const MAX_NORMALIZED_DELTA = 1;

export class BrowserTouchInputAdapter implements InputPort {
  private pendingDelta = 0;
  private actionTriggered = false;
  private tracking = false;
  private lastX = 0;

  public constructor(private readonly target: HTMLElement) {
    this.target.addEventListener('touchstart', this.onTouchStart, { passive: false });
    this.target.addEventListener('touchmove', this.onTouchMove, { passive: false });
    this.target.addEventListener('touchend', this.onTouchEnd);
    this.target.addEventListener('touchcancel', this.onTouchEnd);
  }

  public getNormalizedLateralDelta(): number {
    return this.pendingDelta;
  }

  public resetDelta(): void {
    this.pendingDelta = 0;
  }

  public isActionTriggered(): boolean {
    const triggered = this.actionTriggered;
    this.actionTriggered = false;
    return triggered;
  }

  public dispose(): void {
    this.target.removeEventListener('touchstart', this.onTouchStart);
    this.target.removeEventListener('touchmove', this.onTouchMove);
    this.target.removeEventListener('touchend', this.onTouchEnd);
    this.target.removeEventListener('touchcancel', this.onTouchEnd);
  }

  private readonly onTouchStart = (event: Event): void => {
    const touchEvent = event as TouchEvent;
    const touch = touchEvent.touches[0];
    if (touch === undefined) {
      return;
    }
    this.tracking = true;
    this.lastX = touch.clientX;
    this.actionTriggered = true;
    touchEvent.preventDefault();
  };

  private readonly onTouchMove = (event: Event): void => {
    const touchEvent = event as TouchEvent;
    const touch = touchEvent.touches[0];
    if (!this.tracking || touch === undefined) {
      return;
    }
    const width = this.target.clientWidth > 0 ? this.target.clientWidth : 1;
    const delta = (touch.clientX - this.lastX) / width;
    this.lastX = touch.clientX;
    this.pendingDelta = Math.min(
      MAX_NORMALIZED_DELTA,
      Math.max(-MAX_NORMALIZED_DELTA, this.pendingDelta + delta),
    );
    touchEvent.preventDefault();
  };

  private readonly onTouchEnd = (event: Event): void => {
    this.tracking = false;
    this.lastX = 0;
    (event as TouchEvent).preventDefault();
  };
}
