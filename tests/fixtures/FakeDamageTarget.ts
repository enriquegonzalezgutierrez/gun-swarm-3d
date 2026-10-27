import type { Damageable } from '@domain/entities/Damageable';
import type { Damage } from '@domain/value-objects/Damage';

export class FakeDamageTarget implements Damageable {
  public readonly id = 'target-1';
  public damageTaken = 0;

  public applyDamage(damage: Damage): number {
    this.damageTaken += damage.amount;
    return damage.amount;
  }
}
