import { describe, expect, it } from 'vitest';
import { SoundSynthesizers } from '@infrastructure/audio/SoundSynthesizers';
import { createFakeAudioContext } from '../../../fixtures/audio/FakeAudioContext';

describe('SoundSynthesizers — weapons', () => {
  it('synthesizes the pistol frequency drop', () => {
    const fake = createFakeAudioContext();
    const synthesizers = new SoundSynthesizers(fake.context);

    synthesizers.playPistolShot();

    expect(fake.oscillators[0]?.type).toBe('square');
    expect(fake.oscillators[0]?.frequency.setValueAtTime).toHaveBeenCalledWith(600, 1);
    expect(fake.oscillators[0]?.frequency.exponentialRampToValueAtTime).toHaveBeenCalledWith(
      150,
      1.08,
    );
    expect(fake.oscillators[0]?.start).toHaveBeenCalledWith(1);
    expect(fake.oscillators[0]?.stop).toHaveBeenCalledWith(1.08);
  });

  it('synthesizes the SMG burst', () => {
    const fake = createFakeAudioContext();
    const synthesizers = new SoundSynthesizers(fake.context);

    synthesizers.playSMGShot();

    expect(fake.oscillators[0]?.type).toBe('triangle');
    expect(fake.oscillators[0]?.frequency.exponentialRampToValueAtTime).toHaveBeenCalledWith(
      200,
      1.04,
    );
  });

  it('layers filtered noise and a thump for the shotgun', () => {
    const fake = createFakeAudioContext();
    const synthesizers = new SoundSynthesizers(fake.context);

    synthesizers.playShotgunBlast();

    expect(fake.sources).toHaveLength(1);
    expect(fake.buffers[0]?.length).toBe(11025);
    expect(fake.filters[0]?.type).toBe('lowpass');
    expect(fake.filters[0]?.frequency.setValueAtTime).toHaveBeenCalledWith(1200, 1);
    expect(fake.oscillators[0]?.frequency.setValueAtTime).toHaveBeenCalledWith(120, 1);
  });

  it('synthesizes the assault laser with a high-pass filter', () => {
    const fake = createFakeAudioContext();
    const synthesizers = new SoundSynthesizers(fake.context);

    synthesizers.playAssaultLaser();

    expect(fake.oscillators[0]?.type).toBe('sawtooth');
    expect(fake.oscillators[0]?.frequency.exponentialRampToValueAtTime).toHaveBeenCalledWith(
      400,
      1.09,
    );
    expect(fake.filters[0]?.type).toBe('highpass');
    expect(fake.filters[0]?.frequency.setValueAtTime).toHaveBeenCalledWith(800, 1);
  });

  it('synthesizes the rocket as pink noise with sub-bass', () => {
    const fake = createFakeAudioContext();
    const synthesizers = new SoundSynthesizers(fake.context);

    synthesizers.playRocketExplosion();

    expect(fake.sources).toHaveLength(1);
    expect(fake.buffers[0]?.length).toBe(35280);
    expect(fake.filters[0]?.type).toBe('bandpass');
    expect(fake.filters[0]?.Q.setValueAtTime).toHaveBeenCalledWith(8, 1);
    expect(fake.oscillators[0]?.frequency.setValueAtTime).toHaveBeenCalledWith(60, 1);
  });
});
