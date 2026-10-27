import { describe, expect, it, vi } from 'vitest';
import { WebAudioAdapter } from '@infrastructure/audio/WebAudioAdapter';
import { createFakeAudioContext } from '../../../fixtures/audio/FakeAudioContext';

describe('WebAudioAdapter lifecycle', () => {
  it('does not synthesize before initialization', () => {
    const fake = createFakeAudioContext();
    const adapter = new WebAudioAdapter(() => fake.context);

    adapter.playPistolShot();

    expect(adapter.isInitialized).toBe(false);
    expect(fake.oscillators).toHaveLength(0);
  });

  it('creates the context and resumes it when suspended', async () => {
    const fake = createFakeAudioContext();
    fake.stateRef.state = 'suspended';
    const factory = vi.fn(() => fake.context);
    const adapter = new WebAudioAdapter(factory);

    await adapter.initContext();

    expect(adapter.isInitialized).toBe(true);
    expect(factory).toHaveBeenCalledTimes(1);
    expect(fake.resume).toHaveBeenCalledTimes(1);

    await adapter.initContext();

    expect(factory).toHaveBeenCalledTimes(1);
    expect(fake.resume).toHaveBeenCalledTimes(1);
  });

  it('recreates a closed context', async () => {
    const first = createFakeAudioContext();
    const second = createFakeAudioContext();
    const factory = vi
      .fn<() => AudioContext>()
      .mockReturnValueOnce(first.context)
      .mockReturnValueOnce(second.context);
    const adapter = new WebAudioAdapter(factory);

    await adapter.initContext();
    first.stateRef.state = 'closed';
    await adapter.initContext();

    expect(factory).toHaveBeenCalledTimes(2);
    expect(adapter.isInitialized).toBe(true);
  });

  it('stays silent when audio is unavailable', async () => {
    const adapter = new WebAudioAdapter((): AudioContext => {
      throw new Error('AudioContext unavailable');
    });

    await expect(adapter.initContext()).resolves.toBeUndefined();

    expect(adapter.isInitialized).toBe(false);
    expect(() => adapter.playRocketExplosion()).not.toThrow();
  });

  it('keeps the context usable when resume is rejected', async () => {
    const fake = createFakeAudioContext();
    fake.stateRef.state = 'suspended';
    fake.resume.mockRejectedValueOnce(new Error('Audio blocked'));
    const adapter = new WebAudioAdapter(() => fake.context);

    await expect(adapter.initContext()).resolves.toBeUndefined();

    expect(adapter.isInitialized).toBe(true);
  });

  it('delegates every sound effect to the synthesizers', async () => {
    const fake = createFakeAudioContext();
    const adapter = new WebAudioAdapter(() => fake.context);
    await adapter.initContext();

    adapter.playPistolShot();
    adapter.playSMGShot();
    adapter.playShotgunBlast();
    adapter.playAssaultLaser();
    adapter.playRocketExplosion();
    adapter.playRecruitChime();
    adapter.playGateWhoosh();
    adapter.playCoinPickup();
    adapter.playPlayerDeath();
    adapter.playBossDefeat();

    expect(fake.oscillators.length).toBeGreaterThan(0);
    expect(fake.sources.length).toBeGreaterThan(0);
    expect(fake.waveShapers).toHaveLength(1);
  });
});
