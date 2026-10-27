import type { InputPort } from '../../application/ports/driven/InputPort';

const LEFT_KEYS: ReadonlySet<string> = new Set(['ArrowLeft', 'KeyA']);
const RIGHT_KEYS: ReadonlySet<string> = new Set(['ArrowRight', 'KeyD']);
const ACTION_KEYS: ReadonlySet<string> = new Set(['Space', 'Enter']);

export class KeyboardInputAdapter implements InputPort {
  private leftPressed = false;
  private rightPressed = false;
  private actionTriggered = false;

  public constructor(private readonly target: EventTarget = window) {
    this.target.addEventListener('keydown', this.onKeyDown);
    this.target.addEventListener('keyup', this.onKeyUp);
    this.target.addEventListener('blur', this.onBlur);
  }

  public getNormalizedLateralDelta(): number {
    return (this.rightPressed ? 1 : 0) - (this.leftPressed ? 1 : 0);
  }

  public resetDelta(): void {
    /* Keyboard movement is derived from held keys, not accumulated deltas. */
  }

  public isActionTriggered(): boolean {
    const triggered = this.actionTriggered;
    this.actionTriggered = false;
    return triggered;
  }

  public dispose(): void {
    this.target.removeEventListener('keydown', this.onKeyDown);
    this.target.removeEventListener('keyup', this.onKeyUp);
    this.target.removeEventListener('blur', this.onBlur);
    this.onBlur();
  }

  private readonly onKeyDown = (event: Event): void => {
    const keyboardEvent = event as KeyboardEvent;
    const { code } = keyboardEvent;
    if (LEFT_KEYS.has(code)) {
      this.leftPressed = true;
    } else if (RIGHT_KEYS.has(code)) {
      this.rightPressed = true;
    } else if (ACTION_KEYS.has(code)) {
      if (!keyboardEvent.repeat) {
        this.actionTriggered = true;
      }
    } else {
      return;
    }
    keyboardEvent.preventDefault();
  };

  private readonly onKeyUp = (event: Event): void => {
    const keyboardEvent = event as KeyboardEvent;
    const { code } = keyboardEvent;
    if (LEFT_KEYS.has(code)) {
      this.leftPressed = false;
    } else if (RIGHT_KEYS.has(code)) {
      this.rightPressed = false;
    } else if (!ACTION_KEYS.has(code)) {
      return;
    }
    keyboardEvent.preventDefault();
  };

  private readonly onBlur = (): void => {
    this.leftPressed = false;
    this.rightPressed = false;
    this.actionTriggered = false;
  };
}
