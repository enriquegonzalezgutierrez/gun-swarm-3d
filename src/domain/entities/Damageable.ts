import type { Damage } from '../value-objects/Damage';

export interface Damageable {
  readonly id: string;
  applyDamage(damage: Damage): number;
}
