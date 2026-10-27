export class NoiseBufferFactory {
  public static create(
    context: AudioContext,
    durationSeconds: number,
    pink: boolean,
  ): AudioBuffer {
    if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
      throw new RangeError('Noise duration must be a positive number.');
    }
    const sampleCount = Math.max(1, Math.floor(context.sampleRate * durationSeconds));
    const buffer = context.createBuffer(1, sampleCount, context.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0;
    let b1 = 0;
    let b2 = 0;
    let b3 = 0;
    let b4 = 0;
    let b5 = 0;
    let b6 = 0;
    for (let index = 0; index < sampleCount; index += 1) {
      const white = Math.random() * 2 - 1;
      if (!pink) {
        data[index] = white;
        continue;
      }
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      data[index] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
    return buffer;
  }
}
