export class DistortionCurveFactory {
  public static create(amount: number, sampleCount = 1024): Float32Array<ArrayBuffer> {
    if (!Number.isFinite(amount) || amount < 0) {
      throw new RangeError('Distortion amount must be a non-negative number.');
    }
    if (!Number.isInteger(sampleCount) || sampleCount < 2) {
      throw new RangeError('Distortion sample count must be an integer of at least 2.');
    }
    const curve = new Float32Array(sampleCount);
    for (let index = 0; index < sampleCount; index += 1) {
      const x = (index * 2) / sampleCount - 1;
      curve[index] =
        ((3 + amount) * x * (20 * Math.PI)) / 180 / (Math.PI + amount * Math.abs(x));
    }
    return curve;
  }
}
