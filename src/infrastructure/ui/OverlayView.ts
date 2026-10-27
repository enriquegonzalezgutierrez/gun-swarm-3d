import type { RunStatsDTO } from '../../application/dtos/RunStatsDTO';
import type { RunSummaryDTO } from '../../application/dtos/RunSummaryDTO';
import { requireElement } from './requireElement';

export class OverlayView {
  private readonly startOverlay: HTMLElement;
  private readonly victoryOverlay: HTMLElement;
  private readonly defeatOverlay: HTMLElement;
  private readonly countdown: HTMLElement;
  private readonly startButton: HTMLElement;
  public onStart: () => void = () => undefined;
  public onRetry: () => void = () => undefined;
  public onNextPhase: () => void = () => undefined;
  public onShop: () => void = () => undefined;

  public constructor(private readonly documentRef: Document = document) {
    this.startOverlay = requireElement(documentRef, 'start-overlay');
    this.victoryOverlay = requireElement(documentRef, 'victory-overlay');
    this.defeatOverlay = requireElement(documentRef, 'defeat-overlay');
    this.countdown = requireElement(documentRef, 'countdown');
    this.startButton = requireElement(documentRef, 'start-button');
    requireElement(documentRef, 'start-button').addEventListener('click', () => this.onStart());
    requireElement(documentRef, 'start-shop-button').addEventListener('click', () => this.onShop());
    requireElement(documentRef, 'retry-button').addEventListener('click', () => this.onRetry());
    requireElement(documentRef, 'next-phase-button').addEventListener('click', () => this.onNextPhase());
    requireElement(documentRef, 'victory-shop-button').addEventListener('click', () => this.onShop());
    requireElement(documentRef, 'defeat-shop-button').addEventListener('click', () => this.onShop());
  }

  public showStart(): void {
    this.startOverlay.classList.remove('hidden');
    this.victoryOverlay.classList.add('hidden');
    this.defeatOverlay.classList.add('hidden');
    this.countdown.classList.add('hidden');
    this.startButton.classList.remove('hidden');
  }

  public showCountdown(value: number): void {
    this.startOverlay.classList.remove('hidden');
    this.countdown.textContent = String(value);
    this.countdown.classList.remove('hidden');
    this.startButton.classList.add('hidden');
  }

  public showRunning(): void {
    this.startOverlay.classList.add('hidden');
    this.countdown.classList.add('hidden');
  }

  public showVictory(summary: RunSummaryDTO): void {
    this.setText('victory-phase', `Phase ${summary.phaseNumber} cleared`);
    this.setText('victory-coins', String(summary.runCoins));
    this.setText('victory-survivors', String(summary.survivingTroopers));
    this.setText('victory-bonus', String(summary.finalGold - summary.runCoins));
    this.setText('victory-total', String(summary.finalGold));
    this.victoryOverlay.classList.remove('hidden');
  }

  public showDefeat(stats: RunStatsDTO): void {
    this.setText('defeat-distance', `${Math.round(stats.distanceTravelled)} m`);
    this.setText('defeat-destroyed', String(stats.destroyedObstacles));
    this.setText('defeat-coins', String(stats.goldCollected));
    this.setText('defeat-survivors', String(stats.survivingTroopers));
    this.defeatOverlay.classList.remove('hidden');
  }

  public hideVictory(): void {
    this.victoryOverlay.classList.add('hidden');
  }

  public hideDefeat(): void {
    this.defeatOverlay.classList.add('hidden');
  }

  private setText(id: string, value: string): void {
    requireElement(this.documentRef, id).textContent = value;
  }
}
