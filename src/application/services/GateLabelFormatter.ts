import type { MathGate } from '../../domain/entities/MathGate';
import { GateOperation } from '../../domain/entities/GateOperation';

export class GateLabelFormatter {
  public static format(gate: MathGate): string {
    switch (gate.operation) {
      case GateOperation.Add:
        return `+${gate.value}`;
      case GateOperation.Subtract:
        return `-${gate.value}`;
      case GateOperation.Multiply:
        return `x${gate.value}`;
      case GateOperation.Divide:
        return `÷${gate.value}`;
      default:
        return String(gate.value);
    }
  }
}
