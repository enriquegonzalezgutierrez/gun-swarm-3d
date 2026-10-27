import { describe, expect, it } from 'vitest';
import { SoundSynthesizers } from '@infrastructure/audio/SoundSynthesizers';
import { createFakeAudioContext } from '../../../fixtures/audio/FakeAudioContext';

describe('SoundSynthesizers — feedback and fanfares', () => {
  it('synthesizes the two-tone recruit chime', () => {
    const fake = createFakeAudioContext();
    const synthesizers = new SoundSynthesizers(fake.context);

    synthesizers.playRecruitChime();

    expect(fake.oscillators).toHaveLength(2);
    expect(fake.oscillators[0]?.frequency.setValueAtTime).toHaveBeenCalledWith(523.25, 1);
    expect(fake.oscillators[1]?.frequency.setValueAtTime).toHaveBeenCalledWith(659.25, 1.075);
  });

  it('sweeps the gate whoosh filter', () => {
    const fake = createFakeAudioContext();
    const synthesizers = new SoundSynthesizers(fake.context);

    synthesizers.playGateWhoosh();

    expect(fake.filters[0]?.frequency.setValueAtTime).toHaveBeenCalledWith(200, 1);
    expect(fake.filters[0]?.frequency.linearRampToValueAtTime).toHaveBeenCalledWith(
      1800,
      1.15,
    );
    expect(fake.filters[0]?.frequency.linearRampToValueAtTime).toHaveBeenCalledWith(300, 1.3);
  });

  it('synthesizes the coin pickup harmonics', () => {
    const fake = createFakeAudioContext();
    const synthesizers = new SoundSynthesizers(fake.context);

    synthesizers.playCoinPickup();

    expect(fake.oscillators).toHaveLength(2);
    expect(fake.oscillators[0]?.frequency.setValueAtTime).toHaveBeenCalledWith(1760, 1);
    expect(fake.oscillators[1]?.frequency.setValueAtTime).toHaveBeenCalledWith(2637, 1.04);
    expect(fake.oscillators[1]?.start).toHaveBeenCalledWith(1.04);
  });

  it('applies distortion to the player death tone', () => {
    const fake = createFakeAudioContext();
    const synthesizers = new SoundSynthesizers(fake.context);

    synthesizers.playPlayerDeath();

    expect(fake.oscillators[0]?.type).toBe('triangle');
    expect(fake.oscillators[0]?.frequency.setValueAtTime).toHaveBeenCalledWith(150, 1);
    expect(fake.oscillators[0]?.frequency.exponentialRampToValueAtTime).toHaveBeenCalledWith(
      40,
      1.35,
    );
    expect(fake.waveShapers[0]?.curve).toBeInstanceOf(Float32Array);
    expect(fake.waveShapers[0]?.curve?.length).toBe(1024);
    expect(fake.waveShapers[0]?.oversample).toBe('2x');
  });

  it('plays the four-note boss fanfare', () => {
    const fake = createFakeAudioContext();
    const synthesizers = new SoundSynthesizers(fake.context);

    synthesizers.playBossDefeat();

    expect(fake.oscillators).toHaveLength(4);
    expect(fake.filters).toHaveLength(4);
    expect(fake.oscillators[0]?.frequency.setValueAtTime).toHaveBeenCalledWith(
      261.63,
      expect.closeTo(1, 10),
    );
    expect(fake.oscillators[1]?.frequency.setValueAtTime).toHaveBeenCalledWith(
      329.63,
      expect.closeTo(1.12, 10),
    );
    expect(fake.oscillators[2]?.frequency.setValueAtTime).toHaveBeenCalledWith(
      392,
      expect.closeTo(1.24, 10),
    );
    expect(fake.oscillators[3]?.frequency.setValueAtTime).toHaveBeenCalledWith(
      523.25,
      expect.closeTo(1.36, 10),
    );
    expect(fake.filters[0]?.type).toBe('lowpass');
    expect(fake.filters[0]?.frequency.setValueAtTime).toHaveBeenCalledWith(1800, 1);
  });
});
