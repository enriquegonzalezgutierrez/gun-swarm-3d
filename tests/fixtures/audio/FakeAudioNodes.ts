import { vi } from 'vitest';

type Mock = ReturnType<typeof vi.fn>;

export type FakeAudioParam = {
  setValueAtTime: Mock;
  linearRampToValueAtTime: Mock;
  exponentialRampToValueAtTime: Mock;
};

export type FakeOscillator = {
  type: OscillatorType;
  frequency: FakeAudioParam;
  connect: Mock;
  start: Mock;
  stop: Mock;
};

export type FakeGain = {
  gain: FakeAudioParam;
  connect: Mock;
};

export type FakeFilter = {
  type: BiquadFilterType;
  frequency: FakeAudioParam;
  Q: FakeAudioParam;
  connect: Mock;
};

export type FakeSource = {
  buffer: AudioBuffer | null;
  connect: Mock;
  start: Mock;
  stop: Mock;
};

export type FakeShaper = {
  curve: Float32Array | null;
  oversample: OverSampleType;
  connect: Mock;
};

export type FakeBuffer = {
  readonly length: number;
  readonly getChannelData: (channel: number) => Float32Array;
};

export function createFakeAudioParam(): FakeAudioParam {
  return {
    setValueAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
  };
}

export function createFakeOscillator(): FakeOscillator {
  return {
    type: 'sine',
    frequency: createFakeAudioParam(),
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  };
}

export function createFakeGain(): FakeGain {
  return { gain: createFakeAudioParam(), connect: vi.fn() };
}

export function createFakeFilter(): FakeFilter {
  return {
    type: 'lowpass',
    frequency: createFakeAudioParam(),
    Q: createFakeAudioParam(),
    connect: vi.fn(),
  };
}

export function createFakeSource(): FakeSource {
  return {
    buffer: null,
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  };
}

export function createFakeShaper(): FakeShaper {
  return {
    curve: null,
    oversample: 'none',
    connect: vi.fn(),
  };
}

export function createFakeBuffer(length: number): FakeBuffer {
  const data = new Float32Array(length);
  return {
    length,
    getChannelData: (_channel: number): Float32Array => data,
  };
}
