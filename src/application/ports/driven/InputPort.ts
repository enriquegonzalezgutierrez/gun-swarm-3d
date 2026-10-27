export interface InputPort {
  getNormalizedLateralDelta(): number;
  resetDelta(): void;
  isActionTriggered(): boolean;
}
