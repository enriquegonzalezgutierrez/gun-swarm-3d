import type { UpgradeAttribute } from '../../application/dtos/UpgradeAttribute';
import type { UpgradeShopItem } from '../../application/dtos/UpgradeShopItem';
import { requireElement } from './requireElement';

export class ShopView {
  private readonly overlay: HTMLElement;
  private readonly items: HTMLElement;
  private readonly gold: HTMLElement;
  public onUpgrade: (attribute: UpgradeAttribute) => void = () => undefined;
  public onClose: () => void = () => undefined;

  public constructor(private readonly documentRef: Document = document) {
    this.overlay = requireElement(documentRef, 'shop-overlay');
    this.items = requireElement(documentRef, 'shop-items');
    this.gold = requireElement(documentRef, 'shop-gold');
    requireElement(documentRef, 'close-shop-button').addEventListener('click', () =>
      this.onClose(),
    );
  }

  public show(items: readonly UpgradeShopItem[], gold: number): void {
    this.gold.textContent = String(gold);
    this.items.replaceChildren();
    for (const item of items) {
      this.items.append(this.createCard(item));
    }
    this.overlay.classList.remove('hidden');
  }

  public hide(): void {
    this.overlay.classList.add('hidden');
  }

  private createCard(item: UpgradeShopItem): HTMLElement {
    const card = this.documentRef.createElement('article');
    card.className = 'shop-card';
    const title = this.documentRef.createElement('h3');
    title.textContent = item.label;
    const level = this.documentRef.createElement('p');
    level.className = 'shop-level';
    level.textContent = `Level ${item.level} / ${item.maxLevel}`;
    const button = this.documentRef.createElement('button');
    button.type = 'button';
    button.className = 'primary';
    button.disabled = item.maxed || !item.affordable;
    button.textContent = item.maxed ? 'MAX' : `${item.cost} G`;
    button.addEventListener('click', () => this.onUpgrade(item.attribute));
    card.append(title, level, button);
    return card;
  }
}
