import type { GameStateDTO } from '../../application/dtos/GameStateDTO';
import type { RunStatsDTO } from '../../application/dtos/RunStatsDTO';
import type { RunSummaryDTO } from '../../application/dtos/RunSummaryDTO';
import type { UpgradeAttribute } from '../../application/dtos/UpgradeAttribute';
import type { UpgradeShopItem } from '../../application/dtos/UpgradeShopItem';
import type { GameViewPort } from '../../application/ports/driven/GameViewPort';
import { HudView } from './HudView';
import { OverlayView } from './OverlayView';
import { ShopView } from './ShopView';

export class UIOverlayController implements GameViewPort {
  private readonly hud: HudView;
  private readonly overlays: OverlayView;
  private readonly shop: ShopView;
  public onStart: () => void = () => undefined;
  public onRetry: () => void = () => undefined;
  public onNextPhase: () => void = () => undefined;
  public onOpenShop: () => void = () => undefined;
  public onUpgrade: (attribute: UpgradeAttribute) => void = () => undefined;
  public onCloseShop: () => void = () => undefined;

  public constructor(documentRef: Document = document) {
    this.hud = new HudView(documentRef);
    this.overlays = new OverlayView(documentRef);
    this.shop = new ShopView(documentRef);
    this.overlays.onStart = (): void => this.onStart();
    this.overlays.onRetry = (): void => this.onRetry();
    this.overlays.onNextPhase = (): void => this.onNextPhase();
    this.overlays.onShop = (): void => this.onOpenShop();
    this.shop.onUpgrade = (attribute): void => this.onUpgrade(attribute);
    this.shop.onClose = (): void => {
      this.shop.hide();
      this.onCloseShop();
    };
    this.showStart();
  }

  public updateHud(state: GameStateDTO): void {
    this.hud.update(state);
  }

  public showCountdown(value: number): void {
    this.overlays.showCountdown(value);
  }

  public showRunning(): void {
    this.overlays.showRunning();
    this.hud.show();
  }

  public showVictory(summary: RunSummaryDTO): void {
    this.hud.hide();
    this.overlays.showVictory(summary);
  }

  public showDefeat(stats: RunStatsDTO): void {
    this.hud.hide();
    this.overlays.showDefeat(stats);
  }

  public updateBossHealth(current: number, max: number): void {
    this.hud.updateBoss(current, max);
  }

  public hideBossHealth(): void {
    this.hud.hideBoss();
  }

  public setBossName(name: string): void {
    this.hud.setBossName(name);
  }

  public showStart(): void {
    this.hud.hide();
    this.shop.hide();
    this.overlays.showStart();
  }

  public showShop(items: readonly UpgradeShopItem[], gold: number): void {
    this.shop.show(items, gold);
  }

  public hideShop(): void {
    this.shop.hide();
  }
}
