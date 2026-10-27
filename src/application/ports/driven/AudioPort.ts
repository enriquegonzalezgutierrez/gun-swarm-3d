export interface AudioPort {
  initContext(): Promise<void>;
  playPistolShot(): void;
  playSMGShot(): void;
  playShotgunBlast(): void;
  playAssaultLaser(): void;
  playRocketExplosion(): void;
  playRecruitChime(): void;
  playGateWhoosh(): void;
  playCoinPickup(): void;
  playPlayerDeath(): void;
  playBossDefeat(): void;
}
