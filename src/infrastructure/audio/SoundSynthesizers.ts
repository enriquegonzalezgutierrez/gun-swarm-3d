import { AudioSynthesisKit } from './AudioSynthesisKit';
import { DistortionSynthesizer } from './DistortionSynthesizer';

export class SoundSynthesizers {
  private readonly kit: AudioSynthesisKit;
  private readonly distortion: DistortionSynthesizer;

  public constructor(context: AudioContext) {
    this.kit = new AudioSynthesisKit(context);
    this.distortion = new DistortionSynthesizer(context);
  }

  public playPistolShot(): void {
    this.kit.tone('square', 600, 150, 0.08, 0.22);
  }

  public playSMGShot(): void {
    this.kit.tone('triangle', 450, 200, 0.04, 0.08);
  }

  public playShotgunBlast(): void {
    const now = this.kit.now();
    this.kit.noise(now, 0.25, 0.3, 'lowpass', 1200, 0.8, false);
    this.kit.tone('sine', 120, 120, 0.25, 0.35, now);
  }

  public playAssaultLaser(): void {
    this.kit.tone('sawtooth', 1200, 400, 0.09, 0.16, this.kit.now(), 'highpass', 800);
  }

  public playRocketExplosion(): void {
    const now = this.kit.now();
    this.kit.noise(now, 0.8, 0.4, 'bandpass', 400, 8, true);
    this.kit.tone('sine', 60, 60, 0.8, 0.45, now);
  }

  public playRecruitChime(): void {
    const now = this.kit.now();
    this.kit.tone('sine', 523.25, 523.25, 0.075, 0.14, now);
    this.kit.tone('sine', 659.25, 659.25, 0.075, 0.14, now + 0.075);
  }

  public playGateWhoosh(): void {
    this.kit.sweptNoise(this.kit.now(), 0.3, 0.2, 200, 1800, 300);
  }

  public playCoinPickup(): void {
    const now = this.kit.now();
    this.kit.tone('sine', 1760, 1760, 0.04, 0.12, now);
    this.kit.tone('sine', 2637, 2637, 0.04, 0.12, now + 0.04);
  }

  public playPlayerDeath(): void {
    this.distortion.play(150, 40, 0.35, 0.3);
  }

  public playBossDefeat(): void {
    const now = this.kit.now();
    const notes = [261.63, 329.63, 392.0, 523.25];
    notes.forEach((frequency, index) => {
      this.kit.tone(
        'sawtooth',
        frequency,
        frequency,
        0.4,
        0.12,
        now + index * 0.12,
        'lowpass',
        1800,
      );
    });
  }
}
