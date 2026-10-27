import { AudioNodeFactory } from './AudioNodeFactory';
import { DistortionCurveFactory } from './DistortionCurveFactory';

export class DistortionSynthesizer {
  public constructor(private readonly context: AudioContext) {}

  public play(
    fromHz: number,
    toHz: number,
    durationSeconds: number,
    volume: number,
  ): void {
    const startTime = this.context.currentTime;
    const oscillator = this.context.createOscillator();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(fromHz, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      Math.max(0.001, toHz),
      startTime + durationSeconds,
    );
    const shaper = this.context.createWaveShaper();
    shaper.curve = DistortionCurveFactory.create(50);
    shaper.oversample = '2x';
    const gain = AudioNodeFactory.createEnvelope(
      this.context,
      volume,
      startTime,
      durationSeconds,
    );
    oscillator.connect(shaper);
    shaper.connect(gain);
    oscillator.start(startTime);
    oscillator.stop(startTime + durationSeconds);
  }
}
