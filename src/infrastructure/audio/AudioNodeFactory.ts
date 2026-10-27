export class AudioNodeFactory {
  public static createEnvelope(
    context: AudioContext,
    volume: number,
    startTime: number,
    durationSeconds: number,
  ): GainNode {
    const gain = context.createGain();
    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + durationSeconds);
    gain.connect(context.destination);
    return gain;
  }

  public static createFilter(
    context: AudioContext,
    type: BiquadFilterType,
    frequency: number,
    q: number,
    startTime: number,
  ): BiquadFilterNode {
    const filter = context.createBiquadFilter();
    filter.type = type;
    filter.frequency.setValueAtTime(frequency, startTime);
    filter.Q.setValueAtTime(q, startTime);
    return filter;
  }
}
