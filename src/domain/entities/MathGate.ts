import { Position3D } from '../value-objects/Position3D';
import { GateLane } from './GateLane';
import { GateOperation } from './GateOperation';

export class MathGate {
  public readonly id: string;
  public readonly operation: GateOperation;
  public readonly value: number;
  public readonly lane: GateLane;
  public readonly position: Position3D;
  private active = true;

  public constructor(
    id: string,
    operation: GateOperation,
    value: number,
    lane: GateLane,
    position: Position3D,
  ) {
    if (id.trim().length === 0) {
      throw new RangeError('MathGate id must not be empty.');
    }
    if (!Number.isInteger(value) || value < 1) {
      throw new RangeError('MathGate value must be a positive integer.');
    }
    this.id = id;
    this.operation = operation;
    this.value = value;
    this.lane = lane;
    this.position = position;
  }

  public get isActive(): boolean {
    return this.active;
  }

  public get isPositive(): boolean {
    return (
      this.operation === GateOperation.Add || this.operation === GateOperation.Multiply
    );
  }

  public get isNegative(): boolean {
    return !this.isPositive;
  }

  public applyTo(squadSize: number): number {
    if (!Number.isInteger(squadSize) || squadSize < 0) {
      throw new RangeError('Squad size must be a non-negative integer.');
    }
    switch (this.operation) {
      case GateOperation.Add:
        return squadSize + this.value;
      case GateOperation.Subtract:
        return Math.max(0, squadSize - this.value);
      case GateOperation.Multiply:
        return squadSize * this.value;
      case GateOperation.Divide:
        return Math.floor(squadSize / this.value);
      default:
        throw new Error(`Unsupported gate operation: ${String(this.operation)}`);
    }
  }

  public consume(): void {
    this.active = false;
  }
}
