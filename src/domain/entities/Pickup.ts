import { Position3D } from '../value-objects/Position3D';
import { PickupType } from './PickupType';

export class Pickup {
  public readonly id: string;
  public readonly type: PickupType;
  public readonly position: Position3D;
  public readonly value: number;
  private collected = false;

  public constructor(id: string, type: PickupType, position: Position3D, value = 1) {
    if (id.trim().length === 0) {
      throw new RangeError('Pickup id must not be empty.');
    }
    if (!Number.isFinite(value) || value < 0) {
      throw new RangeError('Pickup value must be a non-negative finite number.');
    }
    this.id = id;
    this.type = type;
    this.position = position;
    this.value = value;
  }

  public get isCollected(): boolean {
    return this.collected;
  }

  public collect(): number {
    if (this.collected) {
      throw new Error(`Pickup ${this.id} has already been collected.`);
    }
    this.collected = true;
    return this.value;
  }
}
