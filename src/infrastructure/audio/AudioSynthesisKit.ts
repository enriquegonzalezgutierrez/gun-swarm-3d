import { AudioNodeFactory } from './AudioNodeFactory';
import { NoiseBufferFactory } from './NoiseBufferFactory';

export class AudioSynthesisKit {
  public constructor(private readonly context: AudioContext) {}

  public now(): number {
    return this.context.currentTime;
  }

  public tone(
    type: OscillatorType,
    fromHz: number,
    toHz: number,
    durationSeconds: number,
    volume: number,
    startTime: number = this.now(),
    filterType?: BiquadFilterType,
    filterFrequency?: number,
  ): void {
    const oscillator = this.context.createOscillator();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(fromHz, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      Math.max(0.001, toHz),
      startTime + durationSeconds,
    );
    const gain = AudioNodeFactory.createEnvelope(
      this.context,
      volume,
      startTime,
      durationSeconds,
    );
    if (filterType !== undefined && filterFrequency !== undefined) {
      const filter = AudioNodeFactory.createFilter(
        this.context,
        filterType,
        filterFrequency,
        1,
        startTime,
      );
      oscillator.connect(filter);
      filter.connect(gain);
    } else {
      oscillator.connect(gain);
    }
    oscillator.start(startTime);
    oscillator.stop(startTime + durationSeconds);
  }

  public noise(
    startTime: number,
    durationSeconds: number,
    volume: number,
    filterType: BiquadFilterType | null,
    filterFrequency: number,
    q: number,
    pink: boolean,
  ): void {
    const source = this.context.createBufferSource();
    source.buffer = NoiseBufferFactory.create(this.context, durationSeconds, pink);
    const gain = AudioNodeFactory.createEnvelope(
      this.context,
      volume,
      startTime,
      durationSeconds,
    );
    if (filterType !== null) {
      const filter = AudioNodeFactory.createFilter(
        this.context,
        filterType,
        filterFrequency,
        q,
        startTime,
      );
      source.connect(filter);
      filter.connect(gain);
    } else {
      source.connect(gain);
    }
    source.start(startTime);
    source.stop(startTime + durationSeconds);
  }

  public sweptNoise(
    startTime: number,
    durationSeconds: number,
    volume: number,
    fromHz: number,
    peakHz: number,
    toHz: number,
  ): void {
    const source = this.context.createBufferSource();
    source.buffer = NoiseBufferFactory.create(this.context, durationSeconds, false);
    const gain = AudioNodeFactory.createEnvelope(
      this.context,
      volume,
      startTime,
      durationSeconds,
    );
    const filter = AudioNodeFactory.createFilter(
      this.context,
      'bandpass',
      fromHz,
      1,
      startTime,
    );
    filter.frequency.linearRampToValueAtTime(peakHz, startTime + durationSeconds / 2);
    filter.frequency.linearRampToValueAtTime(toHz, startTime + durationSeconds);
    source.connect(filter);
    filter.connect(gain);
    source.start(startTime);
    source.stop(startTime + durationSeconds);
  }
}
