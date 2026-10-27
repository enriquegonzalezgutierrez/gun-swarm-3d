import type { GameStateDTO } from '../../application/dtos/GameStateDTO';
import { requireElement } from './requireElement';

export class HudView {
  private readonly root: HTMLElement;
  private readonly squad: HTMLElement;
  private readonly weapon: HTMLElement;
  private readonly gold: HTMLElement;
  private readonly distance: HTMLElement;
  private readonly bossBar: HTMLElement;
  private readonly bossFill: HTMLElement;
  private readonly bossName: HTMLElement;
  private readonly shield: HTMLElement;

  public constructor(documentRef: Document = document) {
    this.root = requireElement(documentRef, 'hud');
    this.squad = requireElement(documentRef, 'hud-squad');
    this.weapon = requireElement(documentRef, 'hud-weapon');
    this.gold = requireElement(documentRef, 'hud-gold');
    this.distance = requireElement(documentRef, 'hud-distance');
    this.bossBar = requireElement(documentRef, 'boss-bar');
    this.bossFill = requireElement(documentRef, 'boss-fill');
    this.bossName = requireElement(documentRef, 'boss-name');
    this.shield = requireElement(documentRef, 'hud-shield');
  }

  public show(): void {
    this.root.classList.remove('hidden');
  }

  public hide(): void {
    this.root.classList.add('hidden');
  }

  public update(state: GameStateDTO): void {
    this.squad.textContent = String(state.squadSize);
    this.weapon.textContent = `T${state.weaponTier}`;
    this.gold.textContent = String(state.gold);
    this.distance.style.width = `${Math.round(state.progressRatio * 100)}%`;
    if (state.shieldSeconds > 0) {
      this.shield.textContent = `Shield ${state.shieldSeconds.toFixed(1)}s`;
      this.shield.classList.remove('hidden');
    } else {
      this.shield.classList.add('hidden');
    }
  }

  public updateBoss(current: number, max: number): void {
    const ratio = max > 0 ? Math.max(0, Math.min(1, current / max)) : 0;
    this.bossFill.style.width = `${Math.round(ratio * 100)}%`;
    this.bossBar.classList.remove('hidden');
  }

  public setBossName(name: string): void {
    this.bossName.textContent = name;
  }

  public hideBoss(): void {
    this.bossBar.classList.add('hidden');
  }
}
