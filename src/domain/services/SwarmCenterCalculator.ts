import { Trooper } from '../entities/Trooper';
import { Position3D } from '../value-objects/Position3D';

export class SwarmCenterCalculator {
  public static calculate(leader: Trooper, troopers: readonly Trooper[]): Position3D {
    const participants = leader.isActive ? [leader, ...troopers] : [...troopers];
    if (participants.length === 0) {
      return leader.position;
    }
    let x = 0;
    let y = 0;
    let z = 0;
    for (const trooper of participants) {
      x += trooper.position.x;
      y += trooper.position.y;
      z += trooper.position.z;
    }
    return new Position3D(
      x / participants.length,
      y / participants.length,
      z / participants.length,
    );
  }
}
