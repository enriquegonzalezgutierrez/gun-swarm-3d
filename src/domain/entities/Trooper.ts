import { Position3D } from '../value-objects/Position3D';
import { TrooperState } from './TrooperState';

export class Trooper {
  public readonly id: string;
  private currentPosition: Position3D;
  private currentState: TrooperState;

  public constructor(
    id: string,
    position: Position3D,
    state: TrooperState = TrooperState.Active,
  ) {
    if (id.trim().length === 0) {
      throw new RangeError('Trooper id must not be empty.');
    }
    this.id = id;
    this.currentPosition = position;
    this.currentState = state;
  }

  public get position(): Position3D {
    return this.currentPosition;
  }

  public get state(): TrooperState {
    return this.currentState;
  }

  public get isActive(): boolean {
    return this.currentState === TrooperState.Active;
  }

  public moveTo(position: Position3D): void {
    this.currentPosition = position;
  }

  public kill(): void {
    this.currentState = TrooperState.Dead;
  }

  public startHopping(): void {
    if (this.currentState === TrooperState.Active) {
      this.currentState = TrooperState.Hopping;
    }
  }

  public finishHopping(): void {
    if (this.currentState === TrooperState.Hopping) {
      this.currentState = TrooperState.Active;
    }
  }
}
