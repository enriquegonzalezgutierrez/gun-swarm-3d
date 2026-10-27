import type { AudioPort } from '../../application/ports/driven/AudioPort';
import { SoundSynthesizers } from './SoundSynthesizers';

export class WebAudioAdapter implements AudioPort {
  private context: AudioContext | null = null;
  private synthesizers: SoundSynthesizers | null = null;

  public constructor(
    private readonly contextFactory: () => AudioContext = () => new AudioContext(),
  ) {}

  public get isInitialized(): boolean {
    return this.synthesizers !== null;
  }

  public async initContext(): Promise<void> {
    if (this.context === null || this.context.state === 'closed') {
      try {
        this.context = this.contextFactory();
      } catch {
        this.context = null;
        this.synthesizers = null;
        return;
      }
      this.synthesizers = new SoundSynthesizers(this.context);
    }
    if (this.context.state === 'suspended') {
      try {
        await this.context.resume();
      } catch {
        return;
      }
    }
  }

  public playPistolShot(): void {
    this.synthesizers?.playPistolShot();
  }

  public playSMGShot(): void {
    this.synthesizers?.playSMGShot();
  }

  public playShotgunBlast(): void {
    this.synthesizers?.playShotgunBlast();
  }

  public playAssaultLaser(): void {
    this.synthesizers?.playAssaultLaser();
  }

  public playRocketExplosion(): void {
    this.synthesizers?.playRocketExplosion();
  }

  public playRecruitChime(): void {
    this.synthesizers?.playRecruitChime();
  }

  public playGateWhoosh(): void {
    this.synthesizers?.playGateWhoosh();
  }

  public playCoinPickup(): void {
    this.synthesizers?.playCoinPickup();
  }

  public playPlayerDeath(): void {
    this.synthesizers?.playPlayerDeath();
  }

  public playBossDefeat(): void {
    this.synthesizers?.playBossDefeat();
  }
}
