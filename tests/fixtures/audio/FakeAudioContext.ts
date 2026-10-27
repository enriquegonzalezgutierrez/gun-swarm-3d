import { vi } from 'vitest';
import {
  createFakeBuffer,
  createFakeFilter,
  createFakeGain,
  createFakeOscillator,
  createFakeShaper,
  createFakeSource,
  type FakeBuffer,
  type FakeFilter,
  type FakeGain,
  type FakeOscillator,
  type FakeShaper,
  type FakeSource,
} from './FakeAudioNodes';

export interface FakeAudioContextBundle {
  readonly context: AudioContext;
  readonly stateRef: { state: AudioContextState };
  readonly oscillators: FakeOscillator[];
  readonly gains: FakeGain[];
  readonly filters: FakeFilter[];
  readonly sources: FakeSource[];
  readonly waveShapers: FakeShaper[];
  readonly buffers: FakeBuffer[];
  readonly resume: ReturnType<typeof vi.fn>;
  readonly close: ReturnType<typeof vi.fn>;
}

export function createFakeAudioContext(): FakeAudioContextBundle {
  const stateRef: { state: AudioContextState } = { state: 'running' };
  const oscillators: FakeOscillator[] = [];
  const gains: FakeGain[] = [];
  const filters: FakeFilter[] = [];
  const sources: FakeSource[] = [];
  const waveShapers: FakeShaper[] = [];
  const buffers: FakeBuffer[] = [];

  const resume = vi.fn(async (): Promise<void> => {
    stateRef.state = 'running';
  });
  const close = vi.fn(async (): Promise<void> => {
    stateRef.state = 'closed';
  });

  const context = {
    get state(): AudioContextState {
      return stateRef.state;
    },
    currentTime: 1,
    sampleRate: 44100,
    destination: {} as AudioDestinationNode,
    createOscillator: vi.fn((): OscillatorNode => {
      const node = createFakeOscillator();
      oscillators.push(node);
      return node as unknown as OscillatorNode;
    }),
    createGain: vi.fn((): GainNode => {
      const node = createFakeGain();
      gains.push(node);
      return node as unknown as GainNode;
    }),
    createBiquadFilter: vi.fn((): BiquadFilterNode => {
      const node = createFakeFilter();
      filters.push(node);
      return node as unknown as BiquadFilterNode;
    }),
    createBufferSource: vi.fn((): AudioBufferSourceNode => {
      const node = createFakeSource();
      sources.push(node);
      return node as unknown as AudioBufferSourceNode;
    }),
    createWaveShaper: vi.fn((): WaveShaperNode => {
      const node = createFakeShaper();
      waveShapers.push(node);
      return node as unknown as WaveShaperNode;
    }),
    createBuffer: vi.fn(
      (_channels: number, length: number, _sampleRate: number): AudioBuffer => {
        const buffer = createFakeBuffer(length);
        buffers.push(buffer);
        return buffer as unknown as AudioBuffer;
      },
    ),
    resume,
    close,
  } as unknown as AudioContext;

  return {
    context,
    stateRef,
    oscillators,
    gains,
    filters,
    sources,
    waveShapers,
    buffers,
    resume,
    close,
  };
}
